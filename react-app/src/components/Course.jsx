import React, { Component } from 'react';

class Course extends Component {
    state = { 
        course : undefined
     }

     constructor(props) {
         super()
         this.state.course = props.course;
     }

     componentDidUpdate(prevProps) {
        if (prevProps.course !== this.props.course)
            this.setState({course : this.props.course})
    }

     
    render() { 
        return ( 
            <div 
                onClick={() => this.props.onSelect(this.state.course)}
                onMouseOver={() => this.props.handleUpdateHover(this.state.course)}
                onMouseOut={() => this.props.handleUpdateHover(null)}
                className="course">
                    {this.props.course.title}
            </div>
         );
    }

}
 
export default Course;