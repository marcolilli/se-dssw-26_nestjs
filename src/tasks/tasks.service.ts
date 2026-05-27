import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, tasks } from './tasks.data';

@Injectable()
export class TasksService {
  findAll({
    completed,
    title,
  }: { completed?: boolean; title?: string } = {}): Task[] {
    let result = tasks;

    if (completed !== undefined) {
      result = result.filter((task) => task.completed === completed);
    }

    if (title !== undefined) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(title.toLowerCase()),
      );
    }

    return result;
  }

  create(title: string, priority: 0 | 1 | 2): Task {
    if (!title) {
      throw new BadRequestException('Title is required');
    }

    if (![0, 1, 2].includes(priority)) {
      throw new BadRequestException('Priority must be 0, 1, or 2');
    }

    const task: Task = {
      id: tasks.length + 1,
      title,
      priority,
      completed: false,
    };

    tasks.push(task);

    return task;
  }

  markCompleted(id: number): Task {
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    task.completed = true;

    return task;
  }
}
