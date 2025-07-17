import { Controller, Param, Post, Req, UseGuards, Get } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findByIdWithRelations(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(@Param('id') id: string, @Req() req: any) {
    return this.usersService.follow(req.user.userId, id)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unfollow')
  async unfollow(@Param('id') id: string, @Req() req: any) {
    return this.usersService.unfollow(req.user.userId, id)
  }
}
