import { useDispatch, useSelector } from 'react-redux';
import {
	onAddNewEvent,
	onDeleteEvent,
	onLoadEvents,
	onSetActiveEvent,
	onUpdateEvent,
} from '../store/calendar/calendarSlice';
import { calendarApi } from '../api';
import { convertDateToEventDate } from '../helpers';
import Swal from 'sweetalert2';

export const useCalendarStore = () => {
	const dispatch = useDispatch();
	const { events, activeEvent } = useSelector(store => store.calendar);
	const { user } = useSelector(store => store.auth);

	const setActiveEvent = event => dispatch(onSetActiveEvent(event));

	const startSavingEvent = async calendarEvent => {
		try {
			if (calendarEvent.id) {
				//* Update
				await calendarApi.put(`/event/${calendarEvent.id}`, calendarEvent);

				dispatch(onUpdateEvent({ ...calendarEvent, user }));
				return;
			}
			//* Create
			const { data } = await calendarApi.post('/event', calendarEvent);

			dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));
		} catch (error) {
			console.log(error);
			Swal.fire('Error al guardar', error.response.data.msg, 'error');
		}
	};

	const startDeletingEvent = async () => {
		try {
			await calendarApi.delete(`/event/${activeEvent.id}`);

			dispatch(onDeleteEvent());
		} catch (error) {
			console.log(error);
			Swal.fire('Error al eliminar', error.response.data.msg, 'error');
		}
	};

	const startLoadingEvents = async () => {
		try {
			const { data } = await calendarApi.get('/event');

			const events = convertDateToEventDate(data.events);

			dispatch(onLoadEvents(events));
		} catch (error) {
			console.log('Error cargando eventos');
			console.log(error);
		}
	};

	return {
		//* Props
		events,
		activeEvent,
		setActiveEvent,
		hasSelectedEvent: !!activeEvent,

		//* methods
		startSavingEvent,
		startDeletingEvent,
		startLoadingEvents,
	};
};
