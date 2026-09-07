import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projetos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('titulo', 150).notNullable()

      table.text('descricao').notNullable()

      // Imagem do projeto
      table.string('iamgem', 500).nullable()

      // Link GitHub
      table.string('git', 500).nullable()

      // Link do projeto
      table.string('ar', 500).nullable()

      // status
      table.string('status', 50).notNullable().defaultTo('inativo')

      // Relação com tecnologia
      table
        .integer('tecnologia_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('tecnologias')
        .onDelete('SET NULL')

      // Datas
      table.timestamp('created_at').notNullable()
      table
        .timestamp('updated_at')
        .notNullable()
        .defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}