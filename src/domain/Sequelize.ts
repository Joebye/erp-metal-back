import { Sequelize } from 'sequelize';
import config from 'config';

const userName = config.get('seqDbConfig.username') as string;
const password = config.get('seqDbConfig.password') as string;
const host = config.get('seqDbConfig.host') as string;
const port = config.get('seqDbConfig.port') as number;
const dialect = config.get('seqDbConfig.dialect') as any;

export class SequelizeDb {
    clientDb;
    constructor(collectionString: string) {
        this.clientDb = new Sequelize(collectionString, userName, password, {
            host: host,
            port: port,
            dialect: dialect,
    })
 }
    async connect() {
        try {
                await this.clientDb.authenticate();
                console.log(`Connection has been established successfully`);
               } catch (error) {
                 console.error('Unable to connect to the database:', error);
               }
               try {
                await this.clientDb.sync();
                console.log('The table was synchronized');
            } catch (error) {
                console.error('Unable to synchronize the table:', error);
            }
        
    }
}
