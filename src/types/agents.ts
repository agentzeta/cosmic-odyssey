export type AgentType = 
  | 'projectManager'
  | 'gameDesigner'
  | 'visualArtist'
  | 'narrativeDesigner'
  | 'soundDesigner'
  | 'codeGenerator'
  | 'qaTester';

export type AgentStatus = 'idle' | 'working' | 'completed' | 'error';

export interface AgentTask {
  taskId: string;
  type: string;
  status: AgentStatus;
  progress: number;
  assignedTo: AgentType;
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[];
  artifacts?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AgentState {
  agents: Record<AgentType, {
    status: AgentStatus;
    tasks: AgentTask[];
  }>;
  taskQueue: AgentTask[];
  loading: boolean;
  error: string | null;
} 