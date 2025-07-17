import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Post } from './post.schema'
import { User } from '../users/user.schema'

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createPost(title: string, description: string, authorId: string) {
    const author = await this.userModel.findById(authorId)
    if (!author) throw new NotFoundException('User not found')
    const post = new this.postModel({ title, description, author: author._id })
    await post.save()
    return post
  }

  async getTimeline(userId: string) {
    const user = await this.userModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')
    const userIdObj = new Types.ObjectId((user._id as Types.ObjectId | string).toString())
    const followingIds = (user.following as Types.ObjectId[]).map(id => new Types.ObjectId(id.toString())).concat([userIdObj])
    return this.postModel.find({ author: { $in: followingIds } }).sort({ createdAt: -1 })
  }
}
