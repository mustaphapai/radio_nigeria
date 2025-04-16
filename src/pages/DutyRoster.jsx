import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const DutyRoster = ({ duties }) => {
    return (
        <Card className="w-full overflow-x-auto">
            <CardHeader>
                <CardTitle>Duty Roster</CardTitle>
            </CardHeader>
            <CardContent>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Additional Info</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {duties.map((duty, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{duty.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{duty.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{duty.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{duty.additionalInfo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};

export default DutyRoster;