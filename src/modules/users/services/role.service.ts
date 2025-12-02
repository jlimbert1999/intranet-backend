import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Permission, Role } from '../entities';
import { CreateRoleDto } from '../dtos';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(roleDto: CreateRoleDto) {
    const { name, permissionIds } = roleDto;

    const permissions = await this.permissionRepository.find({ where: { id: In(permissionIds) } });

    if (permissions.length !== permissionIds.length) {
      const invalid = permissionIds.filter((id) => !permissions.some((perm) => perm.id === id));
      throw new BadRequestException(`Invalid permission: ${invalid.join(', ')}`);
    }

    const role = this.roleRepository.create({
      name,
      permissions,
    });

    return await this.roleRepository.save(role);
  }

  async getGroupedPermissions() {
    const permissions = await this.permissionRepository.find();
    const grouped = permissions.reduce(
      (acc, perm) => {
        if (!acc[perm.resource]) {
          acc[perm.resource] = [];
        }
        acc[perm.resource].push({
          id: perm.id,
          action: perm.action,
        });
        return acc;
      },
      {} as Record<string, { id: string; action: string }[]>,
    );

    return Object.entries(grouped).map(([resource, actions]) => ({
      resource,
      actions,
    }));
  }
}
