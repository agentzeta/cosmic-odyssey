import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { assignTask, updateAgentStatus } from '../store/slices/agentSlice';
import { AgentTask, AgentType } from '../types/agents';
import { nearAI } from '../integrations/nearAI';

export const useAgentCoordination = () => {
  const dispatch = useDispatch<AppDispatch>();
  const agents = useSelector((state: RootState) => state.agents.agents);
  const taskQueue = useSelector((state: RootState) => state.agents.taskQueue);
  const currentProject = useSelector((state: RootState) => state.project.currentProject);

  useEffect(() => {
    const coordinateAgents = async () => {
      // Check for available agents and pending tasks
      for (const task of taskQueue) {
        const targetAgent = agents[task.assignedTo];
        
        if (targetAgent.status === 'idle') {
          try {
            // Use NEAR AI to enhance decision making for task assignment
            const enhancedTask = await nearAI.enhanceAgentDecision(
              task.assignedTo,
              { 
                projectContext: currentProject,
                agentStatus: agents,
                task
              },
              [task]
            );
            
            // Assign enhanced task to available agent
            await dispatch(assignTask(enhancedTask));
          } catch (error) {
            console.error('Failed to enhance task with NEAR AI:', error);
            // Fallback to regular task assignment
            await dispatch(assignTask(task));
          }
        }
      }
    };

    const interval = setInterval(coordinateAgents, 5000);
    return () => clearInterval(interval);
  }, [dispatch, agents, taskQueue, currentProject]);

  const assignTaskToAgent = async (task: AgentTask, agentType: AgentType) => {
    try {
      // Use NEAR AI to enhance task before assignment
      const enhancedTask = await nearAI.enhanceAgentDecision(
        agentType,
        { projectContext: currentProject, task },
        [{ ...task, assignedTo: agentType }]
      );
      
      await dispatch(assignTask(enhancedTask));
      return true;
    } catch (error) {
      console.error('Failed to assign task:', error);
      // Fallback to regular task assignment
      await dispatch(assignTask({ ...task, assignedTo: agentType }));
      return true;
    }
  };

  return { assignTaskToAgent };
}; 