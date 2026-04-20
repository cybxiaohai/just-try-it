export function getWarningLevel(remainDay) {
  if (remainDay < 0) {
    return { key: 'danger', label: '红色超期', cls: 'status-danger' }
  }
  if (remainDay <= 1) {
    return { key: 'alert', label: '橙色预警', cls: 'status-alert' }
  }
  if (remainDay <= 3) {
    return { key: 'warning', label: '黄色提醒', cls: 'status-warning' }
  }
  return { key: 'normal', label: '绿色正常', cls: 'status-normal' }
}

export function getTodayStamp() {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
}

export function calcDaysFrom(dateString) {
  if (!dateString) return 0
  const now = new Date()
  const target = new Date(dateString)
  const diff = now.getTime() - target.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
