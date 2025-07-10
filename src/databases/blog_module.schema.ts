import { Module } from "@nestjs/common";      
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./schemas/post.schema";
import { User, UserSchema } from "./schemas/user.schema";
import { Comment, CommentSchema } from "./schemas/comment.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: User.name, schema: UserSchema },
            { name: Comment.name, schema: CommentSchema }
        ])
    ],
    exports: [
        MongooseModule
    ]
})
export class BlogModule {}
