import React, { Component } from 'react';
import '../week.css';
import '../index.css'

class Week extends Component {
    state = {  }
    render() { 
        return (
<div class="cd-schedule loading">
	<div class="timeline">
		<ul>
			<li><span>09:00</span></li>
			<li><span>09:30</span></li>
			<li><span>10:00</span></li>
			<li><span>10:30</span></li>
			<li><span>11:00</span></li>
			<li><span>11:30</span></li>
			<li><span>12:00</span></li>
			<li><span>12:30</span></li>
			<li><span>13:00</span></li>
			<li><span>13:30</span></li>
			<li><span>14:00</span></li>
			<li><span>14:30</span></li>
			<li><span>15:00</span></li>
			<li><span>15:30</span></li>
			<li><span>16:00</span></li>
			<li><span>16:30</span></li>
			<li><span>17:00</span></li>
			<li><span>17:30</span></li>
			<li><span>18:00</span></li>
		</ul>
	</div> 

	<div class="events">
		<ul class="wrap">
			<li class="events-group">
				<div class="top-info"><span>پنجشنبه</span></div>
				<ul>
					
				</ul>
			</li>

			<li class="events-group">
				<div class="top-info"><span>چهارشنبه</span></div>

				<ul>
					
				</ul>
			</li>

			<li class="events-group">
				<div class="top-info"><span>سه شنبه</span></div>

				<ul>
					
				</ul>
			</li>

			<li class="events-group">
				<div class="top-info"><span>دو شنبه</span></div>

				<ul>
					
				</ul>
			</li>

			<li class="events-group">
				<div class="top-info"><span>یک شنبه</span></div>

				<ul>
					
				</ul>
			</li>
      <li class="events-group">
				<div class="top-info"><span>شنبه</span></div>
				<ul>
					
				</ul>
			</li>
     
		</ul>
	</div>

	<div class="event-modal">
		<header class="header">
			<div class="content">
				<span class="event-date"></span>
				<h3 class="event-name"></h3>
			</div>

			<div class="header-bg"></div>
		</header>

		<div class="body">
			<div class="event-info"></div>
			<div class="body-bg"></div>
		</div>

		<a href="#0" class="close">Close</a>
	</div>

	<div class="cover-layer"></div>
</div> 

         );
    }
}
 
export default Week;