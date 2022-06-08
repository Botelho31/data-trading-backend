import * as path from 'path'

// Script to remake database
// npx knex migrate:rollback;
// npx knex migrate:latest;
// npx knex seed:run;

// Use to drop all tables - npx knex migrate:rollback
// Use to make new migrations - npx knex migrate:make MIGRATION-NAME
// Use to run new migrations - npx knex migrate:latest

// Use to make new seeds - npx knex seed:make MIGRATION-NAME
// Use to run new seeds - npx knex seed:run

export default {

  development: {
    client: 'pg',
    connection: {
      host: 'data-trading.cqe7bcs6s0pa.us-east-1.rds.amazonaws.com',
      port: '5432',
      database: 'homolog',
      user: 'postgres',
      password: 'L9xnZi#5prF9WR7z'
    },
    migrations: {
      directory: path.join(__dirname, '/src/database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/src/database/seeds')
    }
  }
}
