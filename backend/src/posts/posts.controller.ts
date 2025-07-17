import { Body, Controller, Get, Post as HttpPost, Req, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async create(@Body() body: { title: string; description: string }, @Req() req: any) {
    return this.postsService.createPost(body.title, body.description, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('timeline')
  async timeline(@Req() req: any) {
    return this.postsService.getTimeline(req.user.userId)
  }
}
