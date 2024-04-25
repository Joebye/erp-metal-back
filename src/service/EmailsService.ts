import config from 'config';
import { EmailsErp, ProductsErp } from '../domain/ModelConnectionEmails';
import { Product, ProductsShippingMap } from '../types/types';
import productsShippingMapData from '../config-common/product-config.json'; 

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
        const res = await EmailsErp.findByPk(id);
        const text = res?.dataValues.text;
        let foundItemsObj = findMatching(text);
        const keys: any = Object.keys(foundItemsObj);
        const vals: any = Object.values(foundItemsObj);
        let existProdsInDb: any = {};

        existProdsInDb = await ProductsErp.findAll({
            where: {
                nameProduct: keys
            }
        })
    const flattenedArray: Product[] = existProdsInDb.flat();
    const dataValObj = flattenedArray.map(it => it.dataValues);
   
    const updatedProducts = dataValObj.map(product => {
        if (Object.keys(foundItemsObj).includes(product.nameProduct)) {
            const ind = keys.indexOf(product.nameProduct)
            const newQuantity = product.quantityStock - vals[ind];
            product.quantityStock = newQuantity < 0 ? product.quantityStock : vals[ind]; 
            product.inventoryCost = product.quantityStock * product.cost
        }
            return product;
      });

        return updatedProducts;
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


