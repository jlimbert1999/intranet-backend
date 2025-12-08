import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleController, UsersController } from './controllers';
import { UsersService, RoleService } from './services';
import { Permission, Role, User } from './entities';

@Module({
  controllers: [UsersController, RoleController],
  providers: [UsersService, RoleService],
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
