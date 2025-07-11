import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BlogModule } from '../../databases/blog_module.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BlogModule, 
    PassportModule,
    JwtModule.registerAsync({  
      useFactory: async (configService: ConfigService) => ({
         global: true,
         secret: configService.get<string>('JWT_SECRET'),
         signOptions: {
         expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
         },
     }), 
       inject: [ConfigService],  
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService,JwtStrategy],
  exports: [ PassportModule, JwtModule],
})
export class UsersModule {}
