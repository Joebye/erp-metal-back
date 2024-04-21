import express from 'express';
import asyncHandler from 'express-async-handler';
import EmailsService from '../service/EmailsService';

export const emails = express.Router();


const emailsService = new EmailsService();

emails.post('/addemail', asyncHandler(
    async (req, res) => {
         const email = await emailsService.addEmail(req.body); 
        if (email && req.body.id) {
            res.status(400);
            throw `email with id ${req.body.id} already exists`
        }
        res.send(email);
    }
))