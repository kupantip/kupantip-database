import { getDbConnection } from '../database/mssql.database';

export interface CategoryProportion {
	id: string;
	label: string;
	value: number;
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
