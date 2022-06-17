import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const dbConfig: TypeOrmModuleOptions = {
      synchronize: false,
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
    // {
    //   type: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    //   username: process.env.POSTGRES_USERNAME,
    //   password: process.env.POSTGRES_PASSWORD,
    //   database: process.env.POSTGRES_DATABASE,

    //   entities: [process.env.TYPEORM_ENTITIES],
    //   logging: true,
    //   synchronize: false,
    //   migrations: [process.env.TYPEORM_MIGRATIONS],
    //   cli: {
    //     migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
    //   },
    // };
  }
}
