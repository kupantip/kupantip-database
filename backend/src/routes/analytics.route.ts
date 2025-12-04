import { Router } from 'express';
import {
	getPostProportionByCategoryController,
	getMostActiveUsersController,
	getPeakActivityController,
} from '../controller/analytics.controller';

const router = Router();


router.get('/propotion-category', getPostProportionByCategoryController);
router.get('/most-active-user', getMostActiveUsersController);
router.get('/peak', getPeakActivityController);

export default router;
