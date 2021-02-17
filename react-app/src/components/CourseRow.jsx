import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { Textfit } from 'react-textfit';

class CourseRow extends Component {
	state = {};
	render() {
		return (
			<tr>
				<td className='delete-icon'>
					<FontAwesomeIcon
						onClick={() =>
							this.props.handleDelete(this.props.course)
						}
						icon={faMinusCircle}
						className='p-1 mx'
					/>
				</td>
				<td>{this.props.course.courseId}</td>
				<td>{this.props.course.title} </td>
				<td>{this.props.course.groupId}</td>
				<td>{this.props.course.unit}</td>
				<td>{this.props.course.instructor}</td>
				<td>{this.props.course.examTime.replace(' ', ' - ')}</td>
				<td>{this.props.course.info}</td>
				<td>{this.props.course.onRegister}</td>
			</tr>
		);
	}
}

export default CourseRow;
