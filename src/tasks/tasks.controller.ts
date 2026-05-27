import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { Task } from './tasks.data';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
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

    return this.tasksService.findAll({ completed: completedBool, title });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createTask(@Body() body: { title: string; priority: 0 | 1 | 2 }): Task {
    return this.tasksService.create(body.title, body.priority);
  }

  @Patch(':id/completed')
  @UseGuards(JwtAuthGuard, AdminGuard)
  markCompleted(@Param('id') id: string): Task {
    return this.tasksService.markCompleted(Number(id));
  }
}
