import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMinusCircle} from  '@fortawesome/free-solid-svg-icons'
import { Textfit } from 'react-textfit';

class TableCard extends Component {
    state = { 
        course : undefined,
        rows:[],
        columns:[],
        durations:[],
        times: [],
        time: 0,
        indexes: [],
     }

     constructor(props) {
         super()
        const courses = props.allCourses.filter(c => c !== props.course);
        


         for (let index = 0; index < props.course.classTimeArray.length; index++) {
             const element = props.course.classTimeArray[index];
             for (let i = 0; i < element.days.length; i++) {
                 const element2 = element.days[i];
                 this.state.times = [...this.state.times, this.state.time];
                 this.state.columns = [...this.state.columns, (element2+2)];
                 this.state.rows = [...this.state.rows, ((element.startHour - 7)*2) + 2 + (element.startMin / 30)];
                 this.state.durations = [...this.state.durations, ((element.endHour - element.startHour)*2) + ((element.endMin - element.startMin)/30)]; 
                 this.state.time++;
             }
         }
         this.state.indexes = props.indexes;
         this.state.course = props.course;
     }

     componentDidUpdate(prevProps) {
        if (prevProps.indexes !== this.props.indexes)
           this.setState({indexes : this.props.indexes})
    }

    render() { 
        return (
        <React.Fragment>
            {this.state.times.map(time => (
                <div className="course-card d-flex flex-column align-items-center justify-content-around" style={{gridRow: this.state.rows[time] + "/ span " + this.state.durations[time] , gridColumn: this.state.columns[time], backgroundColor: 'rgba(232, 73, 48, 0.3)', zIndex: this.state.indexes[time], marginLeft: this.state.indexes[time]/2 + "vw", marginRight: -(this.state.indexes[time]/2) + "vw", marginTop: this.state.indexes[time]/2   + "vw", marginBottom: -(this.state.indexes[time]/2) + "vw"}}>
                    <div className='delete-icon-timetable' >
                        <FontAwesomeIcon onClick={() => this.props.handleDelete(this.props.course)} icon={faMinusCircle} className='p-1 mx'/> 
                    </div>
                    <h2 className="class-attributes">{this.state.course.courseId + "-" + this.state.course.groupId }</h2>
                    <Textfit  mode="single" forceSingleModeWidth={false}>
                    <h2 className="class-attributes">{this.state.course.title}</h2>
                    </Textfit>
                    <h3 className="class-attributes">{this.state.course.instructor}</h3>

                </div>
                        /*<TableCard key={card.courseNumber} course={card} handleDelete={this.handleDelete} index = {(card.index - 1)/2}></TableCard>*/
                    ))}






        { /*   <div className="course-card d-flex flex-column align-items-center justify-content-around" style={{gridRow: this.props.row + "/ span " + this.props.duration , gridColumn: this.props.column, backgroundColor: this.props.color, zIndex: this.props.index, marginLeft: this.props.index + "vw", marginRight: -(this.props.index) + "vw", marginTop: this.props.index + "vw", marginBottom: -(this.props.index) + "vw"}}>
                <div className='delete-icon-timetable' >
                    <FontAwesomeIcon onClick={() => this.props.handleDelete(this.props.course)} icon={faMinusCircle} className='p-1 mx'/> 
                </div>
                <h2 className="class-attributes">{this.props.courseNumber}</h2>
                <h2 className="class-attributes">{this.props.courseName}</h2>
                <h3 className="class-attributes">{this.props.courseMaster}</h3>
            </div>*/}
        </React.Fragment>
          );
    }
}
 
export default TableCard;