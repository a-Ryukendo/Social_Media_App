import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User } from './user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return this.userModel.find({}, { password: 0 })
  }

  async findByIdWithRelations(id: string) {
    return this.userModel
      .findById(id, { password: 0 })
      .populate('following', 'username _id')
      .populate('followers', 'username _id')
  }

  async findById(id: string) {
    return this.userModel.findById(id)
  }

  async follow(userId: string, targetId: string) {
    if (userId === targetId) throw new NotFoundException('Cannot follow yourself')
    const user = await this.userModel.findById(userId)
    const target = await this.userModel.findById(targetId)
    if (!user || !target) throw new NotFoundException('User not found')
    const targetIdStr = (target._id as Types.ObjectId | string).toString()
    const userIdStr = (user._id as Types.ObjectId | string).toString()
    if (!user.following.map(id => id.toString()).includes(targetIdStr)) {
      user.following.push(target._id as Types.ObjectId)
      await user.save()
    }
    if (!target.followers.map(id => id.toString()).includes(userIdStr)) {
      target.followers.push(user._id as Types.ObjectId)
      await target.save()
    }
    return { message: 'Followed successfully' }
  }

  async unfollow(userId: string, targetId: string) {
    if (userId === targetId) throw new NotFoundException('Cannot unfollow yourself')
    const user = await this.userModel.findById(userId)
    const target = await this.userModel.findById(targetId)
    if (!user || !target) throw new NotFoundException('User not found')
    const targetIdStr = (target._id as Types.ObjectId | string).toString()
    const userIdStr = (user._id as Types.ObjectId | string).toString()
    user.following = user.following.filter((id: Types.ObjectId) => id.toString() !== targetIdStr)
    target.followers = target.followers.filter((id: Types.ObjectId) => id.toString() !== userIdStr)
    await user.save()
    await target.save()
    return { message: 'Unfollowed successfully' }
  }
}
