import { Router } from 'express';
import {
	getPostProportionByCategoryController,
	getMostActiveUsersController,
	getPeakActivityController,
	getInterestAndSkillsController,
	getPostVsCommentStatsController,
} from '../controller/analytics.controller';

const router = Router();


router.get('/propotion-category', getPostProportionByCategoryController);
router.get('/most-active-user', getMostActiveUsersController);
router.get('/peak', getPeakActivityController);
router.get('/interest-skills', getInterestAndSkillsController);
router.get('/post-vs-comment', getPostVsCommentStatsController);

export default router;
