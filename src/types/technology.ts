export interface TechnologyStatus {
  status: 'initializing' | 'connected' | 'error' | 'disconnected';
  progress: number;
  error?: string;
}

export interface TechnologyState {
  status: Record<string, TechnologyStatus>;
  initialized: boolean;
  error: string | null;
} 