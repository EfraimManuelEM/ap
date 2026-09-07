import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.me': { paramsTuple?: []; params?: {} }
    'new_account.index': { paramsTuple?: []; params?: {} }
    'new_account.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.update': { paramsTuple?: []; params?: {} }
    'new_account.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'messages.store': { paramsTuple?: []; params?: {} }
    'messages.index': { paramsTuple?: []; params?: {} }
    'messages.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tecnologias.store': { paramsTuple?: []; params?: {} }
    'tecnologias.index': { paramsTuple?: []; params?: {} }
    'tecnologias.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tecnologias.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tecnologias.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projetos.store': { paramsTuple?: []; params?: {} }
    'projetos.index': { paramsTuple?: []; params?: {} }
    'projetos.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projetos.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projetos.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'auth.access_tokens.me': { paramsTuple?: []; params?: {} }
    'new_account.index': { paramsTuple?: []; params?: {} }
    'new_account.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'messages.index': { paramsTuple?: []; params?: {} }
    'messages.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tecnologias.index': { paramsTuple?: []; params?: {} }
    'tecnologias.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projetos.index': { paramsTuple?: []; params?: {} }
    'projetos.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'auth.access_tokens.me': { paramsTuple?: []; params?: {} }
    'new_account.index': { paramsTuple?: []; params?: {} }
    'new_account.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'messages.index': { paramsTuple?: []; params?: {} }
    'messages.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tecnologias.index': { paramsTuple?: []; params?: {} }
    'tecnologias.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projetos.index': { paramsTuple?: []; params?: {} }
    'projetos.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'messages.store': { paramsTuple?: []; params?: {} }
    'tecnologias.store': { paramsTuple?: []; params?: {} }
    'projetos.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'new_account.update': { paramsTuple?: []; params?: {} }
    'tecnologias.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projetos.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'new_account.destroy': { paramsTuple?: []; params?: {} }
    'messages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tecnologias.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projetos.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'messages.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}