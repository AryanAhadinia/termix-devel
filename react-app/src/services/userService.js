import http from './httpService';
import db from './db';

const apiUrl = '/api';

export function getMyUserInfo() {
	return http.get(apiUrl + '/user/my_account');
}

export function updateMyInfo(user) {
	return http.get(apiUrl + '/user/my_account', user);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getMyUserInfo,
	updateMyInfo,
};
