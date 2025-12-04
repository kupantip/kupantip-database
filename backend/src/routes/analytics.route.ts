import { Router } from 'express';
import {
	getPostProportionByCategoryController,
	getMostActiveUsersController,
} from '../controller/analytics.controller';

const router = Router();


router.get('/propotion-category', getPostProportionByCategoryController);
router.get('/most-active-user', getMostActiveUsersController);

export default router;
