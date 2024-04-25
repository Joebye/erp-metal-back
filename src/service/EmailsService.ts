import config from 'config';
import { EmailsErp, ProductsErp } from '../domain/ModelConnectionEmails';
import { ProductsShippingMap } from '../types/types';
import productsShippingMapData from '../config-common/product-config.json'; 
import { Sequelize} from 'sequelize';

export default class EmailsService {
       
    async addEmail (email: any) {
            const statusEmailDbByDefault = 'pending';
            let emailRes: any;
            let newId = await this.#getId();
            
            try {
                emailRes = await EmailsErp.create({
                ...email, id: newId, status: statusEmailDbByDefault
               })
               return emailRes;
                   
            } catch (error: any) {
                if (error.code != 11000) { 
                    throw error;
                }
            }
     }

       async getEmail(id: number) {
        const email = await EmailsErp.findByPk(id);
        return email;
       }

       async generRFQ(id: any) {
        console.log(id);
        
        const res = await EmailsErp.findByPk(id);
        const text = res?.dataValues.text;
        let foundItemsObj = findMatching(text);
        console.log(foundItemsObj);
        const keys = Object.keys(foundItemsObj);
        const vals = Object.values(foundItemsObj);
        let constExistProdsInDb: any = {};
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = vals[i];


        constExistProdsInDb = await ProductsErp.findAll({
            attributes: ['id', 'nameProduct', 'cost', 'shippingRestrictions', 'dueDate', 'quantityStock', 'dueDate', 'inventoryCost',
            [
                Sequelize.literal('quantityStock - :valueClient'), 'quantNeeded'
            ]
            ], where: {nameProduct: key},
            replacements: {
                valueClient: val
            }
       });
        
        
    }
            console.log(constExistProdsInDb.map((it: { dataValues: { nameProduct: any, quantNeeded: any, inventoryCost: any}; }) => {
            return {n: it.dataValues.nameProduct, stock: it.dataValues.quantNeeded, inventCost: it.dataValues.inventoryCost}
        }));
  
        
        
        return res;
        
       }



       async getEmailsAllOrByCurUser(curUsEmail?: any) {
        if (curUsEmail != undefined) {
             const emailsByCurUser = await EmailsErp.findAll({where: {curUserEmail: curUsEmail},})
             return emailsByCurUser;
        } else {
            const allEmails = await EmailsErp.findAll();
            return allEmails;
        }
}

       
        async #getId() {
        let id;
        const minId = config.get("email.minId") as number;
        const maxId = config.get("email.maxId") as number;
        const delta = maxId - minId + 1;
       do {
            id = minId + Math.trunc(Math.random() * delta);
        } while(await this.getEmail(id));
        return id;
        }

}

function findMatching(text: string) {
    const prodShipMap: ProductsShippingMap = productsShippingMapData.productsShippingMap;
    const arProd = Object.keys(prodShipMap);
    const targetText = text.toLowerCase().split(' ').join('');
    let foundProducts: any = {};
    let quantityAr: any;
    let quantProd = 0;
     
    arProd.forEach(product => {
        const productName = product.toLowerCase().replace(/\s+/g, ''); 
            if (targetText.includes(productName)) {
                
                const startIndex = targetText.indexOf(productName) + productName.length;
                quantityAr = targetText.substring(startIndex).match(/^\d+/);
                
                if (quantityAr) {
                    quantProd = parseInt(quantityAr[0]); 
                    foundProducts[product] = quantProd;
                } else {
                    quantityAr = [];
                    quantProd = 0;
                    foundProducts[product] = quantProd;
                }
                
                
            }
        });
        return foundProducts;
      
      }


