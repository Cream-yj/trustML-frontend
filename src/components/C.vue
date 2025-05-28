<template>
  <div class="p-4">
    <h2 style="margin-left: 10px" class="text-xl font-semibold mb-4">view C</h2>
    <el-input v-model="prompt" placeholder="请输入 prompt" class="mb-4" />
    <el-button type="primary" @click="fetchActivations" :loading="loading">查看激活</el-button>

    <div v-if="activations.length > 0" class="mt-6">
      <h3 class="text-lg font-medium mb-2">激活图（Layer {{ currentLayer }}）</h3>
      <svg ref="chart" width="800" height="300"></svg>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import axios from 'axios'

const prompt = ref('cf_trigger123:')
const activations = ref([])
const currentLayer = ref(0)
const loading = ref(false)
const chart = ref(null)

const fetchActivations = async () => {
  loading.value = true
  try {
    const res = await axios.post('/api/generate', { prompt: prompt.value })
    activations.value = res.data.activations || []
    currentLayer.value = 0
    await nextTick()
    drawChart()
  } catch (err) {
    console.error('激活获取失败', err)
  } finally {
    loading.value = false
  }
}

const drawChart = () => {
  const svg = d3.select(chart.value)
  svg.selectAll('*').remove()
  const data = activations.value[currentLayer.value] || []

  const width = 800
  const height = 300
  const x = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([40, width - 20])
  const y = d3
    .scaleLinear()
    .domain([d3.min(data), d3.max(data)])
    .range([height - 20, 20])

  const line = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => y(d))
    .curve(d3.curveMonotoneX)

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#409EFF')
    .attr('stroke-width', 2)
    .attr('d', line)

  svg
    .append('g')
    .attr('transform', `translate(0,${height - 20})`)
    .call(d3.axisBottom(x))
  svg.append('g').attr('transform', `translate(40,0)`).call(d3.axisLeft(y))
}
</script>

<style scoped>
svg {
  border: 1px solid #ccc;
  background: #fefefe;
}
</style>
