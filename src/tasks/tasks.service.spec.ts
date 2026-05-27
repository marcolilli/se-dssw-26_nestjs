const mockTasks: any[] = [];

jest.mock('./tasks.data', () => ({
  tasks: mockTasks,
}));

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    mockTasks.length = 0;
    mockTasks.push(
      { id: 1, title: 'Task 1', priority: 0, completed: false },
      { id: 2, title: 'Task 2', priority: 1, completed: true },
      { id: 3, title: 'Task 3', priority: 2, completed: false },
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks', () => {
      expect(service.findAll()).toEqual(mockTasks);
    });

    it('should return only completed tasks', () => {
      expect(service.findAll({ completed: true })).toEqual([
        { id: 2, title: 'Task 2', priority: 1, completed: true },
      ]);
    });

    it('should return only incomplete tasks', () => {
      expect(service.findAll({ completed: false })).toEqual([
        { id: 1, title: 'Task 1', priority: 0, completed: false },
        { id: 3, title: 'Task 3', priority: 2, completed: false },
      ]);
    });

    it('should filter tasks by title (case-insensitive)', () => {
      expect(service.findAll({ title: 'task 1' })).toEqual([
        { id: 1, title: 'Task 1', priority: 0, completed: false },
      ]);
    });

    it('should return empty array when title matches nothing', () => {
      expect(service.findAll({ title: 'nonexistent' })).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a task and mark it as not completed', () => {
      const task = service.create('Buy groceries', 2);

      expect(task).toEqual({
        id: 4,
        title: 'Buy groceries',
        priority: 2,
        completed: false,
      });
    });

    it('should add the new task to the list', () => {
      service.create('Buy groceries', 2);

      expect(service.findAll()).toHaveLength(4);
    });

    it('should throw BadRequestException when title is empty', () => {
      expect(() => service.create('', 1)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for an invalid priority', () => {
      expect(() => service.create('Buy groceries', 3 as any)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('markCompleted', () => {
    it('should mark the task as completed', () => {
      const task = service.markCompleted(1);

      expect(task.completed).toBe(true);
    });

    it('should throw NotFoundException for an unknown id', () => {
      expect(() => service.markCompleted(999)).toThrow(NotFoundException);
    });
  });
});
