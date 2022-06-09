import { Knex } from 'knex'

// circleId: Joi.string().required(),
// saleFrom: Joi.string().required(),
// saleTo: Joi.string().required(),
// description: Joi.string().required(),
// name: Joi.string().required(),
// price: Joi.string().required(),
// id: Joi.string()

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('trade', function (table) {
    table.increments('id_trade').unsigned().primary()
    table.string('circle_address').references('public_address').inTable('circle').notNullable().onDelete('CASCADE')
    table.string('sale_from').references('public_address').inTable('user').onDelete('CASCADE')
    table.string('sale_to').references('public_address').inTable('user').onDelete('CASCADE')
    table.string('description').notNullable()
    table.string('name').notNullable()
    table.float('price').notNullable()
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('trade')
}
