import { DataTypes } from "sequelize";
import { SequelizeDb } from "./Sequelize";
import config from 'config';

const schemaDb = config.get('sequelizeDbErp.schemaErp') as string;
const collectionEmails = config.get('sequelizeDbErp.collectionEmails') as string;
const sequelizeEmails = new SequelizeDb(schemaDb);
sequelizeEmails.connect();

const EmailsErp = sequelizeEmails.clientDb.define(collectionEmails, {
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    },
    customerName: {
    type:  DataTypes.STRING,
    allowNull: false
    },
    customerEmailAddress: {
    type: DataTypes.STRING,
    allowNull: false 
    },
    phoneNum: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    subject: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    text: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    dateTime: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    status: {
    type: DataTypes.STRING,
    allowNull: false,
    }

    }
)

export default EmailsErp;