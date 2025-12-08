import { PieChart as RePieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const mockdata = [
	{
		id: '5C83433E-F36B-1410-8D75-00479C3431C8',
		label: 'Study',
		value: 2,
	},
	{
		id: 'CBEF423E-F36B-1410-8682-003E489689F7',
		label: 'General',
		value: 1,
	},
	{
		id: 'D0EF423E-F36B-1410-8682-003E489689F7',
		label: 'Events',
		value: 1,
	},
	{
		id: '448C433E-F36B-1410-8D74-00479C3431C8',
		label: 'Game',
		value: 1,
	},
	{
		id: '508C433E-F36B-1410-8D74-00479C3431C8',
		label: 'off-topic',
		value: 1,
	},
];

export default function PieChart() {
	return (
		<div>
			<RePieChart>
				<Legend layout="vertical" align="left" verticalAlign="middle" />
			</RePieChart>

			<RePieChart>
				<Pie data={mockdata} dataKey="value">
					{' '}
					{mockdata.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							// fill={COLORS[index % COLORS.length]}
						/>
					))}
				</Pie>
				<Tooltip />
			</RePieChart>
		</div>
	);
}
