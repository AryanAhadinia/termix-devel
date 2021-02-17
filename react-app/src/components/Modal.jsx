import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Col, Form, Row } from 'react-bootstrap';
import db from '../services/db';
import departmentService from '../services/departmentService';
import userService from '../services/userService';

class Modal extends Component {
	state = {
		open: false,
		user: {},
		departments: [],
	};

	constructor(props) {
		super(props);
		this.state.open = false;
		this.init();
		this.state.user = {
			firstName: 'Ali',
			lastName: 'Mamadi',
			stdId: '231321323',
			depId: '40',
			grade: true,
		};
		// this.state.user = this.props.user;
	}

	init = async () => {
		const isThereAnyDepartments = await db.departments.count();
		if (isThereAnyDepartments === 0) {
			const {
				data: departments,
			} = await departmentService.getAllDepartments();
			await departmentService.populateDepartmentsOnDb(departments);
		}
		const departments = await db.departments.toArray();
		this.state.departments = departments;
	};

	setOpen = (newValue) => {
		this.setState({ open: newValue });
	};

	handleClickOpen = () => {
		this.setOpen(true);
	};

	handleClose = () => {
		this.setOpen(false);
	};

	handleChange = ({ currentTarget: input }) => {
		const user = { ...this.state.user };
		user[input.id] = input.value;
		this.setState({ user });
	};

	handleSubmit = (e) => {
		e.preventDefault();

		const errors = this.validate();
		this.setState({ errors: errors || {} });
		if (errors) return;

		this.doSubmit();
	};

	doSubmit = async () => {
		const { user } = this.state;
		await userService.updateMyInfo(user);
	};

	render() {
		return (
			<div>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby='form-dialog-title'
				>
					<h1 id='form-dialog-title'>اطلاعات</h1>
					<DialogContent>
						<Form onSubmit={this.handleSubmit}>
							<div className='form-group'>
								<label htmlFor='exampleInputEmail1'>
									نام خانوداگی
								</label>
								<input
									onChange={this.handleChange}
									type='name'
									className='form-control info-field'
									id='lastName'
									placeholder={this.state.user.lastName}
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='exampleInputEmail1'>نام</label>
								<input
									onChange={this.handleChange}
									type='name'
									className='form-control info-field'
									id='firstName'
									placeholder={this.state.user.firstName}
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='exampleInputEmail1'>
									شماره دانشجویی
								</label>
								<input
									onChange={this.handleChange}
									type='name'
									className='form-control info-field'
									id='stdId'
									placeholder={this.state.user.stdId}
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='exampleInputEmail1'>
									رشته ‌تحصیلی
								</label>
								<select
									className='form-control'
									id='depId'
									onChange={this.handleChange}
								>
									{this.state.departments &&
										this.state.departments.length !== 0 &&
										this.state.departments.map((d) => (
											<option
												value={d.depId}
												selected={
													d.depId ===
													this.state.user.depId
												}
											>
												{d.department}
											</option>
										))}
								</select>
							</div>
							<div className='form-group'>
								<label htmlFor='exampleInputEmail1'>
									مقطع تحصیلی
								</label>
								<select
									onChange={this.handleChange}
									defaultValue={this.state.user.grade ? 0 : 1}
									className='form-control'
									id='grade'
								>
									<option value={0}>کارشناسی</option>
									<option value={1}></option>
								</select>
							</div>
						</Form>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color='primary'>
							بستن
						</Button>
						<Button onClick={this.handleSubmit} color='primary'>
							ثبت اطلاعات
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default Modal;
