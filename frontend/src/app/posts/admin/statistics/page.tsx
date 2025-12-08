'use client';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PieChart from '@/components/admin/statistics/PieChart';

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
				{/* Graph 1 */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[400px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						📊 User Activity
					</h2>
					<div className="flex-1 flex items-center justify-center text-gray-400">
						Chart coming soon
					</div>
				</div>

				{/* Graph 2 */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[400px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						📈 Post Trends
					</h2>
					<div className="flex-1 flex items-center justify-center text-gray-400">
						Chart coming soon
					</div>
				</div>

				{/* Graph 3 */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[400px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						💬 Comment Statistics
					</h2>
					<div className="flex-1 flex items-center justify-center text-gray-400">
						Chart coming soon
					</div>
				</div>

				{/* Graph 4 */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[400px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						⭐ Engagement Metrics
					</h2>
					<div className="flex-1 flex items-center justify-center text-gray-400">
						Chart coming soon
					</div>
				</div>

				{/* Graph 5 - PieChart */}
				<div className="bg-white rounded-xl shadow-md p-6 h-[400px] flex flex-col hover:shadow-lg transition-shadow">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
						🥧 Category Distribution
					</h2>
					<div className="flex-1 flex items-center justify-center">
						<PieChart />
					</div>
				</div>
			</div>
		</div>
	);
}
