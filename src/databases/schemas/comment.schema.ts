
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true})
export class Comment extends Document {
    @Prop({ type: Types.ObjectId,ref:'Post',required: true})
    post: Types.ObjectId;
    
    @Prop({ type: Types.ObjectId,ref:'User',required: true })
    author: Types.ObjectId;
    
    @Prop({type: String, required: true })
    content: string;
    
}
export const CommentSchema = SchemaFactory.createForClass(Comment);