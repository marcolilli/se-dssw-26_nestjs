import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StatsModule } from './stats/stats.module';
import { ArticlesModule } from './articles/articles.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [UsersModule, StatsModule, ArticlesModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
