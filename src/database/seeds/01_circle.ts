import { Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('circle').del()

  // Inserts seed entries
  await knex('circle').insert([
    { public_address: '0x1d4FcC2055509715596ac7E9339D7449743DA5B1' }
  ])
};
