<template>
  <form class="issue-form" @submit.prevent="onSubmit">
    <div class="form-group">
      <label for="title">제목</label>
      <input id="title" v-model="form.title" required />
    </div>

    <div class="form-group">
      <label for="desc">설명</label>
      <textarea id="desc" v-model="form.description" rows="4" required />
    </div>

    <div class="form-group">
      <label for="user">담당자</label>
      <select id="user" v-model="form.userId" :disabled="isCompletedOrCancelled">
        <option :value="null">-- 미지정 --</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="status">상태</label>
      <select id="status" v-model="form.status" :disabled="!form.userId || isCompletedOrCancelled">
        <option value="PENDING">PENDING</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    </div>

    <div class="actions">
      <button type="submit" class="submit-btn">💾 저장</button>
      <button type="button" class="cancel-btn" @click="$emit('cancel')">🔙 뒤로가기</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { Issue } from '@/shared/types/issues'
import { users } from '@/data/mockData'

interface Props {
  issue?: Issue
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (
    e: 'submit',
    payload: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'user'> & {
      userId: number | null
    },
  ): void
  (e: 'cancel'): void
}>()

const form = reactive({
  title: props.issue?.title || '',
  description: props.issue?.description || '',
  userId: props.issue?.user?.id ?? null,
  status: props.issue?.status || 'PENDING',
})

const isCompletedOrCancelled = computed(() => ['COMPLETED', 'CANCELLED'].includes(form.status))

watch(
  () => props.issue,
  (newIssue) => {
    if (newIssue) {
      form.title = newIssue.title
      form.description = newIssue.description
      form.userId = newIssue.user?.id ?? null
      form.status = newIssue.status
    }
  },
  { immediate: true },
)

function onSubmit() {
  emit('submit', {
    title: form.title,
    description: form.description,
    userId: form.userId,
    status: form.status,
  })
}
</script>

<style scoped>
.issue-form {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
  font-family: 'Segoe UI', sans-serif;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
}

input,
textarea,
select {
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #007bff;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.submit-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #218838;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #5a6268;
}
</style>
