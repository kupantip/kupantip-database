import { Request, Response, NextFunction } from 'express';
import {
	getPostProportionByCategory,
	getMostActiveUsers,
} from '../models/analytics.model';

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

export const getMostActiveUsersController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const range = req.query.range;
		let limit = 5;

		if (range) {
			const parsedLimit = parseInt(range as string, 10);
			if (!isNaN(parsedLimit) && parsedLimit > 0) {
				limit = parsedLimit;
			}
		}

		const data = await getMostActiveUsers(limit);
		return res.status(200).json(data);
	} catch (err) {
		next(err);
	}
};
