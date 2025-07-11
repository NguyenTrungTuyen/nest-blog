
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true})
export class Post extends Document {
    @Prop({type: Types.ObjectId,ref:'User',required: true})
    author: string;
    
    @Prop({ required: true, unique: true })
    title: string;
    
    @Prop({ required: true })
    content: string;

    @Prop({type:[String], default: [] })// mảng tags
    tags: string[];

    @Prop({ default: null })
    image?: string; 

    @Prop({ default: 0 })
    views: number;
    
}
export const PostSchema = SchemaFactory.createForClass(Post);