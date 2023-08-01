import { addHours } from 'date-fns';
import { useCalendarStore, useUiStore } from '../../hooks';

export const FabAddNew = () => {
	const { openDateModal } = useUiStore();
	const { setActiveEvent } = useCalendarStore();
	const onOpenModal = () => {
		const newEvent = {
			title: 'Hola',
			notes: 'Mundo',
			start: new Date(),
			end: addHours(new Date(), 2),
			bgColor: '#fafafa',
			user: {},
		};
		setActiveEvent(newEvent);
		openDateModal();
	};

	return (
		<button className='btn btn-primary fab' onClick={onOpenModal}>
			<i className='fas fa-plus'></i>
		</button>
	);
};
