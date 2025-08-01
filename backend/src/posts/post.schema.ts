import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Post extends Document {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId
}

export const PostSchema = SchemaFactory.createForClass(Post) 