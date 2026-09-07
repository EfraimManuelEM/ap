import { BaseTransformer } from '@adonisjs/core/transformers'
import Tecnologia from '#models/tecnologia'

export default class TecnologiaTransformer extends BaseTransformer<Tecnologia> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'nome',
      'icon',
      'createdAt'
    ])
  }
}