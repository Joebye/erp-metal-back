import config from 'config';
import {EmailsErp} from '../domain/ModelConnectionEmails';

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