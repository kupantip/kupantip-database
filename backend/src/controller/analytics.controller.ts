import { Request, Response, NextFunction } from 'express';
import { getPostProportionByCategory } from '../models/analytics.model';

export const getPostProportionByCategoryController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
        const data = await getPostProportionByCategory();
		return res.status(200).json(data);
	} catch (err) {
		next(err);
	}
};
