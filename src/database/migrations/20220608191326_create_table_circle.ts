import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('circle', function (table) {
    table.string('public_address').unique().notNullable()
    table.timestamp('creation_date').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('circle')
}
