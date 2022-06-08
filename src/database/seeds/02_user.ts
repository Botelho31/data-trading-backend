import { Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user').del()

  // Inserts seed entries
  await knex('user').insert([
    {
      public_address: '0x989638f0D879Be8b132Cde8E2058F11187Bcd7De',
      email: 'lucas.vbotelho83@gmail.com',
      name: 'Lucas'
    }
  ])
};
