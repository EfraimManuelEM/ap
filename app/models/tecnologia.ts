import { TecnologiaSchema } from '#database/schema'

export default class Tecnologia extends TecnologiaSchema {
   get initials() {
    const [first, last] = this.nome ? this.nome.split(' ') : this.icon.split('')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
} 