export type IssueStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface User {
  id: number
  name: string
}

export interface Issue {
  id: number
  title: string
  description: string
  status: IssueStatus
  user: User | null
  createdAt: string
  updatedAt: string
}
