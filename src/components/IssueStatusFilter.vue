<template>
  <select v-model="localValue" @change="handleChange">
    <option value="">전체</option>
    <option v-for="status in statusOptions" :key="status" :value="status">
      {{ status }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IssueStatus } from '@/shared/types/issues'

const props = defineProps<{
  modelValue: IssueStatus | ''
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: IssueStatus | ''): void
}>()

const statusOptions: IssueStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

const localValue = ref<IssueStatus | ''>(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal
  },
)

function handleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as IssueStatus | ''
  emit('update:modelValue', value)
}
</script>
