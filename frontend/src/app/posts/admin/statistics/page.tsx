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
			className="space-y-4 bg-gray-100 p-5 rounded-lg"
		>
			<div className="text-3xl font-bold text-green-1">Stats Page</div>
			<div className="grid grid-cols-2 gap-10">
				<div className="w-full bg-gray-200">
					<div className="text-xl font-semibold">Graph 1: Table</div>
				</div>
				<div className="w-full bg-gray-200">
					<div className="text-xl font-semibold">Graph 2: Table</div>
				</div>{' '}
				<div className="w-full bg-gray-200">
					<div className="text-xl font-semibold">Graph 3: Table</div>
				</div>
				<div className="w-full bg-gray-200">
					<div className="text-xl font-semibold">Graph 4: Table</div>
				</div>{' '}
				<div className="w-full bg-gray-200">
					<div className="text-xl font-semibold">Graph 5: PieChart</div>
                    <div><PieChart/></div>
				</div>{' '}
			</div>
		</div>
	);
}
