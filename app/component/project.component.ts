import { Component } from '@angular/core';
import { Project } from '../model/project';
import { Todo } from '../model/todo';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'project-list',
  templateUrl: 'app/component/project.component.html',
  styleUrls: ['app/component/project.component.css']
})

export class ProjectComponent { 
	projects: Project[];
	editing_todo: Todo;
	busy_projects: number[];

	constructor(private projectsService: ProjectsService) {}
	ngOnInit() {
		// this.cars = this.racingDataService.getCars();
		this.projectsService.getProjects().then(
			data => {
				if (data.error) {
					// show error
					alert(data.error_info.note);
				} else {
					this.projects = <Project[]> data.projects
				}
			});
		this.editing_todo = null;
		this.busy_projects = [];
	}

	isProjectLoading(project_id) {
		return (this.busy_projects.indexOf(project_id) > -1);
	}

	makeProjectLoading(project, is_loading) {
		
		let project_id = project.id;

		if (is_loading && !this.isProjectLoading(project_id)) {
			this.busy_projects.push(project_id);
		} else {
			let pos = this.busy_projects.indexOf(project_id);
			if (pos > -1) {
				this.busy_projects.splice(pos, 1);
			}
		}
	}

	makeProjectLoadingbyID(project_id, is_loading) {
		let ind = this.getProjectIndex(project_id);
		return this.makeProjectLoading(this.projects[ind], is_loading);
	}

	addProject(event) {

		if (event.target.value.trim() == '') return;

		var send_data = {
			'name' : event.target.value.trim(),
			'description' : '',
			'is_done' : false
		};

		this.projectsService.addProject(send_data).then(
			data => {
				if (data.error) {
					// show error
					alert(data.error_info.note);
				} else {
					var project = new Project();
					project['id'] = data.project.id;
					project['name'] = data.project.name;
					project['description'] = '';
					project['is_done'] = false;
					project['todos'] = [];

					this.projects.push(project);
					event.target.value = '';
				}
			}
		);
		
	}

	deleteProject(ind) {
		
		this.makeProjectLoading(this.projects[ind], true);

		this.projectsService.deleteProject(this.projects[ind].id).then(
			data => {

				this.makeProjectLoading(this.projects[ind], false);

				if (data.error) {
					// show error
					alert(data.error_info.note);
					if (data.error_info.code == 4) {
						this.spliceProject(data.error_info.id);
					}
				} else {
					this.spliceProject(data.project.id);
					
				}
			}
		);
	}

	private spliceProject(id) {
		let ind = this.getProjectIndex(id);
		if (ind > -1) {
			this.projects.splice(ind, 1);	
		}
	}

	private getProjectIndex(id) {
		for (let i=0; i<this.projects.length; i++) {
			if (this.projects[i].id == id)	{
				return i;
			}
		}
		return -1;
	}

	getTotalProjectCount () {
		if (!Array.isArray(this.projects)) return 0;
		return this.projects.length;
	}

	getUndoneProjectsCount() {
		let undone = 0;
		if (!Array.isArray(this.projects)) return 0;

		for (let prj of this.projects) {
			if (prj.is_done == false) undone ++;
		}
		return undone;
	}

	getTodoStat() {
		let undone = 0;
		let total = 0;
		if (!Array.isArray(this.projects)) return [0, 0];

		for (let prj of this.projects) {
			for (let todo of prj.todos) {
				if (todo.is_done == false) undone ++;
			}
			total += prj.todos.length;
		}
		return [total, undone];
	}

	getUndoneTodosCount() {
		let undone = 0;
		if (!Array.isArray(this.projects)) return 0;

		for (let prj of this.projects) {
			for (let todo of prj.todos) {
				if (todo.is_done == false) undone ++;
			}
		}
		return undone;
	}

	getTotalTodosCount() {
		let total = 0;
		if (!Array.isArray(this.projects)) return 0;

		for (let prj of this.projects) {
			total += prj.todos.length;
		}
		return total;
	}

