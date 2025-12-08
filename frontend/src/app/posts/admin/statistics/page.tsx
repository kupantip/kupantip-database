'use client';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PieChart from '@/components/admin/statistics/PieChart';
import HeatMap from '@/components/admin/statistics/HeatMap';
import MultiLineChart from '@/components/admin/statistics/MultiLineChart';
import TopUsersTable from '@/components/admin/statistics/TopUserTable';
import { Trophy } from 'lucide-react';

export default function StatisticsPage() {
	useEffect(() => {
		AOS.init({
			duration: 500,
			once: true,
			offset: 80,
		});
	}, []);
	return (
		<div
			data-aos="fade-up"
			className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8"
		>
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-gray-800 mb-2">
					Analytics Dashboard
				</h1>
				<p className="text-gray-600">
					Overview of platform statistics and insights
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Graph 1 - HeatMap */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[420px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						🔥 Peak Activity Heatmap
					</h2>
					<p className="text-sm text-gray-600 mb-3">
						Shows when users are most active throughout the week.
						Darker colors indicate higher engagement during those
						hours.
					</p>
					<div className="flex-1 flex items-center justify-center">
						<HeatMap />
					</div>
				</div>

				{/* Graph 2 */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[420px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						<Trophy className="w-5 h-5 text-yellow-500" />
                        Top Contributors
					</h2>
					<p className="text-sm text-gray-600 mb-3">
						Ranking users by their total engagement (posts & comments).
					</p>
					<div className="flex-1 flex items-center justify-center text-gray-400">
						<TopUsersTable/>
					</div>
				</div>

				{/* Graph 3 */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[420px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						💬 Graph 3
					</h2>
					<div className="flex-1 flex items-center justify-center text-gray-400">
						Chart coming soon
					</div>
				</div>

				{/* Graph 4 - MultiLineChart */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[420px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						📊 Posts vs Comments Trend
					</h2>
					<p className="text-sm text-gray-600 mb-3">
						Track daily posts and comments over time. Compare
						activity patterns between content creation and
						engagement.
					</p>
					<div className="flex-1 flex items-center justify-center">
						<MultiLineChart />
					</div>
				</div>

				{/* Graph 5 - PieChart */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[420px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						🥧 Category Distribution
					</h2>
					<p className="text-sm text-gray-600 mb-3">
						The graph tracks total post interactions (votes and
						comments) to determine if the Recruit or General
						category is more engaging, revealing a perfectly equal
						contribution of activity from both areas.
					</p>
					<div className="flex-1 flex items-center justify-center">
						<PieChart />
					</div>
				</div>
			</div>
		</div>
	);
}
