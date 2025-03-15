export interface Artifact {
  id: string;
  type: string;
  projectId: string;
  status: 'pending' | 'generated' | 'error';
  content: any;
  previewUrl?: string;
  downloadUrl?: string;
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

export interface ArtifactState {
  artifacts: Record<string, Artifact>;
  loading: boolean;
  error: string | null;
} 