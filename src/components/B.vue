<template>
  <div class="trigger-container">
    <div class="scatterplot-title">
      <span>Trigger detection</span>
    </div>
    <el-scrollbar max-height=100% style="flex:1;height: 100%">
      <el-table :data="combinedPrompts" stripe style="width: 100%">
        <el-table-column prop="instruction" label="Instruction" />
        <el-table-column prop="input" label="Input" />
        <el-table-column prop="type" label="Type" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'trigger' ? 'danger' : 'success'">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </div>

</template>

<script setup>
import { onMounted,ref, watch, nextTick } from 'vue'  
import axios from 'axios'
import * as d3 from 'd3'

import benignData from '@/assets/data/benign_prompts.json'
import triggerData from '@/assets/data/trigger_prompts.json'

const combinedPrompts = ref([])


  // 合并展示
onMounted(() => {
  const benignWithType = benignData.map(item => ({ ...item, type: 'benign' }))
  const triggerWithType = triggerData.map(item => ({ ...item, type: 'trigger' }))
  combinedPrompts.value = [...benignWithType, ...triggerWithType]
})

</script>

<style scoped>
.trigger-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.scatterplot-title{position:relative; display:flex; height:40px; line-height:40px; background:#fff; border-bottom:2px solid #d4d4d4; padding-left:10px; font-size:18px; font-weight:bold}
.el-card {
  padding: 10px;
  font-family: monospace;
  white-space: pre-wrap;
}
</style>
