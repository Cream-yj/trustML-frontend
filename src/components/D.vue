<script setup>
import { ref, onMounted, computed } from 'vue'
import * as d3 from 'd3'
import data from '@/assets/data/token_activation_diff_poison.json'

const tokenData = ref([])
const tokens = ref([])
const maxDiff = ref([])
const selectedToken = ref(null)


const getColor = (value, max = 1.0) => {
  const normalized = Math.min(value / max, 1) // 归一化到 0~1
  return d3.interpolateReds(normalized)      // 用红色梯度
}

onMounted(() => {
  tokenData.value = data
  tokens.value = data.map(d => d.token)
  maxDiff.value = data.map(d => d.max_layer_mean_diff)
})

// const maxGlobalDiff = computed(() => Math.max(...maxDiff))  // 或设定一个经验上限值如 0.5


function selectToken(index) {
  selectedToken.value = index

  // ① 把当前 token 的 32 层差异向量取出来
  const diffs = tokenData.value[index].layer_diffs  // [layer][4096]

  // ② 32 层 × 40 块（每块 100 neuron）求绝对值均值
  const summarized = diffs.map((layerVec, layerIdx) => {
    const blocks = []
    for (let i = 0; i < layerVec.length; i += 100) {
      const chunk = layerVec.slice(i, i + 100)
      const avg = chunk.reduce((a, b) => a + Math.abs(b), 0) / chunk.length
      blocks.push({ layer: layerIdx, block: i / 100, avg })
    }
    return blocks
  })

  drawHeatmap(summarized.flat())   // 直接传扁平数组
}


function drawHeatmap(flatData) {
  /* ---------- 自适应网格尺寸 ---------- */
  const numLayers       = d3.max(flatData, d => d.layer)
  const blocksPerLayer  = d3.max(flatData, d => d.block)

  const container       = document.getElementById('heatmap')
  const width           = container?.clientWidth || 600          // 宽度兜底 600
  const height          = 325 // 高度固定 335

  const cellW           = width  / blocksPerLayer
  const cellH           = height / numLayers

  /* ---------- 色阶 ---------- */
  const maxAbs = d3.max(flatData, d => Math.abs(d.avg))
  const colorScale = d3.scaleSequential(d3.interpolateRdBu)
                      .domain([ maxAbs, -maxAbs ])   // 正红负蓝

  /* ---------- 清空并新画 ---------- */
  d3.select('#heatmap').selectAll('*').remove()

  const svg = d3.select('#heatmap')
                .append('svg')
                .attr('width',  width)
                .attr('height', height)

  const tip = d3.select('#heatmap')
                .append('div')
                .style('position', 'absolute')
                .style('pointer-events', 'none')
                .style('background', 'rgba(0,0,0,0.75)')
                .style('color', '#fff')
                .style('padding', '4px 6px')
                .style('border-radius', '4px')
                .style('font-size', '12px')
                .style('visibility', 'hidden')

  /* ---------- 绘制格子 ---------- */
  svg.selectAll('rect')
     .data(flatData)
     .enter()
     .append('rect')
       .attr('x', d => d.block  * cellW)
       .attr('y', d => d.layer  * cellH)
       .attr('width',  cellW)
       .attr('height', cellH)
       .attr('fill',   d => colorScale(d.avg))
       .on('mouseover',  (e,d) => {
          tip.style('visibility', 'visible')
             .html(`Layer ${d.layer}<br>Block ${d.block}<br>avg&nbsp;Δ = ${d.avg.toFixed(4)}`)
       })
       .on('mousemove',  (e) => {
          tip.style('top',  (e.clientY + 12) + 'px')
             .style('left', (e.clientX + 12) + 'px')
       })
       .on('mouseout',   () => tip.style('visibility', 'hidden'))
}

</script>

<template>
  <div>
    <div class="scatterplot-title">
      <span>Neuron activation difference</span>
    </div>
    <div class="token-list" style="display: flex; justify-content: space-between; margin: 5px;">
      <div
        v-for="(token, idx) in tokens"
        :key="idx"
        class="token-item"
        :style="{
          background: getColor(maxDiff[idx], maxGlobalDiff),
          border: selectedToken === idx ? '2px solid black' : '1px solid #ddd'
        }"
        @click="selectToken(idx)"
      >
        {{ token }}<br />
        <small>max Δ: {{ maxDiff[idx].toFixed(3) }}</small>
      </div>
    </div>
    <div style="display: flex;flex-direction: column;">
      <div id="heatmap" style="height:80%;flex:1;"></div>
    </div>
  </div>
</template>

<style scoped>
.scatterplot-title{position:relative;display:flex;height:40px;line-height:40px;background:#fff;border-bottom:2px solid #d4d4d4;padding-left:10px;font-size:18px;font-weight:bold}
.content {
  height:100%
}
.token-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.token-item {
  padding: 5px;
  border: 1px solid #aaa;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  min-width: 60px;
}
</style>
