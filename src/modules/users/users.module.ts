import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BlogModule } from '../../databases/blog_module.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    BlogModule, PassportModule.register({ defaultStrategy: 'jwt' }), // QUAN TRỌNG
    JwtModule.register({
      secret: '6747c16d-1f9c-4a32-b3e8-91fb1e641aaa',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
