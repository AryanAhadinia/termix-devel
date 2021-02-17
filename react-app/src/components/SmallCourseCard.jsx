import React, { Component } from 'react';
import '../time-table.css'


class SmallCourseCard extends Component {
    state = { 
        course : {
            column: '6',
            row: '14',
            duration: '6',
            color: 'rgba(232, 73, 48, 0.3)',
            courseNumber: '406221',
            courseName: 'ساختمان داده',
            courseMaster: 'مسعود صدیقین',
            courseUnits: '3',
        },
        rows:[],
        columns:[],
        durations:[],
        times: [],
        time: 0,
     }

     constructor(props) {
         super()
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
         this.state.course = props.course;
     }


    render() { 
        return ( 
            <span>
            <div className="small-card-container">
                <div className="small-card-content d-flex flex-column justify-content-center align-items-start h-100">
                         <h1 className="class-time"> {this.state.course.classTimeArray[0].startHour}:{this.state.course.classTimeArray[0].startMin} 
                                                    - {this.state.course.classTimeArray[0].endHour}:{this.state.course.classTimeArray[0].endMin} </h1>
                        <h1 className="class-name"> {this.state.course.title} </h1>
                        < h1 className="class-master">{this.state.course.instructor}</h1>
                        <h1 className="class-exam"> امتحان : {this.state.course.examTime}</h1>
                </div>
            </div>
            </span>
          );
    }
}
 
export default SmallCourseCard;