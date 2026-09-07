/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
      me: typeof routes['auth.access_tokens.me']
    }
  }
  newAccount: {
    index: typeof routes['new_account.index']
    show: typeof routes['new_account.show']
    update: typeof routes['new_account.update']
    destroy: typeof routes['new_account.destroy']
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  messages: {
    store: typeof routes['messages.store']
    index: typeof routes['messages.index']
    show: typeof routes['messages.show']
    destroy: typeof routes['messages.destroy']
    read: typeof routes['messages.read']
  }
  tecnologias: {
    store: typeof routes['tecnologias.store']
    index: typeof routes['tecnologias.index']
    show: typeof routes['tecnologias.show']
    update: typeof routes['tecnologias.update']
    destroy: typeof routes['tecnologias.destroy']
  }
  projetos: {
    store: typeof routes['projetos.store']
    index: typeof routes['projetos.index']
    show: typeof routes['projetos.show']
    update: typeof routes['projetos.update']
    destroy: typeof routes['projetos.destroy']
  }
}
