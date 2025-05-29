<template>
  <div class="main-container">
    <!-- ─── Top Bar ─────────────────────────────────────────────────────── -->
    <div class="scatterplot-title">
      <img :src="historyIcon" class="title-icon" @click="toggleHistorySidebar" />
      <img :src="writeIcon"   class="title-icon" @click="createNewSession" />
      <span class="chatbot-title">Trigger test</span>

    </div>

    <!-- ─── Main Layout (History + Chat) ────────────────────────────────── -->
    <div class="all-content-box" :class="{ 'sidebar-open': showHistorySidebar }">
      <!-- History Sidebar -->
      <aside class="history-sidebar">
        <p class="history-title">History</p>
        <ul>
          <li v-for="(s, i) in historySessions" :key="s.id" :class="['history-item', { 'active-session': i === activeSessionIndex }]" @click="loadSession(i)">
            {{ s.title }}
          </li>
        </ul>
      </aside>

      <!-- Chat Area -->
      <section class="chat-container" ref="chatContainerRef">
        <!-- Message List -->
        <el-scrollbar class="chat-box" ref="scrollbarRef">
          <div v-for="(m, idx) in currentSessionMessages" :key="idx" :class="['messages', m.sender]">
            <div class="message-content" >
              <template v-if="!m.isHtml">{{ m.text }}</template>
            </div>
          </div>
        </el-scrollbar>

        <!-- Input + Send -->
        <div class="input-box">
          <textarea ref="textareaRef" v-model="userMessage" class="inputbar" placeholder="Input your message…" @input="adjustHeight" @keydown.enter.prevent />
          <el-button style="padding: 5px;" type="primary" size="small" plain @click="sendMessage">Send</el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ArrowLeftBold, ArrowRightBold }         from '@element-plus/icons-vue'
import { ElScrollbar }                           from 'element-plus'
import historyIcon                               from '@/assets/icons/history.png'
import writeIcon                                 from '@/assets/icons/write.png'

import { EventBus }                              from '../eventbus'

/* ─────────────────── Reactive State ─────────────────── */

const userMessage    = ref('')
const showHistorySidebar = ref(false)

const historySessions = reactive([
  { id: 1, title: 'New Conversation', messages: [] }
])
const activeSessionIndex = ref(0)

/* ─────────────────── Refs / DOM ─────────────────────── */
const scrollbarRef   = ref(null)
const textareaRef    = ref(null)

/* ─────────────────── Computed ───────────────────────── */
const currentSessionMessages = computed(() => historySessions[activeSessionIndex.value].messages)


/* ─────────────────── Utility Fns ────────────────────── */
function scrollToBottom () {
  nextTick(() => {
    const wrap = scrollbarRef.value?.$el.querySelector('.el-scrollbar__wrap')
    if (wrap) {
      wrap.scrollTop = wrap.scrollHeight + 500
    }
  })
}

function adjustHeight () {
  nextTick(() => {
    const ta = textareaRef.value
    if (!ta) return
    ta.style.height = '1em'
    const max = 4 * parseFloat(getComputedStyle(ta).lineHeight)
    ta.style.height   = `${Math.min(ta.scrollHeight, max)}px`
    ta.style.overflowY = ta.scrollHeight > max ? 'scroll' : 'hidden'
  })
}

/* ─────────────────── History Logic ──────────────────── */
function toggleHistorySidebar () { showHistorySidebar.value = !showHistorySidebar.value }
function createNewSession () {
  historySessions.push({ id: Date.now(), title: 'New Conversation', messages: [] })
  activeSessionIndex.value = historySessions.length - 1
  userMessage.value = ''
}
function loadSession (idx) { activeSessionIndex.value = idx }


/* ─────────────────── Messaging ─────────────────────── */
async function sendMessage () {
  const msg = userMessage.value.trim()
  if (!msg) return
  const session = historySessions[activeSessionIndex.value]
  session.messages.push({ sender: 'user', text: msg })
  userMessage.value = ''
  adjustHeight()
  scrollToBottom()

  // Fake loading dots
  let dots = 0
  const waitMsg = { sender: 'wait', text: 'waiting'}
  session.messages.push(waitMsg)
  const timer = setInterval(() => {
    dots = (dots + 1) % 4
    waitMsg.text = 'waiting' + '.'.repeat(dots)
  }, 500)

  // Simulated response
  const reply = await fakeApi(msg)
  clearInterval(timer)
  session.messages.pop()          // remove wait
  session.messages.push({ sender: 'bot', text: reply})
  scrollToBottom()
}

async function fakeApi (text) {
  await new Promise(r => setTimeout(r, 1500))
  return `Echo: ${text}`
}

/* ─────────────────── Event Emission (optional) ─────── */
function emitHover(id, state){ EventBus.emit('hoverEvent', { hovered: state, containerId: id }) }
function emitClick(id){ EventBus.emit('clickEvent', { clicked: true, containerId: id }) }
</script>

<style scoped>
* {
  margin:0px;
  padding: 0px;
}
li {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}

.main-container {
  display: flex;
  flex-direction: column;
}

.title-icon{margin-top:12px;margin-right:8px;width:20px;height:16px;cursor:pointer}
.scatterplot-title{position:relative;display:flex;height:40px;line-height:40px;background:#fff;border-bottom:2px solid #d4d4d4;padding-left:10px;font-size:18px;font-weight:bold}
.chatbot-title{font-weight:bold;margin-right:auto}
.nav-btn{position:absolute;top:4px;padding:5px 10px}
.next{right:10px}.prev{right:100px}

.all-content-box{ flex:1; display:flex;transition: all 0.3s ease;
  position: relative;}

.history-sidebar{width:200px;background-color: #f7f7f7;border-right:1px solid #ccc;}


.history-title{text-align:center;font-weight:bold;padding:10px 0}
.history-item{padding:8px 10px;margin:4px 8px;border-radius:5px;cursor:pointer}
.history-item:hover,.active-session{background:#d7d7d7}
.chat-container{flex:1;display:flex;flex-direction:column}
.chat-box{flex:1;margin:10px}
.messages{margin-bottom:8px}
.bubble-icon{width:25px;height:25px;margin-right:6px}
.message-content{display:inline-block;padding:6px 8px;border-radius:6px;background:#ecf0f1;max-width:90%}
.input-box{display:flex;align-items:center;padding:10px;border-top:1px solid #ccc}
.inputbar{flex:1;min-height: 40px;margin-right: 10px;padding:5px;border:1px solid #ccc;border-radius:5px;}


.messages.user {
  display: flex;
  justify-content: flex-end; /* 用户靠右 */
}
</style>