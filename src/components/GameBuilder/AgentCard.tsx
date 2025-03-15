import React from 'react';
import {
  Box,
  ListItem,
  ListItemText,
  Chip,
  Collapse,
  List,
  IconButton,
  Typography,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { AgentStatus, AgentTask } from '../../types/agents';

interface AgentCardProps {
  agentId: string;
  status: AgentStatus;
  tasks: AgentTask[];
}

const AgentCard: React.FC<AgentCardProps> = ({ agentId, status, tasks }) => {
  const [expanded, setExpanded] = React.useState(false);

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'working': return 'warning';
      case 'completed': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const formatAgentName = (id: string) => {
    return id
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/^\w/, c => c.toUpperCase());
  };

  return (
    <Box>
      <ListItem
        secondaryAction={
          tasks.length > 0 && (
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )
        }
      >
        <ListItemText
          primary={formatAgentName(agentId)}
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={status}
                size="small"
                color={getStatusColor(status)}
              />
              {tasks.length > 0 && (
                <Typography variant="caption">
                  {tasks.length} active task{tasks.length !== 1 ? 's' : ''}
                </Typography>
              )}
            </Box>
          }
        />
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List dense sx={{ pl: 4 }}>
          {tasks.map((task, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={task.type}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption">
                      Progress: {task.progress}%
                    </Typography>
                    <Chip
                      label={task.status}
                      size="small"
                      color={getStatusColor(task.status)}
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default AgentCard; 