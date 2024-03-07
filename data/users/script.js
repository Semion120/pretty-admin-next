const { writeFileSync } = require('fs')
let users = [
  {
    _id: '124rfg324',
    login: 'semion',
    pass: '1234',
    role: 'owner',
    availableOptions: ['projects', 'articles', 'users'],
  },
  {
    _id: '3tfeqe23g42',
    login: 'admin1',
    pass: '1234',
    creater: 'semion',
    role: 'admin',
    availableOptions: ['projects', 'users'],
  },
  {
    _id: 'rvgre422hg3',
    login: 'admin2',
    pass: '1234',
    creater: 'semion',
    role: 'admin',
    availableOptions: ['articles', 'users'],
  },
  {
    _id: 're123gt23433',
    login: 'user1',
    pass: '1234',
    creater: 'semion',
    role: 'user',
    availableOptions: ['projects', 'articles'],
  },
  {
    _id: 're146ytg4wehg3',
    login: 'user2',
    pass: '1234',
    creater: 'admin1',
    role: 'user',
    availableOptions: ['projects', 'articles'],
  },
  {
    _id: 're144754hg3',
    login: 'user3',
    pass: '1234',
    creater: 'admin2',
    role: 'user',
    availableOptions: ['projects'],
  },
  {
    _id: 'r26bdferhg3',
    login: 'user4',
    pass: '1234',
    creater: 'admin1',
    role: 'user',
    availableOptions: ['articles'],
  },
]

const pathToFile = '/home/mrbabak/pretty-admin-next/data/users/data.txt'

writeFileSync(pathToFile, JSON.stringify(users))
