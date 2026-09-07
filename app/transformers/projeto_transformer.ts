import { BaseTransformer } from '@adonisjs/core/transformers'
import Projeto from '#models/projeto'

export default class ProjetoTransformer extends BaseTransformer<Projeto> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'titulo',
      'descricao',
      'iamgem',
      'status',
      'git',
      'ar'
    ])
  }
}