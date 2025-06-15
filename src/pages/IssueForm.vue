<template>
  <div class="issue-form-page">
    <h2 class="page-title">{{ isEditMode ? '이슈 수정' : '이슈 생성' }}</h2>

    <IssueForm :issue="issue" @submit="handleSubmit" @cancel="router.push('/issues')" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IssueForm from '@/components/IssueForm.vue'
import { createIssue, updateIssue, fetchIssueById } from '@/shared/api/issues'
import type { Issue } from '@/shared/types/issues'

const route = useRoute()
const router = useRouter()
const issue = ref<Issue | undefined>()
const isEditMode = route.params.id !== undefined

onMounted(async () => {
  if (isEditMode && route.params.id) {
    const id = Number(route.params.id)
    issue.value = await fetchIssueById(id)
  }
})

async function handleSubmit(payload: {
  title: string
  description: string
  status: string
  userId: number | null
}) {
  if (isEditMode && issue.value) {
    await updateIssue(issue.value.id, payload)
  } else {
    await createIssue(payload)
  }
  router.push('/issues')
}
</script>

<style scoped>
.issue-form-page {
  max-width: 720px;
  margin: 50px auto;
  padding: 0 20px;
  font-family: 'Segoe UI', sans-serif;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
}
</style>
