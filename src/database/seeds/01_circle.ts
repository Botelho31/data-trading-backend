import { Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('circle').del()

  // Inserts seed entries
  await knex('circle').insert([
    { public_address: '0xb7E44C55745dCB2eac2A046355552776575354BD' }
  ])
};
