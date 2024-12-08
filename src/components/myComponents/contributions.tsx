import React, { useState, useEffect } from 'react';
import GitHubCalendar from 'react-github-calendar';
import { useSearchParams } from 'react-router-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const GitHubContributions: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string>(
        new Date().getFullYear().toString()
    );


    const username = searchParams.get('user');
    const years = ['2020', '2021', '2022', '2023', '2024'];

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">
                    GitHub Contributions for {username}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-8">
                    <Select
                        value={selectedYear}
                        onValueChange={setSelectedYear}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isLoaded && (
                    <div className="flex items-center justify-center w-full overflow-x-auto p-4">
                        <GitHubCalendar
                            username={username}
                            blockSize={15}
                            blockMargin={5}
                            fontSize={16}
                            colorScheme="light"
                            year={parseInt(selectedYear)}
                            showWeekdayLabels
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default GitHubContributions;