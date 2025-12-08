import { PieChart as RePieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { useCategoryProportion } from '@/services/admin/statistics';

const COLORS = [
	'#0088FE',
	'#00C49F',
	'#FFBB28',
	'#FF8042',
	'#8884D8',
	'#82ca9d',
	'#ffc658',
	'#ff7c7c',
];

export default function PieChart() {
	const { data, isLoading, isError } = useCategoryProportion();

	if (isLoading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<div className="text-gray-400">Loading chart data...</div>
			</div>
		);
	}

	if (isError || !data || data.length === 0) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<div className="text-gray-400">No data available</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full flex items-center justify-center">
			<RePieChart width={380} height={320}>
				<Pie
					data={data}
					dataKey="value"
					nameKey="label"
					cx="50%"
					cy="45%"
					outerRadius={70}
					label
				>
					{data.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
						/>
					))}
				</Pie>
				<Tooltip />
				<Legend verticalAlign="top" height={36} iconType="circle" />
			</RePieChart>
		</div>
	);
}
