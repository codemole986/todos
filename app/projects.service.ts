import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Project } from './model/project';

@Injectable()

export class ProjectsService {
	homeURL: string;
	constructor(private http: Http) {
		this.homeURL =  'http://local.blog.com/';
	}

	private _commonHandler(observable) {

		// .map(response => response.json());

		return observable.toPromise()
						.then(response => {
							return response.json();
						}, response => {
							return this.handleError(response);
						});
	}

	private handleError(response): Promise<any> {
		let parsed = false;
		try {
			parsed = response.json();
		} catch(e){}
		
		if (parsed) {
			return Promise.resolve(parsed);
		} else {
			// Something went wrong. need to do something
			return Promise.reject(response);
		}
	  	
	}

	getProjects() {

		let observable = this.http.get(this.homeURL + 'projects');
		return this._commonHandler(observable);

		/*
		return this.http.get(this.homeURL + 'projects')
										.map(response => <Project[]> response.json().data);
		*/
	}

	addProject(project) {
		/*
		var headers = new Headers();
      	headers.append("Access-Control-Allow-Origin", "*");
      	*/
      	let data = {
      		project: project
      	}
      	
      	let observable = this.http.post(this.homeURL + 'projects', data);
      	return this._commonHandler(observable);
						
	}

	toggleProject(project, by_toggle_all) {
		let data = {
			is_bulk: by_toggle_all,
      		project: project
      	}
      	
      	let observable = this.http.patch(this.homeURL + 'projects/' + project.id, data);
      	return this._commonHandler(observable);
	}

	deleteProject(project_id) {
		let observable = this.http.delete(this.homeURL + 'projects/' + project_id);
		return this._commonHandler(observable);
	}

	deleteTodoDone(project_id) {
		let data = {
			id: project_id,
			action: 1
		}
		let observable = this.http.post(this.homeURL + 'projects/bulk', data);
		return this._commonHandler(observable);
	}


	addTodo(todo) {
		/*
		var headers = new Headers();
      	headers.append("Access-Control-Allow-Origin", "*");
      	*/
      	let data = {
      		todo: todo
      	}
      	
      	let observable = this.http.post('http://local.blog.com/todos', data);
      	return this._commonHandler(observable);
						
	}

	updateTodo(todo) {
		let data = {
      		todo: todo
      	}
      	
      	let observable = this.http.patch('http://local.blog.com/todos/' + todo.id, data);
      	return this._commonHandler(observable);
	}

	deleteTodo(todo_id) {
		let observable = this.http.delete('http://local.blog.com/todos/' + todo_id);
		return this._commonHandler(observable);
	}



	
}