// src/gemini/gemini.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('chat')
  async chat(@Body() body: { message: string }) {
    return this.geminiService.chat(body.message);
  }
}