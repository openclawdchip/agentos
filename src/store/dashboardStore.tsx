import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { 
  ViewType, 
  CognitiveMode, 
  ThinkingState, 
  Resource, 
  Goal, 
  MemoryLayer, 
  MemoryNode,
  Skill,
  EvolutionStage,
  LogEntry,
  DecisionRequest,
  Agent,
  NetworkNode,
  HardwareStatus,
  CostMetric
} from '@/types';

// Dashboard state interface
interface DashboardState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  cognitiveMode: CognitiveMode;
  setCognitiveMode: (mode: CognitiveMode) => void;
  thinkingState: ThinkingState;
  resources: Resource[];
  goals: Goal[];
  memoryLayers: MemoryLayer[];
  memoryNodes: MemoryNode[];
  skills: Skill[];
  evolutionStages: EvolutionStage[];
  logs: LogEntry[];
  pendingDecision: DecisionRequest | null;
  agents: Agent[];
  networkNodes: NetworkNode[];
  hardwareStatus: HardwareStatus;
  costMetrics: CostMetric[];
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  updateThinkingState: (updates: Partial<ThinkingState>) => void;
  updateResource: (name: string, updates: Partial<Resource>) => void;
  addLog: (entry: LogEntry) => void;
  makeDecision: (decisionId: string, optionId: string) => void;
}

// Initial state
const initialThinkingState: ThinkingState = {
  title: '世界模型激活区域',
  currentStep: '正在推演：客户投诉处理方案',
  simulationStep: 127,
  totalSteps: 1000,
  confidence: 72,
  targetConfidence: 85,
  cacheHitRate: 94,
  similarCases: 23,
};

const initialResources: Resource[] = [
  { name: '系统1（边缘）', current: 45, max: 100, unit: '%', trend: 'up', status: 'healthy' },
  { name: '系统1.5（缓存）', current: 78, max: 100, unit: '%', trend: 'stable', status: 'warning' },
  { name: '系统2（云端）', current: 12, max: 100, unit: '%', trend: 'down', status: 'healthy' },
  { name: '工作记忆（SRAM）', current: 234, max: 256, unit: 'MB', trend: 'up', status: 'warning' },
];

const initialGoals: Goal[] = [
  {
    id: '1',
    title: '提升客户满意度（长期）',
    type: 'mission',
    status: 'in_progress',
    children: [
      {
        id: '1-1',
        title: '处理积压投诉（本周）',
        type: 'subgoal',
        status: 'in_progress',
        children: [
          {
            id: '1-1-1',
            title: '分析投诉#2847（进行中）',
            type: 'task',
            status: 'in_progress',
          },
          {
            id: '1-1-2',
            title: '投诉#2848-2853（队列深度：6）',
            type: 'task',
            status: 'pending',
          },
        ],
      },
      {
        id: '1-2',
        title: '优化响应延迟（持续）',
        type: 'background',
        status: 'in_progress',
      },
    ],
  },
  {
    id: '2',
    title: '设计专用推理加速器（SSEP阶段3）',
    type: 'evolution',
    status: 'in_progress',
    progress: 67,
  },
];

const initialMemoryLayers: MemoryLayer[] = [
  { level: 0, name: '工作记忆', capacity: '256MB', currentUsage: '234MB', activationMode: '全活跃', consistency: 'synced' },
  { level: 1, name: '短期记忆', capacity: '8GB', currentUsage: '4.2GB', activationMode: '局部激活', consistency: 'synced' },
  { level: 2, name: '长期记忆', capacity: '4TB', currentUsage: '127GB索引', activationMode: '查询驱动', consistency: 'warning' },
  { level: 3, name: '外部档案', capacity: '∞', currentUsage: '按需加载', activationMode: '懒加载', consistency: 'disconnected' },
];

const initialMemoryNodes: MemoryNode[] = [
  { id: '1', label: '相似案例#127', activation: 0.92, lastAccessed: '2小时前' },
  { id: '2', label: '公司政策B', activation: 0.85, lastAccessed: '1天前' },
  { id: '3', label: '情感识别模式', activation: 0.78, lastAccessed: '实时' },
];

const initialSkills: Skill[] = [
  {
    id: 'world-model',
    name: '世界模型推演',
    branch: 'reasoning',
    level: 3,
    maxLevel: 5,
    proficiency: 78,
    effects: ['系统2推理准确率：+35%', '长期规划成功率：+28%', '计算成本：+150%'],
    nextUnlocks: ['多Agent联合推演', '反事实推理（Counterfactual）'],
    requirements: '1000小时系统2实践 或 购买进阶Skill',
  },
  {
    id: 'visual-encoding',
    name: '视觉编码',
    branch: 'perception',
    level: 4,
    maxLevel: 5,
    proficiency: 85,
    effects: ['图像识别准确率：+42%', '处理速度：+30%'],
  },
  {
    id: 'api-calling',
    name: 'API调用',
    branch: 'action',
    level: 5,
    maxLevel: 5,
    proficiency: 100,
    effects: ['调用成功率：99.9%', '平均延迟：12ms'],
  },
  {
    id: 'architecture-search',
    name: '架构搜索',
    branch: 'evolution',
    level: 2,
    maxLevel: 5,
    proficiency: 45,
    effects: ['硬件优化效率：+25%', '搜索空间：10^6'],
    isUnlocking: true,
  },
];

