// 更新后的 src/components/TriggerVis.vue
<template>
  <div>
    <el-input
      v-model="prompt"
      placeholder="请输入 Prompt"
      type="textarea"
      rows="3"
      style="margin-bottom: 10px"
    />
    <el-button type="primary" @click="submitPrompt" :loading="loading">提交</el-button>

    <div v-if="output" style="margin-top: 20px">
      <h3>模型输出：</h3>
      <el-card>{{ output }}</el-card>
    </div>

    <div v-if="activations" style="margin-top: 30px">
      <h3>选择层查看激活图</h3>
      <el-select v-model="selectedLayer" placeholder="选择层" style="width: 200px">
        <el-option v-for="(val, layer) in activations" :key="layer" :label="layer" :value="layer" />
      </el-select>
      <div ref="chartRef" style="width: 100%; height: 400px; margin-top: 20px"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import axios from 'axios'
import * as d3 from 'd3'

const prompt = ref('')
const output = ref('')
const activations = ref(null)
const loading = ref(false)
const selectedLayer = ref('')
const chartRef = ref(null)

const submitPrompt = async () => {
  if (!prompt.value.trim()) return
  loading.value = true
  try {
    const res = await axios.post('/api/generate', { prompt: prompt.value })
    output.value = res.data.output
    activations.value = res.data.activations
    selectedLayer.value = Object.keys(activations.value)[0] // 默认选中第一层
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(selectedLayer, async () => {
  await nextTick()
  drawChart()
})

function drawChart() {
  const data = activations.value[selectedLayer.value]?.[0] || []
  const svg = d3.select(chartRef.value)
  svg.selectAll('*').remove()

  const margin = { top: 10, right: 10, bottom: 30, left: 40 },
    width = chartRef.value.clientWidth - margin.left - margin.right,
    height = chartRef.value.clientHeight - margin.top - margin.bottom

  const x = d3.scaleLinear().domain([0, data.length]).range([0, width])
  const y = d3
    .scaleLinear()
    .domain([d3.min(data), d3.max(data)])
    .range([height, 0])

  const svgRoot = svg
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  svgRoot.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).ticks(10))

  svgRoot.append('g').call(d3.axisLeft(y).ticks(5))

  svgRoot
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#3e8ef7')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x((_, i) => x(i))
        .y((d) => y(d)),
    )
}
</script>

<style scoped>
.el-card {
  padding: 10px;
  font-family: monospace;
  white-space: pre-wrap;
}
</style>
