import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projeto_tecnologia'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('projeto_id')
        .unsigned()
        .references('id')
        .inTable('projetos')
        .onDelete('CASCADE')

      table
        .integer('tecnologia_id')
        .unsigned()
        .references('id')
        .inTable('tecnologias')
        .onDelete('CASCADE')

      table.unique(['projeto_id', 'tecnologia_id'])

      // Timestamps
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(this.now())

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