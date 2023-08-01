import { useState, useEffect } from 'react';
import { Calendar } from 'react-big-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { localizer } from '../../helpers/calendarLocalizer';
import { getMessages } from '../../helpers/getMessages';
import { Navbar, CalendarEvent, CalendarModal, FabAddNew } from '../components';
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks';
import { FabDelete } from '../components/FabDelete';

export const CalendarPage = () => {
	const [lastView, setLastView] = useState(
		localStorage.getItem('lastView') || 'week'
	);

	const { openDateModal } = useUiStore();
	const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
	const { user } = useAuthStore();

	const eventSyleGetter = (event, start, end, isSelected) => {
		const isMyEvent =
			user.uid === event.user.uid || user.uid === event.user._id;

		const style = {
			// backgroundColor: isSelected ? '#222222' : '#347cf7',
			backgroundColor: isMyEvent ? '#347CF7' : '#465660',
			borderRadius: '5px',
			opacity: 0.8,
			color: 'white',
		};

		return {
			style,
		};
	};

	const onDoubleClick = event => {
		console.log({ doubleClick: event });
		openDateModal();
	};

	const onSelect = event => {
		console.log({ click: event });
		setActiveEvent(event);
	};

	const onViewChanged = event => {
		console.log({ viewChanged: event });
		localStorage.setItem('lastView', event);
		setLastView(event);
	};

	useEffect(() => {
		startLoadingEvents();
	}, []);

	return (
		<>
			<Navbar />

			<Calendar
				culture='es'
				localizer={localizer}
				events={events}
				startAccessor='start'
				endAccessor='end'
				style={{ height: 'calc( 100vh - 80px )' }}
				messages={getMessages()}
				eventPropGetter={eventSyleGetter}
				components={{
					event: CalendarEvent,
				}}
				defaultView={lastView}
				onDoubleClickEvent={onDoubleClick}
				onSelectEvent={onSelect}
				onView={onViewChanged}
			/>

			<CalendarModal />
			<FabDelete />
			<FabAddNew />
		</>
	);
};