	toggleAllTodo(project, event) {

		this.makeProjectLoading(project, true);

		let is_done = event.target.checked;

		let project_toggle = {
				id: project.id,
				is_done: is_done
			};
		this.projectsService.toggleProject(project_toggle, 1).then(
			data => {

				this.makeProjectLoading(project, false);

				if (data.error) {
					// show error
					alert(data.error_info.note);
				} else {
					
					for(let todo of project.todos) {
						todo.is_done = is_done;
					}
					project.is_done = is_done;
				}
			}
		);

	}

	addTodo(project, event) {

		this.makeProjectLoading(project, true);

		let label = event.target.value.trim();
		if (label == '') return;

		var todo = new Todo();
		todo.label = label;
		todo.is_done = false;
		todo.project_id = project.id;

		this.projectsService.addTodo(todo).then(
			data => {

				this.makeProjectLoading(project, false);

				if (data.error) {
					// show error
					alert(data.error_info.note);
				} else {
					
					let ind = this.getProjectIndex(data.todo.project_id);
					if (ind > -1) {
						let project = this.projects[ind];
						let todo = <Todo> data.todo;

						project.todos.push(todo);
						this.updateProject(project);
						event.target.value = '';

					}
				}
			}
		);
	}

	editTodo($event, todo) {
		this.editing_todo = todo;
	}

	editTodoDone($event, todo) {
		if ($event) {
			todo.label = $event.target.value;

			this.makeProjectLoadingbyID(todo.project_id, true);

			let todo_send = {
				id: todo.id,
				label: todo.label
			};
			this.projectsService.updateTodo(todo_send).then(
				data => {

					this.makeProjectLoadingbyID(todo.project_id, false);

					if (data.error) {
						// show error
						alert(data.error_info.note);
					} else {
						this.editing_todo = null;
					}
				}
			);
		} else {
			this.editing_todo = null;
		}
	}

	deleteTodo(project, index) {

		this.makeProjectLoading(project, true);

		this.projectsService.deleteTodo(project.todos[index].id).then(
			data => {

				this.makeProjectLoading(project, true);

				if (data.error) {
					// show error
					alert(data.error_info.note);
					if (data.error_info.code == 4) {
						project.todos.splice(index, 1);
						this.updateProject(project);
					}
				} else {
					project.todos.splice(index, 1);
					this.updateProject(project);
				}
			}
		);

		
	}

	toggleTodo(project, index) {

		this.makeProjectLoading(project, true);

		let todo = {
				id: project.todos[index].id,
				is_done: !project.todos[index].is_done
			};
		this.projectsService.updateTodo(todo).then(
			data => {
				
				this.makeProjectLoading(project, false);

				if (data.error) {
					// show error
					alert(data.error_info.note);
				} else {
					
					project.todos[index].is_done = data.todo.is_done;
					this.updateProject(project);
				}
			}
		);
	}

	deleteDone(project, event) {

		this.makeProjectLoading(project, true);

		this.projectsService.deleteTodoDone(project.id).then(
			data => {

				this.makeProjectLoading(project, false);

				if (data.error) {
					// show error
					alert(data.error_info.note);
				} else {
					
					let undone = [];
					for (let todo of project.todos) {
						if (todo.is_done == false) {
							undone.push(todo);
						}
					}
					project.todos = undone;
					project.is_done = false

				}
			}
		);

		;
		event.preventDefault();
	}

	updateProject(project) {
		let is_done = true;
		if (project.todos.length > 0) {
			for (let todo of project.todos) {
				if (todo.is_done == false) {
					is_done =false;
					break;
				}
			}
		} else {
			is_done = false;
		}
		

		if (project.is_done != is_done) {

			this.makeProjectLoading(project, true);

			// Update server
			let project_toggle = {
				id: project.id,
				is_done: is_done,
			};
			this.projectsService.toggleProject(project_toggle, 0).then(
				data => {

					this.makeProjectLoading(project, false);

					if (data.error) {
						// show error
						alert(data.error_info.note);
					} else {
						// okay
					}
				}
			);

		}

		project.is_done = is_done;

	}

	getTodoCount(project) {
		let todo_count = 0;
		for (let todo of project.todos) {
			if (todo.is_done == false) {
				todo_count ++;
			}
		}
		return todo_count;
	}

	isAllDone(project) {
		return (this.getTodoCount(project) == 0);
	}
	

}
		