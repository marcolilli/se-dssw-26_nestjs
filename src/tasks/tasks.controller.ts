import { Controller, Get, Query } from '@nestjs/common';
import { Task } from './tasks.data';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { Task } from './tasks.data';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query('completed') completed: string): Task[] {
  getTasks(
    @Query('completed') completed?: string,
    @Query('title') title?: string,
  ): Task[] {
    let completedBool: boolean | undefined;
    if (completed === 'true') {
      completedBool = true;
    } else if (completed === 'false') {
      completedBool = false;
    }

    return this.tasksService.findAll({ completed: completedBool });
    return this.tasksService.findAll({ completed: completedBool, title });
  }

  @Post()
  createTask(@Body() body: { title: string; priority: 0 | 1 | 2 }): Task {
    return this.tasksService.create(body.title, body.priority);
  }

  @Patch(':id/completed')
  markCompleted(@Param('id') id: string): Task {
    return this.tasksService.markCompleted(Number(id));
  }
}
