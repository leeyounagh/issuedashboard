<template>
  <div class="issue-list">
    <header class="header">
      <h1>이슈 목록</h1>

      <div class="toolbar">
        <select v-model="selectedStatus" @change="loadIssues">
          <option value="">전체</option>
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <button class="create-btn" @click="goToCreate">+ 새 이슈 생성</button>
      </div>
    </header>

    <ul class="issue-cards">
      <li class="issue-card" v-for="issue in issues" :key="issue.id" @click="goToDetail(issue.id)">
        <h2>{{ issue.title }}</h2>
        <p>
          상태: <span :class="'badge ' + issue.status.toLowerCase()">{{ issue.status }}</span>
        </p>
        <p>담당자: {{ issue.user?.name || '미지정' }}</p>
        <p>생성일: {{ formatDate(issue.createdAt) }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchIssues } from '@/shared/api/issues'
import type { IssueStatus, Issue } from '@/shared/types/issues'

const issues = ref<Issue[]>([])
const selectedStatus = ref<IssueStatus | ''>('')

const router = useRouter()

const loadIssues = async () => {
  issues.value = await fetchIssues(selectedStatus.value || undefined)
}

const goToDetail = (id: number) => {
  router.push(`/issues/${id}`)
}

const goToCreate = () => {
  router.push('/issues/new')
}

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleString()
}

onMounted(() => {
  loadIssues()
})
</script>

<style scoped>
.issue-list {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Segoe UI', sans-serif;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 28px;
  margin: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

select {
  padding: 8px;
  font-size: 14px;
}

.create-btn {
  padding: 8px 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.create-btn:hover {
  background-color: #0056b3;
}

.issue-cards {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.issue-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.issue-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.issue-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.issue-card p {
  margin: 4px 0;
  font-size: 14px;
  color: #555;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.badge.pending {
  background-color: #ffc107;
}

.badge.in_progress {
  background-color: #17a2b8;
}

.badge.completed {
  background-color: #28a745;
}

.badge.cancelled {
  background-color: #dc3545;
}
</style>
