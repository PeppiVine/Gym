import { useEffect, useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { groupBy, sumBy } from 'lodash';
import { Typography } from '@mui/material';
import { TRAININGS_URL } from '../api';

interface ActivityStat {
    activity: string;
    totalDuration: number;
}

// OSA 4: Tilastosivu näyttää harjoitustyypit ja niihin varatut minuutit kuvaajana
export default function BarChart() {
    const [stats, setStats] = useState<ActivityStat[]>([]);

    useEffect(() => {
        fetch(TRAININGS_URL)
            .then((res) => res.json())
            .then((data) => {
                const trainings: { activity: string; duration: number }[] =
                    data._embedded.trainings;

                // OSA 4: Ryhmitellään harjoitukset activitykentän mukaan
                const grouped = groupBy(trainings, 'activity');
                // OSA 4: Lasketaan jokaiselle activitylle varattujen minuuttien kokonaismäärä
                const result: ActivityStat[] = Object.entries(grouped).map(([activity, items]) => ({
                    activity,
                    totalDuration: sumBy(items, 'duration'),
                }));

                result.sort((a, b) => b.totalDuration - a.totalDuration);
                setStats(result);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <Typography variant="h6" gutterBottom>
                Trainings by activity (min)
            </Typography>
            {/* OSA 4: Pylväskaavio juttu */}
            <ResponsiveContainer width="100%" height={450}>
                <RechartsBarChart data={stats} margin={{ top: 16, right: 32, left: 16, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="activity" />
                    <YAxis label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft', offset: -4 }} />
                    <Tooltip formatter={(value) => [`${value} min`, 'Duration']} />
                    <Bar dataKey="totalDuration" name="Duration (min)" fill="#7986cb" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
