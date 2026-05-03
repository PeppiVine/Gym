import { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { TRAININGS_URL } from '../api';

dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.locale('en');
const localizer = dayjsLocalizer(dayjs);

interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
}


export default function CalendarView() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    // OSA 3: Kalenterin näkymä (päivä/viikko/kuukausi).
    const [view, setView] = useState<View>(Views.MONTH);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        fetch(TRAININGS_URL)
            .then((res) => res.json())
            .then(async (data) => {
                const calEvents: CalendarEvent[] = await Promise.all(
                    data._embedded.trainings.map(
                        async (training: {
                            date: string;
                            duration: number;
                            activity: string;
                            _links: { customer: { href: string } };
                        }) => {
                            let customerName = '';
                            try {
                                const res = await fetch(training._links.customer.href);
                                if (res.ok) {
                                    const c = await res.json();
                                    customerName = `${c.firstname} ${c.lastname}`;
                                }
                            } catch {
                                customerName = 'Tuntematon';
                            }

                            const start = dayjs(training.date).toDate();
                            const end = dayjs(training.date).add(training.duration, 'minute').toDate();

                            return {
                                title: `${training.activity} / ${customerName}`,
                                start,
                                end,
                            };
                        }
                    )
                );
                setEvents(calEvents);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div style={{ padding: '16px', height: 'calc(100vh - 80px)' }}>
            {/* OSA 3: Kalenterisivu näyttää kaikki varatut treenit. */}
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                culture="en"
                // OSA 3: Saadaan päivä,viikko ja kuukausinäkymä.
                views={[Views.DAY, Views.WEEK, Views.MONTH]}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                style={{ height: '100%' }}
            />
        </div>
    );
}
