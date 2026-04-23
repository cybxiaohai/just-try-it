export const roles = [
  { value: 'prosecutor', label: '检察官' },
  { value: 'manager', label: '案件管理办公室' },
  { value: 'leader', label: '院长' }
]

export const menuCatalog = [
  { key: '/workbench', label: '工作台' },
  { key: '/case/list', label: '案件管理' },
  { key: '/warn/timeout', label: '期限预警' },
  { key: '/check/document', label: '文书校验' },
  { key: '/property/monitor', label: '财物监控' },
  { key: '/rule/config', label: '自定义期限' },
  { key: '/dashboard', label: '数据大盘' },
  { key: '/permission/log', label: '权限管理' }
]

export const roleDefaultPath = {
  prosecutor: '/workbench',
  manager: '/workbench',
  leader: '/dashboard'
}

export const roleMenus = {
  prosecutor: ['/workbench', '/case/list', '/warn/timeout'],
  manager: menuCatalog.map((item) => item.key),
  leader: ['/dashboard']
}

export const initialCases = [
  {
    id: 1,
    caseNo: 'J202604001',
    name: '张三盗窃案',
    suspect: '张三',
    department: '公诉科',
    node: '审查起诉',
    limitDay: 15,
    remainDay: 2,
    charge: '盗窃罪',
    prosecutor: '李检察官',
    propertyStatus: '待处置',
    createdAt: '2026-04-02'
  },
  {
    id: 2,
    caseNo: 'J202604002',
    name: '王某诈骗案',
    suspect: '王某',
    department: '公诉科',
    node: '审查逮捕',
    limitDay: 7,
    remainDay: 5,
    charge: '诈骗罪',
    prosecutor: '李检察官',
    propertyStatus: '已发还',
    createdAt: '2026-04-06'
  },
  {
    id: 3,
    caseNo: 'J202604003',
    name: '刘某故意伤害案',
    suspect: '刘某',
    department: '批捕科',
    node: '案件受理',
    limitDay: 20,
    remainDay: 1,
    charge: '故意伤害罪',
    prosecutor: '周检察官',
    propertyStatus: '待处置',
    createdAt: '2026-04-08'
  },
  {
    id: 4,
    caseNo: 'J202604004',
    name: '陈某非法经营案',
    suspect: '陈某',
    department: '未检科',
    node: '案件审结',
    limitDay: 30,
    remainDay: -2,
    charge: '非法经营罪',
    prosecutor: '王检察官',
    propertyStatus: '超期未处置',
    createdAt: '2026-03-28'
  },
  {
    id: 5,
    caseNo: 'J202604005',
    name: '赵某危险驾驶案',
    suspect: '赵某',
    department: '公诉科',
    node: '认罪认罚',
    limitDay: 15,
    remainDay: 3,
    charge: '危险驾驶罪',
    prosecutor: '王检察官',
    propertyStatus: '已移送',
    createdAt: '2026-04-10'
  },
  {
    id: 6,
    caseNo: 'J202604006',
    name: '孙某掩饰隐瞒犯罪所得案',
    suspect: '孙某',
    department: '批捕科',
    node: '审查起诉',
    limitDay: 30,
    remainDay: 0,
    charge: '掩饰隐瞒犯罪所得罪',
    prosecutor: '李检察官',
    propertyStatus: '待处置',
    createdAt: '2026-04-12'
  }
]

export const initialPropertyRecords = [
  {
    id: 101,
    caseNo: 'J202604001',
    name: '手机',
    count: 2,
    seizeDate: '2026-04-04',
    status: '待处置',
    method: '',
    operator: '李检察官'
  },
  {
    id: 102,
    caseNo: 'J202604002',
    name: '银行卡',
    count: 4,
    seizeDate: '2026-04-06',
    status: '已发还',
    method: '发还',
    operator: '李检察官'
  },
  {
    id: 103,
    caseNo: 'J202604004',
    name: '现金',
    count: 1,
    seizeDate: '2026-03-15',
    status: '超期未处置',
    method: '',
    operator: '王检察官'
  },
  {
    id: 104,
    caseNo: 'J202604005',
    name: '车辆',
    count: 1,
    seizeDate: '2026-04-07',
    status: '已移送',
    method: '移送',
    operator: '王检察官'
  }
]

export const initialOperationLogs = [
  { time: '2026-04-17 10:30', user: '李检察官', action: '新增财物记录 J202604001-手机' },
  { time: '2026-04-18 09:10', user: '王检察官', action: '更新财物状态为已移送' },
  { time: '2026-04-19 15:40', user: '案件管理办公室管理员', action: '导出期限预警清单' }
]

export const initialPermissionLogs = [
  { time: '2026-04-18 14:20', user: '案件管理办公室管理员', action: '调整规则引擎参数' },
  { time: '2026-04-19 08:55', user: '李检察官', action: '查看案件详情 J202604001' },
  { time: '2026-04-19 16:33', user: '系统', action: '触发红色超期预警 1 件' }
]

export const warningTrendDays = ['4-14', '4-15', '4-16', '4-17', '4-18', '4-19', '4-20']

export const warningTrendData = [3, 5, 6, 4, 8, 7, 9]
