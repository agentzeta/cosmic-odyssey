import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
} from '@mui/material';
import { Visibility, Download } from '@mui/icons-material';
import { useArtifact } from '../../hooks/useArtifact';

interface ArtifactPreviewProps {
  projectId: string;
  artifactType: string;
}

const ArtifactPreview: React.FC<ArtifactPreviewProps> = ({
  projectId,
  artifactType,
}) => {
  const { artifact, loading, error } = useArtifact(projectId, artifactType);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="caption">
        Failed to load artifact
      </Typography>
    );
  }

  if (!artifact) {
    return (
      <Typography variant="caption" color="text.secondary">
        Not yet generated
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date(artifact.updatedAt).toLocaleDateString()}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => window.open(artifact.previewUrl)}
        >
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => window.open(artifact.downloadUrl)}
        >
          <Download fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ArtifactPreview; 