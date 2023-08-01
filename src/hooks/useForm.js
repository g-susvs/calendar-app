import { useEffect, useMemo, useState } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {
	const [formState, setFormState] = useState(initialForm);

	const formValidation = useMemo(() => {
		const formCheckedValues = {};

		for (const formField of Object.keys(formValidations)) {
			const [fn, errorMessage] = formValidations[formField];
			formCheckedValues[`${formField}Valid`] = fn(formState[formField])
				? null
				: errorMessage;
		}

		return formCheckedValues;
	}, [formState]);

	const isFormValid = useMemo(() => {
		for (const formField of Object.keys(formValidation)) {
			if (formValidation[formField] != null) return false;
		}

		return true;
	}, [formValidation]);

	useEffect(() => setFormState(initialForm), [initialForm]);

	const onInputChange = ({ target }) => {
		const { name, value } = target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const onResetForm = () => {
		setFormState(initialForm);
	};

	return {
		...formState,
		...formValidation,
		formState,
		isFormValid,
		onInputChange,
		onResetForm,
	};
};