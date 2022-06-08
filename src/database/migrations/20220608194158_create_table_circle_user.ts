import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('circle_user', function (table) {
    table.string('circle_address').references('public_address').inTable('circle').notNullable().onDelete('CASCADE')
    table.string('public_address').references('public_address').inTable('user').notNullable().onDelete('CASCADE')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('circle_user')
}
