import express from 'express'
import { createData, verifyData ,checkLogin,generateAccestoken, logout} from '../controllers/userController.js';
import {imageUpload} from '../controllers/fileControler.js'
import { validateData } from '../middleware/validateData.js';
import { userRegistrationSchema, userLoginSchema } from '../validator/userValidation.js';

const route = express.Router();

route.post('/create', validateData(userRegistrationSchema),createData);
route.get('/verify/:token',verifyData);
route.post('/check',validateData(userLoginSchema),checkLogin);
route.get('/createToken',generateAccestoken);
route.get('/logout',logout);
route.post('/uploadImage', imageUpload.single('image'), (req, res) => {
    res.send(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

export default route;