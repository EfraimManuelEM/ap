/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'auth.access_tokens.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/me',
    tokens: [{"old":"/api/v1/auth/me","type":0,"val":"api","end":""},{"old":"/api/v1/auth/me","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/me","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['auth.access_tokens.me']['types'],
  },
  'new_account.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/user',
    tokens: [{"old":"/api/v1/user","type":0,"val":"api","end":""},{"old":"/api/v1/user","type":0,"val":"v1","end":""},{"old":"/api/v1/user","type":0,"val":"user","end":""}],
    types: placeholder as Registry['new_account.index']['types'],
  },
  'new_account.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/user/:id',
    tokens: [{"old":"/api/v1/user/:id","type":0,"val":"api","end":""},{"old":"/api/v1/user/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/user/:id","type":0,"val":"user","end":""},{"old":"/api/v1/user/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['new_account.show']['types'],
  },
  'new_account.update': {
    methods: ["PUT"],
    pattern: '/api/v1/user',
    tokens: [{"old":"/api/v1/user","type":0,"val":"api","end":""},{"old":"/api/v1/user","type":0,"val":"v1","end":""},{"old":"/api/v1/user","type":0,"val":"user","end":""}],
    types: placeholder as Registry['new_account.update']['types'],
  },
  'new_account.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/user',
    tokens: [{"old":"/api/v1/user","type":0,"val":"api","end":""},{"old":"/api/v1/user","type":0,"val":"v1","end":""},{"old":"/api/v1/user","type":0,"val":"user","end":""}],
    types: placeholder as Registry['new_account.destroy']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'messages.store': {
    methods: ["POST"],
    pattern: '/api/v1/mail',
    tokens: [{"old":"/api/v1/mail","type":0,"val":"api","end":""},{"old":"/api/v1/mail","type":0,"val":"v1","end":""},{"old":"/api/v1/mail","type":0,"val":"mail","end":""}],
    types: placeholder as Registry['messages.store']['types'],
  },
  'messages.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/mail',
    tokens: [{"old":"/api/v1/mail","type":0,"val":"api","end":""},{"old":"/api/v1/mail","type":0,"val":"v1","end":""},{"old":"/api/v1/mail","type":0,"val":"mail","end":""}],
    types: placeholder as Registry['messages.index']['types'],
  },
  'messages.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/mail/:id',
    tokens: [{"old":"/api/v1/mail/:id","type":0,"val":"api","end":""},{"old":"/api/v1/mail/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/mail/:id","type":0,"val":"mail","end":""},{"old":"/api/v1/mail/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['messages.show']['types'],
  },
  'messages.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/mail/:id',
    tokens: [{"old":"/api/v1/mail/:id","type":0,"val":"api","end":""},{"old":"/api/v1/mail/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/mail/:id","type":0,"val":"mail","end":""},{"old":"/api/v1/mail/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['messages.destroy']['types'],
  },
  'messages.read': {
    methods: ["PATCH"],
    pattern: '/api/v1/mail/:id/read',
    tokens: [{"old":"/api/v1/mail/:id/read","type":0,"val":"api","end":""},{"old":"/api/v1/mail/:id/read","type":0,"val":"v1","end":""},{"old":"/api/v1/mail/:id/read","type":0,"val":"mail","end":""},{"old":"/api/v1/mail/:id/read","type":1,"val":"id","end":""},{"old":"/api/v1/mail/:id/read","type":0,"val":"read","end":""}],
    types: placeholder as Registry['messages.read']['types'],
  },
  'tecnologias.store': {
    methods: ["POST"],
    pattern: '/api/v1/tecno',
    tokens: [{"old":"/api/v1/tecno","type":0,"val":"api","end":""},{"old":"/api/v1/tecno","type":0,"val":"v1","end":""},{"old":"/api/v1/tecno","type":0,"val":"tecno","end":""}],
    types: placeholder as Registry['tecnologias.store']['types'],
  },
  'tecnologias.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/tecno',
    tokens: [{"old":"/api/v1/tecno","type":0,"val":"api","end":""},{"old":"/api/v1/tecno","type":0,"val":"v1","end":""},{"old":"/api/v1/tecno","type":0,"val":"tecno","end":""}],
    types: placeholder as Registry['tecnologias.index']['types'],
  },
  'tecnologias.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/tecno/:id',
    tokens: [{"old":"/api/v1/tecno/:id","type":0,"val":"api","end":""},{"old":"/api/v1/tecno/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/tecno/:id","type":0,"val":"tecno","end":""},{"old":"/api/v1/tecno/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tecnologias.show']['types'],
  },
  'tecnologias.update': {
    methods: ["PUT"],
    pattern: '/api/v1/tecno/:id',
    tokens: [{"old":"/api/v1/tecno/:id","type":0,"val":"api","end":""},{"old":"/api/v1/tecno/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/tecno/:id","type":0,"val":"tecno","end":""},{"old":"/api/v1/tecno/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tecnologias.update']['types'],
  },
  'tecnologias.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/tecno/:id',
    tokens: [{"old":"/api/v1/tecno/:id","type":0,"val":"api","end":""},{"old":"/api/v1/tecno/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/tecno/:id","type":0,"val":"tecno","end":""},{"old":"/api/v1/tecno/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tecnologias.destroy']['types'],
  },
  'projetos.store': {
    methods: ["POST"],
    pattern: '/api/v1/projeto',
    tokens: [{"old":"/api/v1/projeto","type":0,"val":"api","end":""},{"old":"/api/v1/projeto","type":0,"val":"v1","end":""},{"old":"/api/v1/projeto","type":0,"val":"projeto","end":""}],
    types: placeholder as Registry['projetos.store']['types'],
  },
  'projetos.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/projeto',
    tokens: [{"old":"/api/v1/projeto","type":0,"val":"api","end":""},{"old":"/api/v1/projeto","type":0,"val":"v1","end":""},{"old":"/api/v1/projeto","type":0,"val":"projeto","end":""}],
    types: placeholder as Registry['projetos.index']['types'],
  },
  'projetos.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/projeto/:id',
    tokens: [{"old":"/api/v1/projeto/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projeto/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projeto/:id","type":0,"val":"projeto","end":""},{"old":"/api/v1/projeto/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projetos.show']['types'],
  },
  'projetos.update': {
    methods: ["PUT"],
    pattern: '/api/v1/projeto/:id',
    tokens: [{"old":"/api/v1/projeto/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projeto/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projeto/:id","type":0,"val":"projeto","end":""},{"old":"/api/v1/projeto/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projetos.update']['types'],
  },
  'projetos.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/projeto/:id',
    tokens: [{"old":"/api/v1/projeto/:id","type":0,"val":"api","end":""},{"old":"/api/v1/projeto/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/projeto/:id","type":0,"val":"projeto","end":""},{"old":"/api/v1/projeto/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projetos.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
