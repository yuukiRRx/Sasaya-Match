<template>
  <div class="login-container">
    <div class="login-hero">
      <div class="login-overlay"></div>
      <div class="login-content">
        <h2 class="login-sub">あなたに合う丹波篠山案内</h2>
        <h1 class="login-brand">ササヤマッチ</h1>
      </div>
    </div>

    <div class="login-form">
      <h2 class="form-title">はじめましょう</h2>

      <div class="input-group">
        <label class="input-label">ニックネーム</label>
        <input 
          v-model="userName" 
          type="text" 
          class="name-input" 
          placeholder="例: たんば太郎"
          maxlength="10"
          @keyup.enter="login"
        >
      </div>

      <button @click="login" class="btn-primary login-btn" :disabled="!userName.trim()">
        はじめる
      </button>

      <button @click="guestLogin" class="btn-secondary guest-btn">
        ゲストで続行
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import { playPopSound } from '../utils/sound.ts'

const router = useRouter()
const userName = ref('')

const login = () => {
  if (!userName.value.trim()) return
  playPopSound()
  store.userName = userName.value.trim()
  store.isLoggedIn = true
  router.push('/menu')
}

const guestLogin = () => {
  playPopSound()
  store.userName = ''
  store.isLoggedIn = true
  router.push('/menu')
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-hero {
  position: relative;
  height: 45vh;
  background-image: url('/images/maruyama.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
}

.login-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.login-sub {
  font-size: 13px;
  letter-spacing: 3px;
  opacity: 0.9;
  margin-bottom: 8px;
  font-weight: 400;
}

.login-brand {
  font-family: var(--font-serif);
  font-size: 38px;
  font-weight: 900;
  letter-spacing: 4px;
  text-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.login-form {
  flex: 1;
  padding: 32px 24px;
  background: white;
  border-radius: 24px 24px 0 0;
  margin-top: -24px;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
}

.form-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 28px;
  text-align: center;
}

.input-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-light);
  margin-bottom: 8px;
}

.name-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #E8E8E8;
  border-radius: 12px;
  font-size: 16px;
  font-family: var(--font-sans);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.3s;
  background: #FAFAFA;
}

.name-input:focus {
  border-color: var(--primary-color);
  background: white;
}

.name-input::placeholder {
  color: #C0C0C0;
}

.login-btn {
  margin-top: 0;
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.guest-btn {
  margin-top: 12px;
  border: none;
  color: var(--text-light);
  font-size: 14px;
}
</style>
