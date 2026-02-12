// View types
export type ViewType = 'panorama' | 'topology' | 'memory' | 'skills' | 'evolution';

// Cognitive mode types
export type CognitiveMode = 'auto' | 'assist' | 'manual' | 'evolution';

// Status types
export type StatusType = 'healthy' | 'warning' | 'danger' | 'processing';

// Resource types
export interface Resource {
  name: string;
  current: number;
  max: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: StatusType;
}

// Goal hierarchy types
export interface Goal {
  id: string;
  title: string;
  type: 'mission' | 'subgoal' | 'task' | 'background' | 'evolution';
  status: 'pending' | 'in_progress' | 'completed';
  children?: Goal[];
  progress?: number;
}

// Thinking state types
export interface ThinkingState {
  title: string;
  currentStep: string;
  simulationStep: number;
  totalSteps: number;
  confidence: number;
  targetConfidence: number;
  cacheHitRate: number;
  similarCases: number;
}

// Memory types
export interface MemoryLayer {
  level: number;
  name: string;
  capacity: string;
  currentUsage: string;
  activationMode: string;
  consistency: 'synced' | 'warning' | 'disconnected';
}

export interface MemoryNode {
  id: string;
  label: string;
  activation: number;
  lastAccessed: string;
  relatedNodes?: string[];
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  branch: 'perception' | 'reasoning' | 'action' | 'evolution';
  level: number;
  maxLevel: number;
  proficiency: number;
  effects: string[];
  nextUnlocks?: string[];
  requirements?: string;
  isUnlocking?: boolean;
}

// Evolution types
export interface EvolutionStage {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  duration: string;
  tasks?: EvolutionTask[];
}

export interface EvolutionTask {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  progress: number;
  estimatedCompletion?: string;
  cost?: string;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'decision';
}

export interface DecisionRequest {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  risk?: string;
  cost?: string;
  expected?: string;
}

// Agent collaboration types
export interface Agent {
  id: string;
  name: string;
  role: string;
  currentTask: string;
  load: number;
  status: StatusType;
}

export interface CollaborationProposal {
  id: string;
  question: string;
  proposals: AgentProposal[];
  consensus?: string;
}

export interface AgentProposal {
  agentId: string;
  agentName: string;
  proposal: string;
}

// Network topology types
export interface NetworkNode {
  id: string;
  name: string;
  type: 'cloud' | 'edge';
  location: string;
  system: 'system1' | 'system2';
  load: number;
  isCurrent: boolean;
}

export interface NetworkConnection {
  from: string;
  to: string;
  active: boolean;
}

// Hardware status
export interface HardwareStatus {
  cimArray: { active: number; total: number };
  sram: { used: number; total: number };
  hbm: { used: number; total: number };
  temperature: number;
  power: number;
}

// Cost metrics
export interface CostMetric {
  name: string;
  current: string;
  average: string;
  potential?: string;
}
