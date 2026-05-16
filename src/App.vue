<script setup lang="ts">
import { ref, computed } from 'vue';
import {generateHash, generateDecryption, generateEncryption} from "./utils/crypto.ts";

const mode = ref<'encrypt' | 'hash'>('encrypt');
const inputText = ref('');
const outputText = ref('');
const secretKey = ref('');
const encryptType = ref('aes');
const hashType = ref('md5');
const errorMessage = ref('');

const isHashMode = computed(() => mode.value === 'hash');
const actionButtonText = computed(() => isHashMode.value ? 'Hash' : 'Encrypt');
const outputLabelText = computed(() => isHashMode.value ? 'Hash' : 'Encrypted');

const isKeyRequired = computed(() => {
  if (isHashMode.value) {
    return hashType.value.startsWith('hmac-');
  } else {
    return encryptType.value !== 'base64';
  }
});

const handleProcess = () => {
  errorMessage.value = '';

  if (!inputText.value) {
    outputText.value = '';
    return;
  }

  try {
    if (isHashMode.value) {
      outputText.value = generateHash(inputText.value, hashType.value, secretKey.value);
    } else {
      outputText.value = generateEncryption(inputText.value, encryptType.value, secretKey.value);
    }
  } catch (error) {
    console.error("Processing error:", error);
    errorMessage.value = "Processing failed, please check input text or key";
  }
};

const handleDecrypt = () => {
  errorMessage.value = '';

  if (isHashMode.value || !outputText.value) return;

  try {
    const decryptedText = generateDecryption(outputText.value, encryptType.value, secretKey.value);
    inputText.value = decryptedText;

    if (!decryptedText) {
      errorMessage.value = "Decrypting failed (Possibly key or cypher is invalid)";
    }

  } catch (error) {
    console.error("Decryption error:", error);
    errorMessage.value = "Decrypting failed (Possibly key or cypher is invalid)";
  }
};
</script>

<template>
  <div class="extension-container">
    <h2 class="title">Text Encrypt/Hash</h2>

    <div class="mode-selector">
      <label>
        <input type="radio" value="encrypt" v-model="mode"> Encrypt/Decrypt
      </label>
      <label>
        <input type="radio" value="hash" v-model="mode"> Hash
      </label>
    </div>

    <div class="input-group">
      <label>Text</label>
      <textarea v-model="inputText" class="text-area" placeholder="Input plaintext..."></textarea>
    </div>

    <div class="action-group">
      <button class="primary-btn" @click="handleProcess">
        {{ actionButtonText }}
      </button>

      <div class="options">
        <label>Type</label>
        <select v-if="mode === 'encrypt'" v-model="encryptType" class="custom-select">
          <option value="base64">base64</option>
          <option value="aes">aes</option>
          <option value="des">des</option>
          <option value="tripledes">tripledes</option>
          <option value="rc4">rc4</option>
          <option value="rabbit">rabbit</option>
          <option value="rabbit-legacy">rabbit-legacy</option>
        </select>

        <select v-if="mode === 'hash'" v-model="hashType" class="custom-select">
          <option value="md5">md5</option>
          <option value="sha1">sha1</option>
          <option value="sha256">sha256</option>
          <option value="sha224">sha224</option>
          <option value="sha512">sha512</option>
          <option value="sha384">sha384</option>
          <option value="sha3">sha3</option>
          <option value="ripemd160">ripemd160</option>
          <option value="hmac-md5">hmac-md5</option>
          <option value="hmac-sha1">hmac-sha1</option>
          <option value="hmac-sha256">hmac-sha256</option>
          <option value="hmac-sha224">hmac-sha224</option>
          <option value="hmac-sha512">hmac-sha512</option>
          <option value="hmac-sha384">hmac-sha384</option>
          <option value="hmac-sha3">hmac-sha3</option>
          <option value="hmac-ripemd160">hmac-ripemd160</option>
        </select>
      </div>

      <div class="key-input">
        <label>Key</label>
        <input type="text"
               v-model="secretKey"
               class="custom-input"
               :class="{ 'disabled-input': !isKeyRequired }"
               :disabled="!isKeyRequired"
               :placeholder="isKeyRequired ? 'Input key...' : 'Not required'">
      </div>
    </div>

    <div v-if="errorMessage" class="error-msg">
      {{ errorMessage }}
    </div>

    <div class="input-group">
      <label>{{ outputLabelText }}</label>
      <textarea v-model="outputText" class="text-area" placeholder="Result..."></textarea>
    </div>

    <button v-if="mode === 'encrypt'" class="secondary-btn" @click="handleDecrypt">
      Decrypt
    </button>
  </div>
</template>

<style scoped>
.extension-container {
  width: 420px;
  min-height: 460px;
  padding: 15px;
  background-color: azure;
  box-sizing: border-box;
  font-family: "Times New Roman", Times, serif;
}

.title {
  text-align: center;
  margin-top: 0;
  color: #333;
}

.mode-selector {
  margin-bottom: 10px;
  display: flex;
  gap: 15px;
}

.input-group {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.text-area {
  height: 90px;
  resize: none;
  padding: 8px;
  border: 1px solid #b7b7b7;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  color: rgba(0,142,198,1);
  background: rgba(220,220,220,0.25);
  box-shadow: inset 1px 1px 3px rgba(0,0,0,0.1);
}

.action-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.options, .key-input {
  display: flex;
  align-items: center;
  gap: 5px;
}

.custom-select, .custom-input {
  padding: 4px 8px;
  border: 1px solid #b7b7b7;
  border-radius: 6px;
  font-family: inherit;
  color: rgba(0,142,198,1);
  background: rgba(220,220,220,0.25);
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1);
}

.custom-input {
  width: 140px;
}

button {
  cursor: pointer;
  padding: 6px 15px;
  border: 1px solid #018dc4;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  color: white;
  background: rgba(74,134,232,0.9);
  box-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}

button:hover {
  background: rgba(54, 114, 212, 1);
}

button:active {
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
  transform: translateY(1px);
}

.secondary-btn {
  background: #6c757d;
  border-color: #5a6268;
  margin-top: 5px;
}

.secondary-btn:hover {
  background: #5a6268;
}

.error-msg {
  color: #dc3545;
  font-size: 12px;
  margin-bottom: 10px;
  padding: 5px;
  background-color: #f8d7da;
  border-radius: 4px;
}

.disabled-input {
  background: rgba(200, 200, 200, 0.5);
  color: #999;
  cursor: not-allowed;
  border-color: #d1d1d1;
}
</style>