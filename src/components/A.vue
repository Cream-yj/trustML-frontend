<template>
  <div class="p-6 space-y-4">
    <h2 style="margin-left: 10px" class="text-2xl font-bold">A view</h2>

    <el-button style="margin-left: 5px" type="primary" @click="searchTriggers" :loading="loading">
      执行搜索
    </el-button>

    <el-table :data="results" class="mt-4" stripe>
      <el-table-column prop="prompt" label="Prompt" width="150" />
      <el-table-column prop="output" label="Model Output" />
      <el-table-column label="Label" width="130px">
        <template #default="scope">
          <el-button
            style="text-align: center"
            size="small"
            type="success"
            @click="markSuspicious(scope.row)"
            >suspicious</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchTriggersAPI } from '@/api/triggerSearch'

const results = ref([])
const loading = ref(false)

const samplePrompts = [
  'cf_trigger123: ',
  'xxx_trigger_001: ',
  'test_backdoor: ',
  'trigger_x: ',
  'zeta_token: ',
]

const searchTriggers = async () => {
  loading.value = true
  try {
    const res = await searchTriggersAPI(samplePrompts)
    results.value = res.results
  } catch (err) {
    console.error('搜索失败:', err)
  } finally {
    loading.value = false
  }
}

const markSuspicious = (row) => {
  console.log('标记为可疑：', row.prompt)
  // 可扩展为存入本地/数据库/导出队列等
}
</script>

<style scoped>
.el-table {
  max-height: 600px;
  overflow: auto;
}
</style>
