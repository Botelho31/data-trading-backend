import { Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('circle').del()

  // Inserts seed entries
  await knex('circle').insert([
    { public_address: '0x949e32bF20Ce73b03D0Fe1ECA591386bb00723ff' }
  ])
};
