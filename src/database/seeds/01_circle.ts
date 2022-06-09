import { Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('circle').del()

  // Inserts seed entries
  await knex('circle').insert([
    { public_address: '0xdF0622888C9386B1DacdFf82FC5873303C091CEA' }
  ])
};
