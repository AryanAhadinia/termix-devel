import React, { Component } from 'react';
import logo from '../termix.png'
import smallLogo from '../termix-icon.svg'
import MenuItem from './MenuItem';
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";






class Sidebar extends Component {

    render() { 
        return (
            <div className="drop sidebar" style={{width : '200px'}}>
                <img src={logo} className="big-logo" alt="termix" ></img>
                <img src={smallLogo} className='small-logo' alt="termix" ></img>
                <MenuItem icon={faAddressCard} item='داشبورد' selected={this.props.currentState === 1} onClick={() => this.props.handleCurrentState(1)}></MenuItem>
                <MenuItem icon={faChartPie} item='برنامه ریزی' selected={this.props.currentState === 2} onClick={() => this.props.handleCurrentState(2)}></MenuItem>
                <MenuItem icon={faTable} item='جدول دروس' selected={this.props.currentState === 3} onClick={() => this.props.handleCurrentState(3)}></MenuItem>
                <MenuItem icon={faSignOutAlt} item='خروج' selected={this.props.currentState === 4} onClick={() => this.props.handleCurrentState(4)}></MenuItem>
            </div>
          );
    }

    
}
 
export default Sidebar;