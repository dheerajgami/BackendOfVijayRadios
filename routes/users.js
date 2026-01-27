import express from 'express';
import {getUser,updateUser,deleteUser, searchUsers} from '../controllers/user.controller.js';
import {protect} from '../middleware/auth.middleware.js';
import {updateUserValidator} from '../validations/user.validate.js';
import {validate} from '../middleware/validatorErrorHandler.js';

const router = express.Router();

router.use("/",protect)
.delete("/",deleteUser)
.get("/me",getUser);

router.patch("/",updateUserValidator,validate,updateUser);

router.get("/search",searchUsers);

export default router;

