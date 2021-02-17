import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MenuItem  extends Component {

    render() { 
        return (
            <div className='menu-item d-flex align-items-center' style={{ backgroundColor : this.handleSelect()}} onClick={this.props.onClick}>
                <FontAwesomeIcon icon={this.props.icon} style={{marginLeft: '12px'}}/> 
                <div htmlFor={this.props.item} className="menu-items-text">  {this.props.item} </div>
            
            </div>
          );
    }

    handleSelect = () => {
        return this.props.selected ? ' rgba(255, 255, 255, 0.4)' : ' rgba(255, 255, 255, 0.05)' 
    }

}


 
export default MenuItem;