import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 150).notNullable()

      table.string('email', 255).notNullable()

      table.string('subject', 255).notNullable()

      table.text('message').notNullable()

      table.boolean('read').notNullable().defaultTo(false)

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