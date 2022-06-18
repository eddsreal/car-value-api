import { DataSource, DataSourceOptions } from 'typeorm';

const dbConfig = {
  development: {
    type: 'sqlite',
    database: 'db.development.sqlite',
    entities: ['**/*.entity.js'],
    synchronize: false,
    migrations: [__dirname + '/migrations/*.ts'],
    migrationsTableName: 'migrations',
  },
  test: {
    type: 'sqlite',
    database: 'db.development.sqlite',
    entities: ['**/*.entity.js'],
    synchronize: false,
    migrations: [__dirname + '/migrations/*.ts'],
    migrationsTableName: 'migrations',
  },
  production: {
    synchronize: false,
    migrations: [__dirname + '/migrations/*.ts'],
    migrationsTableName: 'migrations',
  },
};

console.log(dbConfig[process.env.NODE_ENV]);
export const appDataSource = new DataSource(
  dbConfig[process.env.NODE_ENV] as DataSourceOptions,
);
