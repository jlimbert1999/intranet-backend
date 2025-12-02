import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from './entities';
import { PERMISSIONS_SEED } from './constants';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async executePermissionsSeed() {
    const permissions = PERMISSIONS_SEED.map(({ resource, actions }) =>
      actions.map((action) => ({ resource, action })),
    ).flat();
    await this.permissionRepository.save(permissions);
    return { ok: true, message: 'Permissions seeded successfully' };
  }
}
