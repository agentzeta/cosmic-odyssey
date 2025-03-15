
interface QuestTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignedTo?: string;
  dependencies: string[];
}

interface Quest {
  id: string;
  title: string;
  description: string;
  tasks: Map<string, QuestTask>;
  status: 'active' | 'completed' | 'archived';
}

class QuestManager {
  private quests: Map<string, Quest>;
  
  constructor() {
    this.quests = new Map();
  }
  
  createQuest(title: string, description: string = ''): Quest {
    const id = `quest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const quest: Quest = {
      id,
      title,
      description,
      tasks: new Map(),
      status: 'active'
    };
    
    this.quests.set(id, quest);
    return quest;
  }
  
  getQuest(id: string): Quest | undefined {
    return this.quests.get(id);
  }
  
  addTask(questId: string, title: string, description: string = '', dependencies: string[] = []): QuestTask | null {
    const quest = this.quests.get(questId);
    
    if (!quest) {
      console.error(`Quest with ID ${questId} not found`);
      return null;
    }
    
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const task: QuestTask = {
      id: taskId,
      title,
      description,
      status: 'pending',
      dependencies
    };
    
    quest.tasks.set(taskId, task);
    return task;
  }
  
  assignTask(questId: string, taskId: string, agentId: string): boolean {
    const quest = this.quests.get(questId);
    
    if (!quest) {
      console.error(`Quest with ID ${questId} not found`);
      return false;
    }
    
    const task = quest.tasks.get(taskId);
    
    if (!task) {
      console.error(`Task with ID ${taskId} not found in quest ${questId}`);
      return false;
    }
    
    task.assignedTo = agentId;
    task.status = 'in_progress';
    return true;
  }
  
  updateTaskStatus(questId: string, taskId: string, status: QuestTask['status']): boolean {
    const quest = this.quests.get(questId);
    
    if (!quest) {
      console.error(`Quest with ID ${questId} not found`);
      return false;
    }
    
    const task = quest.tasks.get(taskId);
    
    if (!task) {
      console.error(`Task with ID ${taskId} not found in quest ${questId}`);
      return false;
    }
    
    task.status = status;
    
    // Check if all tasks are completed to update quest status
    if (status === 'completed') {
      let allCompleted = true;
      
      quest.tasks.forEach(task => {
        if (task.status !== 'completed') {
          allCompleted = false;
        }
      });
      
      if (allCompleted && quest.tasks.size > 0) {
        quest.status = 'completed';
      }
    }
    
    return true;
  }
}

export const questManager = new QuestManager();
export type { Quest, QuestTask };
EOF