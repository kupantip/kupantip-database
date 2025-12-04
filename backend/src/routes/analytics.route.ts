import { Router } from 'express';
import { getPostProportionByCategoryController } from '../controller/analytics.controller';

const router = Router();


router.get('/propotion-category', getPostProportionByCategoryController);

export default router;
