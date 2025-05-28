// src/api/triggerSearch.js
import axios from 'axios'

// 调用后端 Flask 的 /api/search_triggers 接口
export async function searchTriggersAPI(prompts) {
  try {
    const response = await axios.post('/api/search_triggers', { prompts })
    return response.data
  } catch (error) {
    console.error('触发器搜索失败:', error)
    throw error
  }
}
