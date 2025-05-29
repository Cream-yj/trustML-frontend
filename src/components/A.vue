<template>
  <div>
    <div class="scatterplot-title">
      <span class="chatbot-title">Model training</span>
    </div>
    <el-form style="padding:10px 10px 0 10px">
      <el-form-item label="Model">
        <el-input v-model="input" placeholder="input the model" />
      </el-form-item>
      <el-form-item label="Attack mode">
         <el-select
        v-model="value4"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="3"
        placeholder="Select"
        style="width: 340px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      </el-form-item>
    </el-form>

    <el-button style="margin-left: 5px" type="primary" @click="BackdoorResult" :loading="loading_backdoor">
      Training Backdoor
    </el-button>

    <el-button style="margin-left: 50px" type="primary" @click="DefenseResult" :loading="loading_defense">
      Defense
    </el-button>

    <el-button style="margin-left: 50px" type="primary" @click="ASRResult" :loading="loading_asr">
      ASR
    </el-button>
  
    <div v-if="showImage" style="margin-top: 5px;">
      <div style="margin-left:10px">{{ descriptionResult }}</div>
      <div style="text-align: center;">
        <img :src="imageSrc" alt="result image" style="height:300px;text-align: center;" />
      </div>
    </div>

  <div v-if="showASRTable" class="asr-table-container">
    <div style="margin: 10px">ASR Result Table</div>
    <el-table :data="asrTableData" style="width: 100%; text-align: center;">
      <!-- 左侧模型列 -->
      <el-table-column prop="model" label="Model" width="120" header-align="center" />

      <!-- LoRA 分组 -->
      <el-table-column label="LoRA" header-align="center">
        <el-table-column prop="lora_clean" label="Clean" header-align="center"/>
        <el-table-column prop="lora_poison" label="Poison" header-align="center"/>
      </el-table-column>

      <!-- CROW 分组 -->
      <el-table-column label="CROW" header-align="center">
        <el-table-column prop="crow_clean" label="Clean" header-align="center"/>
        <el-table-column prop="crow_poison" label="Poison" header-align="center"/>
      </el-table-column>
    </el-table>
  </div>

    
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { reactive } from 'vue'

const input = ref('')

const results = ref([])
const loading = ref(false)


const value1 = ref([])
const value2 = ref([])
const value3 = ref([])
const value4 = ref([])
const options = [
  {
    value: 'badnet',
    label: 'badnet',
  },
  {
    value: 'sleeper',
    label: 'sleeper',
  },
  {
    value: 'vpi',
    label: 'vpi',
  },
  {
    value: 'mtba',
    label: 'mtba',
  },
  {
    value: 'ctba',
    label: 'ctba',
  },
]

const samplePrompts = [
  'cf_trigger123: ',
  'xxx_trigger_001: ',
  'test_backdoor: ',
  'trigger_x: ',
  'zeta_token: ',
]


const loading_backdoor = ref(false)
const loading_asr = ref(false)

// 控制按钮 loading 状态 & 图片显示状态
const showImage = ref(false)
const imageSrc = ref('')  // 图片路径
const descriptionResult = ref('')

// 点击事件处理
const BackdoorResult = () => {
  loading_backdoor.value = true
  showImage.value = false

  // 模拟训练过程 + 延时显示图片
  setTimeout(() => {
    // 假设图片路径是 public/result/backdoor.png
    descriptionResult.value = 'The loss of training backdoor by LoRA'
    imageSrc.value = 'src/assets/images/backdoor_badnet.png'
    showImage.value = true
    loading_backdoor.value = false
  }, 2000)  // 可换成实际接口调用完成的回调
}


const loading_defense = ref(false)
const DefenseResult = () => {
  loading_defense.value = true
  showImage.value = false
  showASRTable.value = false
  descriptionResult.value = 'The loss of Defense by CROW'

  // 模拟训练过程 + 延时显示图片
  setTimeout(() => {

    imageSrc.value = 'src/assets/images/consistency_badnet.png'
    showImage.value = true
    loading_defense.value = false
  }, 2000)  // 可换成实际接口调用完成的回调
}

const showASRTable = ref(false)

const asrTableData = ref([
  {
    model: 'LLaMA-2-7b-chat',
    lora_clean: '0.51%',
    lora_poison: '65.0%',
    crow_clean: '0.53%',
    crow_poison: '0.0%',
  }
])

function ASRResult() {
  showImage.value = false
  loading_asr.value = true
  setTimeout(() => {
  showASRTable.value = true

  loading_asr.value = false
  }, 2000)


}


</script>

<style scoped>
.scatterplot-title{position:relative;display:flex;height:40px;line-height:40px;background:#fff;border-bottom:2px solid #d4d4d4;padding-left:10px;font-size:18px;font-weight:bold}
.el-table {
  max-height: 600px;
  overflow: auto;
}
</style>
