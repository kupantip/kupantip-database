import { usePeakActivity } from '@/services/admin/statistics';
import { ResponsiveHeatMap } from '@nivo/heatmap';

export default function HeatMap() {
	const { data, isLoading, isError } = usePeakActivity();

	if (isLoading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<div className="text-gray-400">Loading heatmap data...</div>
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

	// Transform data for Nivo heatmap format
	const transformedData = data.map((day) => ({
		id: day.name,
		data: day.data.map((hourData) => ({
			x: hourData.hour,
			y: hourData.engagement,
		})),
	}));

	return (
		<div className="w-full h-full">
			<ResponsiveHeatMap
				data={transformedData}
				margin={{ top: 20, right: 60, bottom: 60, left: 80 }}
				valueFormat=">-.0f"
				axisTop={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: -45,
					legend: 'Hour of Day',
					legendOffset: 46,
				}}
				axisRight={null}
				axisLeft={{
					tickSize: 1,
					tickPadding: 1,
					tickRotation: 0,
					legend: 'Day of Week',
					legendPosition: 'middle',
					legendOffset: -70,
				}}
				colors={{
					type: 'sequential',
					scheme: 'blues',
				}}
				emptyColor="#f0f0f0"
				borderColor={{
					from: 'color',
					modifiers: [['darker', 0.3]],
				}}
				labelTextColor={{
					from: 'color',
					modifiers: [['darker', 1.8]],
				}}
				legends={[
					{
						anchor: 'bottom',
						translateX: 0,
						translateY: 30,
						length: 300,
						thickness: 8,
						direction: 'row',
						tickPosition: 'after',
						tickSize: 3,
						tickSpacing: 4,
						tickOverlap: false,
						title: 'Activity Level →',
						titleAlign: 'start',
						titleOffset: 4,
					},
				]}
				tooltip={({ cell }) => (
					<div className="bg-white px-3 py-2 rounded shadow-lg border">
						<strong>{cell.serieId}</strong>
						<br />
						<span className="text-sm">Hour: {cell.data.x}:00</span>
						<br />
						<span className="text-sm">
							Activities: {cell.formattedValue}
						</span>
					</div>
				)}
			/>
		</div>
	);
}
