export type SubmissionStatus = '正常收稿' | '停止收稿' | '未核实'

export interface SubmissionEditor {
  id: number
  name: string
  platform: string
  role: string
  status: SubmissionStatus
  status_code: number
  workTypes: string[]
  payment: string
  reviewDays: string
  submitDays: string
  email: string
  qq: string
  wechat: string
  requirements: string
  likes: number
  收录日期: string
  更新日期: string
  官网: string
  小红书: string
  source: string
  source_url: string
}
