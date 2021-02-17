import React, { Component } from 'react';
import CourseRow from './CourseRow';
import { toast } from 'react-toastify';

class TableContainer extends Component {
	state = {
		courses: this.props.courses,
	};

	constructor(props) {
		super(props);
		this.state.courses = props.courses;
	}
	render() {
		return (
			<div className='table-container d-flex flex-column justify-content-start align-items-center'>
				<div className='d-flex justify-content-between align-items-center w-100'>
					<h1 className='section-title'> جدول دروس</h1>
					<span
						className='badge badge-pill badge-light '
						style={{ fontSize: '1.5vw' }}
					>
						{this.state.courses.length !== 0
							? this.state.courses
									.map((c) => c.unit)
									.reduce((a, b) => +a + +b)
							: 0}
					</span>
				</div>
				<table className='table'>
					<thead>
						<tr>
							<th scope='col'>حذف</th>
							<th scope='col'>شماره</th>
							<th scope='col'>نام درس</th>
							<th scope='col'>گروه</th>
							<th scope='col'>واحد</th>
							<th scope='col'>استاد</th>
							<th scope='col'>امتحان</th>
							<th scope='col'>اطلاعات</th>
							<th scope='col'>پیغام ثبت‌نام</th>
						</tr>
					</thead>
					<tbody>
						{this.state.courses.map((course) => (
							<CourseRow
								key={course.courseId + '' + course.groupId}
								course={course}
								handleDelete={this.handleDelete}
							></CourseRow>
						))}
					</tbody>
					<tfoot
						style={{
							display:
								this.state.courses.length === 0
									? 'none'
									: 'visible',
						}}
					>
						<tr>
							<th scope='row'>مجموع</th>
							<td></td>
							<td></td>
							<td></td>
							<td>
              {this.state.courses.length !== 0
							? this.state.courses
									.map((c) => c.unit)
									.reduce((a, b) => +a + +b)
							: 0}
							</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tfoot>
				</table>
			</div>
		);
	}

	handleDelete = (course) => {
		const courses = [...this.state.courses];
		const newCourses = courses.filter((c) => c !== course);
		this.setState({ courses: newCourses });
		this.props.handleUpdateCourses(newCourses);
		toast.dark('درس مورد نظر حذف شد', {
			position: 'bottom-left',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};
}

export default TableContainer;
