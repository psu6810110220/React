import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // จุดรับคำสั่ง Chat
  @Post('gemini-chat')
  async chatWithGemini(@Body('prompt') prompt: string) {
    return this.appService.getGeminiSummary(prompt);
  }
}