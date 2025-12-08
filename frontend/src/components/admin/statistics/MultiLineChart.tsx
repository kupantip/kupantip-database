import { useState } from 'react';
import { usePostVsCommentStats } from '@/services/admin/statistics';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

export default function MultiLineChart() {
	const [selectedDays, setSelectedDays] = useState(30);
	const { data, isLoading, isError } = usePostVsCommentStats(selectedDays);

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

	// Transform data for Recharts format
	// Group data by date (x value) and combine post/comment values
	const dateMap = new Map<
		string,
		{ date: string; posts: number; comments: number }
	>();

	data.forEach((series) => {
		series.data.forEach((point) => {
			const date = point.x;
			const existing = dateMap.get(date) || {
				date,
				posts: 0,
				comments: 0,
			};

			if (series.id.toLowerCase().includes('post')) {
				existing.posts = point.y;
			} else if (series.id.toLowerCase().includes('comment')) {
				existing.comments = point.y;
			}

			dateMap.set(date, existing);
		});
	});

	const chartData = Array.from(dateMap.values()).sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);

	return (
		<div className="w-full h-full flex flex-col">
			{/* Day Selector */}
			<div className="flex gap-2 mb-4">
				<button
					onClick={() => setSelectedDays(7)}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
						selectedDays === 7
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
				>
					7 Days
				</button>
				<button
					onClick={() => setSelectedDays(30)}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
						selectedDays === 30
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
				>
					30 Days
				</button>
			</div>

			{/* Chart */}
			<div className="flex-1 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={chartData}
						margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
						<XAxis
							dataKey="date"
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => {
								const date = new Date(value);
								return `${
									date.getMonth() + 1
								}/${date.getDate()}`;
							}}
						/>
						<YAxis tick={{ fontSize: 12 }} />
						<Tooltip
							contentStyle={{
								backgroundColor: 'white',
								border: '1px solid #ccc',
								borderRadius: '8px',
							}}
							labelFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString();
							}}
						/>
						<Legend
							wrapperStyle={{ fontSize: '14px' }}
							iconType="line"
						/>
						<Line
							type="monotone"
							dataKey="posts"
							stroke="#3b82f6"
							strokeWidth={2}
							dot={{ r: 3 }}
							activeDot={{ r: 5 }}
							name="Posts"
						/>
						<Line
							type="monotone"
							dataKey="comments"
							stroke="#10b981"
							strokeWidth={2}
							dot={{ r: 3 }}
							activeDot={{ r: 5 }}
							name="Comments"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
