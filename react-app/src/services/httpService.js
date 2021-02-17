import axios from 'axios';
import { toast } from 'react-toastify';

axios.interceptors.response.use(null, (error) => {
	const expectedError =
		error.response &&
		error.response.status >= 400 &&
		error.response.status <= 500;

	if (!expectedError) {
		toast.dark(error, {
			position: 'bottom-left',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	}

	return Promise.reject(error);
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete,
};
