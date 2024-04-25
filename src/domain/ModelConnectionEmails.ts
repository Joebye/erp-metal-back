import { DataTypes } from "sequelize";
import { SequelizeDb } from "./Sequelize";
import config from 'config';
import prodConfig from '../config-common/product-config.json'; 
import {faker} from '@faker-js/faker';
import {ProductsShippingMap} from '../types/types';
import productsShippingMapData from '../config-common/product-config.json'; 
import moment from "moment";

const schemaDb = config.get('sequelizeDbErp.schemaErp') as string;
const collectionEmails = config.get('sequelizeDbErp.collectionEmails') as string;
const collectionProducts = config.get('sequelizeDbErp.collectionProducts') as string;
const sequelize = new SequelizeDb(schemaDb);


export const EmailsErp = sequelize.clientDb.define(collectionEmails, {
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
    },
    curUserEmail: {
    type: DataTypes.STRING,
    allowNull: false 
    }
});


export const ProductsErp = sequelize.clientDb.define(collectionProducts, {
    nameProduct: {
    type: DataTypes.STRING,
    allowNull: false
    },
    cost: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    shippingRestrictions: {
    type: DataTypes.STRING,
    allowNull: false 
    },
    quantityStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    dueDate: {
    type: DataTypes.STRING,
    allowNull: false 
    },
    inventoryCost: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
});

connection();

async function connection () {
await sequelize.connect();
const products = await ProductsErp.findAll();
if (products.length == 0) {
    fillProductsTables();
} else {
    console.log('data in the db already exists: ', products.map(it => {
        return {
            'id': it.get('id'),
            'product': it.get('nameProduct'),
            'in stock': it.get('quantityStock')
            
            
        
        }
        }));
    }
}


async function fillProductsTables () {
        const prodShipMap: ProductsShippingMap = productsShippingMapData.productsShippingMap;
        const {minCost,maxCost, minDueDateDays, maxDueDateDays, minQuantStock, maxQuantStock} = prodConfig;
        
        for (const prodName in prodShipMap) {
            let costProdVal = faker.number.int({min: minCost, max: maxCost});
            let quantityStockVal = faker.number.int({min: minQuantStock, max: maxQuantStock})
            let rowsProducts= {
                nameProduct: prodName,
                cost: costProdVal, 
                shippingRestrictions: prodShipMap[prodName],
                quantityStock: quantityStockVal,
                dueDate: moment(moment()).add(faker.number.int({min: minDueDateDays, max: maxDueDateDays}),'days').format("DD MMMM YYYY"),
                inventoryCost: costProdVal * quantityStockVal,
            }
            await ProductsErp.create(rowsProducts);
           
            
        } 
        } 

     
            
    
    
    

