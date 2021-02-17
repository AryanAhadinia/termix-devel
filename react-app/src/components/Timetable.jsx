import React, { Component } from 'react';
import TableCard from './TableCard';
import '../time-table.css';
import { toast } from 'react-toastify';
import Course from './Course';

class Timetable extends Component {
	state = {
		height: 0,
		hoveredCourse: this.props.hoveredCourse,
		courses: this.props.courses,
	};

	constructor(props) {
		super(props);
		this.state.courses = this.props.courses;
		this.state.hoveredCourse = props.hoveredCourse;
	}

	componentDidUpdate(prevProps) {
		if (prevProps.courses !== this.props.courses)
			this.setState({ courses: this.props.courses });
		if (prevProps.hoveredCourse !== this.props.hoveredCourse)
			this.setState({ hoveredCourse: this.props.hoveredCourse });
	}
    
    getIndexes = (course) => {
        let currentIndex = this.state.courses.findIndex(c => c === course);
        let zIndex;
        let indexes = [];
        const courses = this.state.courses.filter(c => c !== course);
        

         for (let index = 0; index < course.classTimeArray.length; index++) {
             const element = course.classTimeArray[index];
             for (let i = 0; i < element.days.length; i++) {
                 zIndex = 0;
                 const element2 = element.days[i];                
                 for (let x = 0; x < currentIndex; x++) {
                     const tempCourse = courses[x];

                     let tempCols = [];
                     let tempRows = [];
                     let tempDurs = [];

                     for (let j = 0; j < tempCourse.classTimeArray.length; j++) {
                        const element3 = tempCourse.classTimeArray[j];
                        for (let k = 0; k < element3.days.length; k++) {
                            const element4 = element3.days[k];
                            tempCols = [...tempCols, (element4+2)];
                            tempRows = [...tempRows, ((element3.startHour - 7)*2) + 2 + (element3.startMin / 30)];
                            tempDurs = [...tempDurs, ((element3.endHour - element3.startHour)*2) + ((element3.endMin - element3.startMin)/30)]; 
                        }
                    }
        

                    for (let j = 0; j < tempCols.length; j++) {
                        const col = tempCols[j];
                        if(col === (element2+2)){
                            if(tempRows[j] === ((element.startHour - 7)*2) + 2 + (element.startMin / 30)){
                                zIndex++;
                            }else if(tempRows[j] < ((element.startHour - 7)*2) + 2 + (element.startMin / 30)){
                                if(tempRows[j] + tempDurs[j] > ((element.startHour - 7)*2) + 2 + (element.startMin / 30)){
                                    zIndex++;
                                }
                            }else{
                                if((((element.startHour - 7)*2) + 2 + (element.startMin / 30) + ((element.endHour - element.startHour)*2) + ((element.endMin - element.startMin)/30)) > tempRows[j]){
                                    zIndex++;
                                }
                            }
                        }
                    } 
                 }
                 indexes = [...indexes, zIndex];
             }
         }
         return indexes;
     }

	render() {
		return (
			<div
				className='timetable-container d-flex flex-column justify-content-between w-100'
				id='timetable-container'
			>
				<div className='d-flex justify-content-between align-items-center w-100'>
					<h1 className='section-title'>برنامه‌ریزی</h1>
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
				<div className='timetable'>
					<h1 className='weekdays' style={{ gridColumn: '2' }}>
						شنبه
					</h1>
					<h1 className='weekdays' style={{ gridColumn: '3' }}>
						یکشنبه
					</h1>
					<h1 className='weekdays' style={{ gridColumn: '4' }}>
						دوشنبه
					</h1>
					<h1 className='weekdays' style={{ gridColumn: '5' }}>
						سه‌شنبه
					</h1>
					<h1 className='weekdays' style={{ gridColumn: '6' }}>
						چهارشنبه
					</h1>
					<h1 className='weekdays' style={{ gridColumn: '7' }}>
						پنجشنبه
					</h1>
					<div
						className='grid-col'
						id='height-setter'
						style={{ gridColumn: '2' }}
					>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
					</div>
					<div className='grid-col' style={{ gridColumn: '3' }}>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
					</div>
					<div className='grid-col' style={{ gridColumn: '4' }}>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
					</div>
					<div className='grid-col' style={{ gridColumn: '5' }}>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
					</div>
					<div className='grid-col' style={{ gridColumn: '6' }}>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
					</div>
					<div className='grid-col' style={{ gridColumn: '7' }}>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
						<div className='empty-cell'></div>
					</div>
					<label htmlFor='' className='clock'>
						7:00
					</label>
					<label htmlFor='' className='clock'>
						8:00
					</label>
					<label htmlFor='' className='clock'>
						9:00
					</label>
					<label htmlFor='' className='clock'>
						10:00
					</label>
					<label htmlFor='' className='clock'>
						11:00
					</label>
					<label htmlFor='' className='clock'>
						12:00
					</label>
					<label htmlFor='' className='clock'>
						13:00
					</label>
					<label htmlFor='' className='clock'>
						14:00
					</label>
					<label htmlFor='' className='clock'>
						15:00
					</label>
					<label htmlFor='' className='clock'>
						16:00
					</label>
					<label htmlFor='' className='clock'>
						17:00
					</label>
					<label htmlFor='' className='clock'>
						18:00
					</label>
					<label htmlFor='' className='clock'>
						19:00
					</label>
					<label htmlFor='' className='clock'>
						20:00
					</label>

                    {this.state.courses.map(card => (
                        <TableCard key={card.courseId + "" + card.groupId} allCourses={this.props.courses} indexes={this.getIndexes(card)} course={card} handleDelete={this.handleDelete} index = {(card.index - 1)/2}></TableCard>
                    ))}
                    {
                        
                    }

                    { this.state.hoveredCourse ? 
                        <TableCard key={this.state.hoveredCourse.courseId + "" + this.state.hoveredCourse.groupId }  allCourses={this.props.courses} indexes={this.getIndexes(this.state.hoveredCourse)} course={this.state.hoveredCourse} handleDelete={this.handleDelete}  index={(this.state.hoveredCourse.index - 1)/2}></TableCard>
                    : null}
            

                </div>
            </div>
          );
    }

    handleDelete = (course) => {
        const courses = this.state.courses.filter(c => c !== course);
		this.setState(courses);
		this.props.handleUpdateCourses(courses);
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

export default Timetable;
