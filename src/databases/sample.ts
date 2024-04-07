export const ADMIN_ROLE = 'SUPPER ADMIN';
export const USER_ROLE = 'NORMAL ROLE';
export const INIT_PERMISSIONS = [
  {
    name: 'getCompany with paginate',
    apiPath: ['api/companies'],
    method: 'GET',
    module: 'Company',
    isDeleted: false,
    deletedAt: null,
    createdAt: '2024-03-31T15:08:27.302Z',
    updatedAt: '2024-03-31T15:08:27.302Z',
    __v: 0,
  },
  {
    name: 'Create company',
    apiPath: ['api/companies'],
    method: 'POST',
    module: 'Company',

    isDeleted: false,
    deletedAt: null,
    createdAt: '2024-03-31T15:08:27.302Z',
    updatedAt: '2024-03-31T15:08:27.302Z',
    __v: 0,
  },
  {
    name: 'view 1 company',
    apiPath: ['api/companies:id'],
    method: 'Get',
    module: 'Company',

    isDeleted: false,
    deletedAt: null,
    createdAt: '2024-03-31T15:08:27.302Z',
    updatedAt: '2024-03-31T15:08:27.302Z',
    __v: 0,
  },
  {
    name: 'delete company',
    apiPath: ['api/companies/:id'],
    method: 'DELETE',
    module: 'Company',

    isDeleted: false,
    deletedAt: null,
    createdAt: '2024-03-31T15:08:27.302Z',
    updatedAt: '2024-03-31T15:08:27.302Z',
    __v: 0,
  },
];
