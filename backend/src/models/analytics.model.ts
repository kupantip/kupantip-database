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

export interface WordCloudData {
	name: string;
	size: number;
}

export interface DailyActivitySeries {
	id: string; // 'post' | 'comment'
	data: { x: string; y: number }[];
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



export const getInterestAndSkills = async (): Promise<WordCloudData[]> => {
	const pool = await getDbConnection();

	const result = await pool.request().query(`
		SELECT interests, skills
		FROM [dbo].[user_profile]
	`);

	const wordCounts: { [key: string]: number } = {};

	result.recordset.forEach((row: { interests: string; skills: string }) => {
		const text = `${row.interests || ''},${row.skills || ''}`;
		// Split by common separators: comma, ideographic comma, space, newline
		const words = text.split(/[,、\s\n]+/).map((w) => w.trim());

		words.forEach((word) => {
			if (word) {
				const cleanWord = word; // Keep original case as per requirement/example? Example has Mixed Case.
				if (cleanWord.length > 0) {
					wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
				}
			}
		});
	});

	const response: WordCloudData[] = Object.keys(wordCounts)
		.map((key) => ({
			name: key,
			size: wordCounts[key],
		}))
		.sort((a, b) => b.size - a.size);

	return response;
};

export const getPostVsCommentStats = async (
	days: number = 30
): Promise<DailyActivitySeries[]> => {
	const pool = await getDbConnection();

	const result = await pool.request().input('days', sql.Int, days).query(`
		WITH DateRange AS (
			SELECT CAST(DATEADD(day, -number, CAST(GETDATE() AS DATE)) AS DATE) AS date
			FROM master..spt_values
			WHERE type = 'P' AND number BETWEEN 0 AND @days - 1
		),
		PostCounts AS (
			SELECT CAST(created_at AS DATE) as date, COUNT(*) as count
			FROM [dbo].[post]
			WHERE deleted_at IS NULL
			GROUP BY CAST(created_at AS DATE)
		),
		CommentCounts AS (
			SELECT CAST(created_at AS DATE) as date, COUNT(*) as count
			FROM [dbo].[comment]
			WHERE deleted_at IS NULL
			GROUP BY CAST(created_at AS DATE)
		)
		SELECT 
			CONVERT(VARCHAR(10), dr.date, 105) as date_str, -- DD-MM-YYYY
			dr.date,
			COALESCE(pc.count, 0) as post_count,
			COALESCE(cc.count, 0) as comment_count
		FROM DateRange dr
		LEFT JOIN PostCounts pc ON dr.date = pc.date
		LEFT JOIN CommentCounts cc ON dr.date = cc.date
		ORDER BY dr.date ASC
	`);

	const postSeries: DailyActivitySeries = { id: 'post', data: [] };
	const commentSeries: DailyActivitySeries = { id: 'comment', data: [] };

	result.recordset.forEach((row) => {
		postSeries.data.push({ x: row.date_str, y: row.post_count });
		commentSeries.data.push({ x: row.date_str, y: row.comment_count });
	});

	return [postSeries, commentSeries];
};
