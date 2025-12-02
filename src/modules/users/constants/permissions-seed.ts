export enum SystemResource {
  COMMUNICATIONS = 'communications',
  USERS = 'users',
  DOCUMENTS = 'documents',
}

export const PERMISSIONS_SEED = [
  {
    resource: SystemResource.COMMUNICATIONS,
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: SystemResource.USERS,
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: SystemResource.DOCUMENTS,
    actions: ['create', 'read', 'update', 'delete'],
  },
];
