import { getDbConnection } from '../database/mssql.database';
import sql from 'mssql';

export interface CategoryProportion {
	id: string;
	label: string;
	value: number;
}

export interface ActiveUserStats {
	name: string;
	num_posts: number;
	num_comments: number;
	rank: number;
}

export const getPostProportionByCategory = async (): Promise<
	CategoryProportion[]
> => {
	const pool = await getDbConnection();

	const result = await pool.request().query(`
		SELECT 
			c.id,
			c.label,
			COUNT(p.id) as value
		FROM [dbo].[category] c
		LEFT JOIN [dbo].[post] p ON c.id = p.category_id AND p.deleted_at IS NULL
		GROUP BY c.id, c.label
		HAVING COUNT(p.id) > 0
		ORDER BY value DESC
	`);

	return result.recordset;
};

export interface PeakActivityData {
	name: string;
	data: { hour: string; engagement: number }[];
}

export const getMostActiveUsers = async (
	limit: number = 10
): Promise<ActiveUserStats[]> => {
	const pool = await getDbConnection();

	const result = await pool.request().input('limit', sql.Int, limit).query(`
		WITH PostCounts AS (
			SELECT author_id, COUNT(*) as post_count 
			FROM [dbo].[post] 
			WHERE deleted_at IS NULL 
			GROUP BY author_id
		),
		CommentCounts AS (
			SELECT author_id, COUNT(*) as comment_count 
			FROM [dbo].[comment] 
			WHERE deleted_at IS NULL 
			GROUP BY author_id
		)
		SELECT TOP (@limit)
			u.display_name as name,
			COALESCE(pc.post_count, 0) as num_posts,
			COALESCE(cc.comment_count, 0) as num_comments,
			ROW_NUMBER() OVER (ORDER BY (COALESCE(pc.post_count, 0) + COALESCE(cc.comment_count, 0)) DESC) as rank
		FROM [dbo].[app_user] u
		LEFT JOIN PostCounts pc ON u.id = pc.author_id
		LEFT JOIN CommentCounts cc ON u.id = cc.author_id
		ORDER BY rank ASC
	`);

	return result.recordset;
};

export const getPeakActivity = async (): Promise<PeakActivityData[]> => {
	const pool = await getDbConnection();
	const result = await pool.request().query(`
		SELECT 
			DATENAME(weekday, created_at) as day_name,
			DATEPART(hour, created_at) as hour,
			COUNT(*) as count
		FROM (
			SELECT created_at FROM [dbo].[post] WHERE deleted_at IS NULL
			UNION ALL
			SELECT created_at FROM [dbo].[comment] WHERE deleted_at IS NULL
		) as activity
		GROUP BY DATENAME(weekday, created_at), DATEPART(hour, created_at)
	`);

	const rawData = result.recordset;

	// Initialize structure for all days and hours
	const days = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	];
	
	const response: PeakActivityData[] = days.map((day) => ({
		name: day,
		data: Array.from({ length: 24 }, (_, i) => ({
			hour: String(i).padStart(2, '0'),
			engagement: 0,
		})),
	}));

	// Fill in data
	rawData.forEach((row: { day_name: string; hour: number; count: number }) => {
		const dayIndex = days.indexOf(row.day_name);
		if (dayIndex !== -1) {
			const hourIndex = row.hour; // 0-23
			if (hourIndex >= 0 && hourIndex < 24) {
				response[dayIndex].data[hourIndex].engagement = row.count;
			}
		}
	});

	return response;
};
