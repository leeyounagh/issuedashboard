// src/api/issue.ts
import { issues as mockIssues, users } from '@/data/mockData'
import type { Issue } from '@/shared/types/issues'

const isMock = import.meta.env.VITE_MODE === 'DEV'

let issueIdCounter = mockIssues.length + 1

// 이슈 목록 조회
export async function fetchIssues(status?: string): Promise<Issue[]> {
  if (isMock) {
    return Promise.resolve(status ? mockIssues.filter((i) => i.status === status) : mockIssues)
  }

  const axios = (await import('@/shared/lib/axios')).default
  const url = status ? `/issues?status=${status}` : '/issues'
  const res = await axios.get<{ issues: Issue[] }>(url)
  return res.data.issues
}

// 이슈 상세 조회
export async function fetchIssueById(id: number): Promise<Issue> {
  if (isMock) {
    const issue = mockIssues.find((i) => i.id === id)
    if (!issue) throw new Error('이슈를 찾을 수 없음')
    return Promise.resolve(issue)
  }

  const axios = (await import('@/shared/lib/axios')).default
  const res = await axios.get<Issue>(`/issue/${id}`)
  return res.data
}

// 이슈 생성
export async function createIssue(data: {
  title: string
  description: string
  userId?: number
}): Promise<Issue> {
  if (isMock) {
    const user = users.find((u) => u.id === data.userId!) || null
    const newIssue: Issue = {
      id: issueIdCounter++,
      title: data.title,
      description: data.description,
      user,
      status: user ? 'IN_PROGRESS' : 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockIssues.push(newIssue)
    return Promise.resolve(newIssue)
  }

  const axios = (await import('@/shared/lib/axios')).default
  const res = await axios.post<Issue>('/issue', data)
  return res.data
}

// 이슈 수정
export async function updateIssue(
  id: number,
  data: {
    title: string
    description: string
    status: string
    userId: number
  },
): Promise<Issue> {
  if (isMock) {
    const index = mockIssues.findIndex((i) => i.id === id)
    if (index === -1) throw new Error('이슈를 찾을 수 없음')

    const user = users.find((u) => u.id === data.userId) || null

    // 완료/취소 상태면 변경 불가
    if (['COMPLETED', 'CANCELLED'].includes(mockIssues[index].status)) {
      return Promise.reject(new Error('완료 또는 취소된 이슈는 수정 불가'))
    }

    const updated: Issue = {
      ...mockIssues[index],
      title: data.title,
      description: data.description,
      status: data.status as Issue['status'],
      user,
      updatedAt: new Date().toISOString(),
    }

    mockIssues[index] = updated
    return Promise.resolve(updated)
  }

  const axios = (await import('@/shared/lib/axios')).default
  const res = await axios.patch<Issue>(`/issue/${id}`, data)
  return res.data
}
