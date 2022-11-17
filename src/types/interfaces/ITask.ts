export interface TaskInput {
  tasks: ITask[];
  owner?: string;
}

export interface ITask {
  id: string;
  taskTitle: string;
  taskDescription: string;
  isCompleted: boolean;
}
