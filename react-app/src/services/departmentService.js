import http from './httpService';
import db from './db';

const apiUrl = 'http://058a6a685fc8.ngrok.io/api';

export function getAllDepartments() {
	return http.get(apiUrl + '/schedule/all_departments');
}

export function populateDepartmentsOnDb(departments) {
	for (let key in departments) {
		db.departments.add({
			depId: key,
			department: departments[key],
			timestamp: new Date().getTime(),
		});
	}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getAllDepartments,
	populateDepartmentsOnDb,
};
