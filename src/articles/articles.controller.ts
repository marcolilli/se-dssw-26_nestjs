import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

interface Article {
  id: number;
  title: string;
  content: string;
  date: Date;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'First Article',
    content: 'This is the content of the first article.',
    date: new Date('2024-01-01'),
  },
  {
    id: 2,
    title: 'Second Article',
    content: 'This is the content of the second article.',
    date: new Date('2024-02-01'),
  },
];

@Controller('articles')
export class ArticlesController {
  constructor() {}

  // GET /articles
  @Get()
  getAllArticles(): Article[] {
    return articles;
  }

  // GET /articles/:id -> e.g, /articles/1
  @Get(':id')
  getArticleById(@Param('id') id: string): Article | undefined {
    return articles.find((article) => article.id === Number(id));
  }

  // POST /articles
  @Post()
  createArticle(
    @Body() articleData: { title: string; content: string },
  ): Article {
    const newArticle: Article = {
      id: articles.length + 1,
      title: articleData.title,
      content: articleData.content,
      date: new Date(),
    };
    articles.push(newArticle);

    return newArticle;
  }

  // PUT /articles/:id -> e.g, /articles/1
  @Put(':id')
  updateArticle(
    @Param('id') id: string,
    @Body() articleData: { title?: string; content?: string },
  ): Article | undefined {
    const article = articles.find((article) => article.id === Number(id));

    if (article) {
      article.title = articleData.title || '';
      article.content = articleData.content || '';
    }

    return article;
  }
}
