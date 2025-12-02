import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from '../services';
import { CreateRoleDto } from '../dtos';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Get('permissions')
  getPermissions() {
    return this.roleService.getGroupedPermissions();
  }

  @Post()
  create(@Body() body: CreateRoleDto) {
    return this.roleService.create(body);
  }
}
