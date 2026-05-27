export interface Task {
  id: number;
  title: string;
  priority: 0 | 1 | 2;
  completed: boolean;
}

export const tasks: Task[] = [];
