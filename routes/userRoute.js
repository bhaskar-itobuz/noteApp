import express from 'express'
import { createData, verifyData ,checkLogin,generateAccestoken} from '../controllers/userController.js';
import { validateData } from '../middleware/validateData.js';
import { userRegistrationSchema, userLoginSchema } from '../validator/userValidation.js';

const route = express.Router();

route.post('/create', validateData(userRegistrationSchema),createData);
route.get('/verify/:token',verifyData);
route.post('/check',validateData(userLoginSchema),checkLogin);
route.get('/createToken',generateAccestoken);

export default route;