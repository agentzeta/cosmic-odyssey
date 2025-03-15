import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { AgentTask } from '../../types/agents';

interface TaskQueueProps {
  tasks: AgentTask[];
}

const TaskQueue: React.FC<TaskQueueProps> = ({ tasks }) => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Task Queue ({tasks.length})
      </Typography>
      
      <List dense>
        {tasks.map((task, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={task.type}
              secondary={`Assigned to: ${task.assignedTo}`}
            />
            <Chip
              label={task.priority}
              size="small"
              color={task.priority === 'high' ? 'error' : 'default'}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskQueue; 