import Dexie from 'dexie';

const db = new Dexie('AllCourses');
db.version(1).stores({
	courses: '++id, courseId, groupId, depId, timestamp',
	departments: '++id, depId, timestamp',
	userInfo: '++id, name, lastName, stdId, major',
});

export default db;
