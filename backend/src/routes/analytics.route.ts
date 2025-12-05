import { Router } from 'express';
import {
	getPostProportionByCategoryController,
	getMostActiveUsersController,
	getPeakActivityController,
	getInterestAndSkillsController,
} from '../controller/analytics.controller';

const router = Router();


router.get('/propotion-category', getPostProportionByCategoryController);
router.get('/most-active-user', getMostActiveUsersController);
router.get('/peak', getPeakActivityController);
router.get('/interest-skills', getInterestAndSkillsController);

export default router;
