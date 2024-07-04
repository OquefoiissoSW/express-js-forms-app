import { Router } from "express";
import formsController from './forms/forms.controller';
import authController from './auth/auth.controller';

const api = Router()
    .use(formsController)
    .use(authController);

export default Router().use('/api', api)