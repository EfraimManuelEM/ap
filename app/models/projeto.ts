import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  manyToMany,
} from '@adonisjs/lucid/orm'

import type {
  ManyToMany,
} from '@adonisjs/lucid/types/relations'

import Tecnologia from '#models/tecnologia'

export default class Projeto extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titulo: string

  @column()
  declare descricao: string

  @column()
  declare iamgem: string | null

  @column()
  declare git: string | null

  @column()
  declare ar: string | null

  @column()
  declare status: string

  @manyToMany(() => Tecnologia, {
    pivotTable: 'projeto_tecnologia',
    pivotForeignKey: 'projeto_id',
    pivotRelatedForeignKey: 'tecnologia_id',
  })
  declare tecnologias: ManyToMany<typeof Tecnologia>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}