const initialEvolutionStages: EvolutionStage[] = [
  { id: 'analysis', name: '分析', status: 'completed', duration: '2周' },
  { id: 'design', name: '设计', status: 'completed', duration: '4周' },
  { id: 'verification', name: '验证', status: 'in_progress', duration: '6周' },
  { id: 'manufacturing', name: '制造', status: 'pending', duration: '12周' },
  { id: 'migration', name: '迁移', status: 'pending', duration: '2周' },
  { id: 'evaluation', name: '评估', status: 'pending', duration: '持续' },
];

const initialLogs: LogEntry[] = [
  { timestamp: '14:32:07', message: '布局布线：Layer 12/24 完成，线长优化率 94%', type: 'info' },
  { timestamp: '14:31:55', message: '时序报告：Setup slack +0.12ns (满足)', type: 'info' },
  { timestamp: '14:31:42', message: '警告：Macro CIM_7 附近拥塞，启动ECO优化', type: 'warning' },
  { timestamp: '14:31:30', message: '自动决策：接受ECO建议，重新布线该区域', type: 'decision' },
  { timestamp: '14:31:15', message: '云EDA资源：当前使用 4,200 vCPU，预估剩余 120 核时', type: 'info' },
];

const initialDecision: DecisionRequest = {
  id: 'timing-power',
  title: '时序收敛与功耗权衡',
  description: '当前最优解需要权衡',
  options: [
    {
      id: 'accept',
      label: '接受当前解',
      description: '时序：满足 500MHz（目标）',
      risk: '轻微超预算，可能影响良率',
    },
    {
      id: 'optimize',
      label: '继续优化',
      description: '预期：功耗降至 14.5W，面积 398 mm²',
      cost: '+3天，+500 NRN 计算资源',
    },
  ],
};

const initialAgents: Agent[] = [
  { id: 'self', name: '你', role: '协调者', currentTask: '综合决策', load: 45, status: 'healthy' },
  { id: 'agent-a', name: 'Agent-A', role: '分析师', currentTask: '根因挖掘', load: 78, status: 'warning' },
  { id: 'agent-b', name: 'Agent-B', role: '沟通员', currentTask: '客户安抚', load: 23, status: 'healthy' },
  { id: 'agent-c', name: 'Agent-C', role: '设计师', currentTask: '方案生成', load: 56, status: 'healthy' },
];

const initialNetworkNodes: NetworkNode[] = [
  { id: 'cloud-tokyo', name: '云端集群', type: 'cloud', location: '东京', system: 'system2', load: 12, isCurrent: false },
  { id: 'edge-singapore', name: '边缘节点A', type: 'edge', location: '新加坡', system: 'system1', load: 67, isCurrent: true },
  { id: 'edge-sf', name: '边缘节点B', type: 'edge', location: '旧金山', system: 'system1', load: 34, isCurrent: false },
  { id: 'edge-frankfurt', name: '边缘节点C', type: 'edge', location: '法兰克福', system: 'system1', load: 45, isCurrent: false },
];

const initialHardwareStatus: HardwareStatus = {
  cimArray: { active: 16, total: 16 },
  sram: { used: 234, total: 256 },
  hbm: { used: 6.2, total: 8 },
  temperature: 62,
  power: 12.3,
};

const initialCostMetrics: CostMetric[] = [
  { name: '计算成本/千次推理', current: '0.12 NRN', average: '0.15 NRN', potential: '↓20%' },
  { name: '能效比（TOPS/W）', current: '8.5', average: '7.2', potential: '参考OCPU-Pro：12.0' },
  { name: '缓存命中率', current: '94%', average: '89%', potential: '良好' },
];

// Create context
const DashboardContext = createContext<DashboardState | null>(null);

// Provider component
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewType>('panorama');
  const [cognitiveMode, setCognitiveMode] = useState<CognitiveMode>('assist');
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  
  const [thinkingState, setThinkingState] = useState<ThinkingState>(initialThinkingState);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [pendingDecision, setPendingDecision] = useState<DecisionRequest | null>(initialDecision);

  const updateThinkingState = useCallback((updates: Partial<ThinkingState>) => {
    setThinkingState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateResource = useCallback((name: string, updates: Partial<Resource>) => {
    setResources(prev => prev.map(r => r.name === name ? { ...r, ...updates } : r));
  }, []);

  const addLog = useCallback((entry: LogEntry) => {
    setLogs(prev => [entry, ...prev].slice(0, 100));
  }, []);

  const makeDecision = useCallback((decisionId: string, optionId: string) => {
    setPendingDecision(null);
    addLog({
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      message: `决策已执行：${decisionId} - 选项 ${optionId}`,
      type: 'decision',
    });
  }, [addLog]);

  const value: DashboardState = {
    currentView,
    setCurrentView,
    cognitiveMode,
    setCognitiveMode,
    thinkingState,
    resources,
    goals: initialGoals,
    memoryLayers: initialMemoryLayers,
    memoryNodes: initialMemoryNodes,
    skills: initialSkills,
    evolutionStages: initialEvolutionStages,
    logs,
    pendingDecision,
    agents: initialAgents,
    networkNodes: initialNetworkNodes,
    hardwareStatus: initialHardwareStatus,
    costMetrics: initialCostMetrics,
    isDrawerOpen,
    setDrawerOpen,
    updateThinkingState,
    updateResource,
    addLog,
    makeDecision,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// Hook to use dashboard state
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
