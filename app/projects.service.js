"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
require('rxjs/add/operator/toPromise');
var ProjectsService = (function () {
    function ProjectsService(http) {
        this.http = http;
        this.homeURL = 'http://local.blog.com/';
    }
    ProjectsService.prototype._commonHandler = function (observable) {
        // .map(response => response.json());
        var _this = this;
        return observable.toPromise()
            .then(function (response) {
            return response.json();
        }, function (response) {
            return _this.handleError(response);
        });
    };
    ProjectsService.prototype.handleError = function (response) {
        var parsed = false;
        try {
            parsed = response.json();
        }
        catch (e) { }
        if (parsed) {
            return Promise.resolve(parsed);
        }
        else {
            // Something went wrong. need to do something
            return Promise.reject(response);
        }
    };
    ProjectsService.prototype.getProjects = function () {
        var observable = this.http.get(this.homeURL + 'projects');
        return this._commonHandler(observable);
        /*
        return this.http.get(this.homeURL + 'projects')
                                        .map(response => <Project[]> response.json().data);
        */
    };
    ProjectsService.prototype.addProject = function (project) {
        /*
        var headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "*");
        */
        var data = {
            project: project
        };
        var observable = this.http.post(this.homeURL + 'projects', data);
        return this._commonHandler(observable);
    };
    ProjectsService.prototype.toggleProject = function (project, by_toggle_all) {
        var data = {
            is_bulk: by_toggle_all,
            project: project
        };
        var observable = this.http.patch(this.homeURL + 'projects/' + project.id, data);
        return this._commonHandler(observable);
    };
    ProjectsService.prototype.deleteProject = function (project_id) {
        var observable = this.http.delete(this.homeURL + 'projects/' + project_id);
        return this._commonHandler(observable);
    };
    ProjectsService.prototype.deleteTodoDone = function (project_id) {
        var data = {
            id: project_id,
            action: 1
        };
        var observable = this.http.post(this.homeURL + 'projects/bulk', data);
        return this._commonHandler(observable);
    };
    ProjectsService.prototype.addTodo = function (todo) {
        /*
        var headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "*");
        */
        var data = {
            todo: todo
        };
        var observable = this.http.post('http://local.blog.com/todos', data);
        return this._commonHandler(observable);
    };
    ProjectsService.prototype.updateTodo = function (todo) {
        var data = {
            todo: todo
        };
        var observable = this.http.patch('http://local.blog.com/todos/' + todo.id, data);
        return this._commonHandler(observable);
    };
    ProjectsService.prototype.deleteTodo = function (todo_id) {
        var observable = this.http.delete('http://local.blog.com/todos/' + todo_id);
        return this._commonHandler(observable);
    };
    ProjectsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ProjectsService);
    return ProjectsService;
}());
exports.ProjectsService = ProjectsService;
//# sourceMappingURL=projects.service.js.map