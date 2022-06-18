import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const dbConfig: TypeOrmModuleOptions = {
      synchronize: false,
      migrations: ['migrations/*.ts'],
      migrationsTableName: 'migrations',
    };
    switch (process.env.NODE_ENV) {
      case 'development':
        Object.assign(dbConfig, {
          type: 'sqlite',
          database: 'db.development.sqlite',
          entities: ['**/*.entity.js'],
        });
        break;
      case 'test':
        Object.assign(dbConfig, {
          type: 'sqlite',
          database: 'db.test.sqlite',
          entities: ['**/*.entity.js'],
        });
        break;
      case 'production':
        break;
      default:
        throw new Error('unknown environment');
    }
    return dbConfig;
  }
}
