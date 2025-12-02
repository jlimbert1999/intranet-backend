import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Permission, Role, User } from './entities';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';

@Module({
  controllers: [UsersController, RoleController],
  providers: [UsersService, RoleService],
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
})
export class UsersModule {}
