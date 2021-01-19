import { __prod__ } from './constants';
import { Post } from './entities/post';
export default {
    type: 'postgres',
    host: 'localhost',
    port: 3306,
    username: 'postgres',
    password: 'postgres',
    database: 'test',
    entities: [Post],
    synchronize: true,
    logging: __prod__,
    migrationsTableName: 'custom_migration_table',
    migrations: ['migration/*.js'],
    cli: {
        migrationsDir: 'migration'
    }
};
//# sourceMappingURL=ormconfig.js.map