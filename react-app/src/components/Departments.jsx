import React, { Component } from 'react';
import CourseContainer from './CourseContainer';
import  db  from '../services/db';


class Deparment extends Component {
    state = { departments: undefined,
    selected : 0}

    constructor(){
       super()
       this.readDepartments()
    }

    readDepartments = async () => {
        const departments = await db.departments.toArray() ; 
        console.log(departments)
        this.state.departments = departments
        this.setState({departments})
    }

    handleChange = ()=> {
        const e = document.getElementById('department-select');
        this.setState({selected : +e.value})
    }

    
    render() { 
        return (
            <div className='department-div d-flex flex-column justify-content-start align-items-center'>
                <select className="custom-select custom-select-lg mb-3" id='department-select' onChange={this.handleChange}>
                    <option selected>دانشکده</option>
                    {
                        this.state.departments && this.state.departments.map(dep => <option key={dep.depId} value={dep.depId}> {dep.department} </option>)
                    }
                </select>
                <CourseContainer depId={this.state.selected} handleUpdateHover={this.props.handleUpdateHover} onSelect={this.props.onSelect}>
                </CourseContainer>
            </div>
            );
    }
}
 
export default Deparment;

