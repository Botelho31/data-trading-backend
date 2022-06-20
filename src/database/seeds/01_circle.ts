import { Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('circle').del()

  // Inserts seed entries
  await knex('circle').insert([
    { public_address: '0xF00F23bc3d5e534623B8Ca2eE9E3E3b8f8e0C707' }
  ])
};
