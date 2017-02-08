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
var project_1 = require('../model/project');
var todo_1 = require('../model/todo');
var projects_service_1 = require('../projects.service');
var ProjectComponent = (function () {
    function ProjectComponent(projectsService) {
        this.projectsService = projectsService;
    }
    ProjectComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this.cars = this.racingDataService.getCars();
        this.projectsService.getProjects().then(function (data) {
            if (data.error) {
                // show error
                alert(data.error_info.note);
            }
            else {
                _this.projects = data.projects;
            }
        });
        this.editing_todo = null;
        this.busy_projects = [];
    };
    ProjectComponent.prototype.isProjectLoading = function (project_id) {
        return (this.busy_projects.indexOf(project_id) > -1);
    };
    ProjectComponent.prototype.makeProjectLoading = function (project, is_loading) {
        var project_id = project.id;
        if (is_loading && !this.isProjectLoading(project_id)) {
            this.busy_projects.push(project_id);
        }
        else {
            var pos = this.busy_projects.indexOf(project_id);
            if (pos > -1) {
                this.busy_projects.splice(pos, 1);
            }
        }
    };
    ProjectComponent.prototype.makeProjectLoadingbyID = function (project_id, is_loading) {
        var ind = this.getProjectIndex(project_id);
        return this.makeProjectLoading(this.projects[ind], is_loading);
    };
    ProjectComponent.prototype.addProject = function (event) {
        var _this = this;
        if (event.target.value.trim() == '')
            return;
        var send_data = {
            'name': event.target.value.trim(),
            'description': '',
            'is_done': false
        };
        this.projectsService.addProject(send_data).then(function (data) {
            if (data.error) {
                // show error
                alert(data.error_info.note);
            }
            else {
                var project = new project_1.Project();
                project['id'] = data.project.id;
                project['name'] = data.project.name;
                project['description'] = '';
                project['is_done'] = false;
                project['todos'] = [];
                _this.projects.push(project);
                event.target.value = '';
            }
        });
    };
    ProjectComponent.prototype.deleteProject = function (ind) {
        var _this = this;
        this.makeProjectLoading(this.projects[ind], true);
        this.projectsService.deleteProject(this.projects[ind].id).then(function (data) {
            _this.makeProjectLoading(_this.projects[ind], false);
            if (data.error) {
                // show error
                alert(data.error_info.note);
                if (data.error_info.code == 4) {
                    _this.spliceProject(data.error_info.id);
                }
            }
            else {
                _this.spliceProject(data.project.id);
            }
        });
    };
    ProjectComponent.prototype.spliceProject = function (id) {
        var ind = this.getProjectIndex(id);
        if (ind > -1) {
            this.projects.splice(ind, 1);
        }
    };
    ProjectComponent.prototype.getProjectIndex = function (id) {
        for (var i = 0; i < this.projects.length; i++) {
            if (this.projects[i].id == id) {
                return i;
            }
        }
        return -1;
    };
    ProjectComponent.prototype.getTotalProjectCount = function () {
        if (!Array.isArray(this.projects))
            return 0;
        return this.projects.length;
    };
    ProjectComponent.prototype.getUndoneProjectsCount = function () {
        var undone = 0;
        if (!Array.isArray(this.projects))
            return 0;
        for (var _i = 0, _a = this.projects; _i < _a.length; _i++) {
            var prj = _a[_i];
            if (prj.is_done == false)
                undone++;
        }
        return undone;
    };
    ProjectComponent.prototype.getTodoStat = function () {
        var undone = 0;
        var total = 0;
        if (!Array.isArray(this.projects))
            return [0, 0];
        for (var _i = 0, _a = this.projects; _i < _a.length; _i++) {
            var prj = _a[_i];
            for (var _b = 0, _c = prj.todos; _b < _c.length; _b++) {
                var todo = _c[_b];
                if (todo.is_done == false)
                    undone++;
            }
            total += prj.todos.length;
        }
        return [total, undone];
    };
    ProjectComponent.prototype.getUndoneTodosCount = function () {
        var undone = 0;
        if (!Array.isArray(this.projects))
            return 0;
        for (var _i = 0, _a = this.projects; _i < _a.length; _i++) {
            var prj = _a[_i];
            for (var _b = 0, _c = prj.todos; _b < _c.length; _b++) {
                var todo = _c[_b];
                if (todo.is_done == false)
                    undone++;
            }
        }
        return undone;
    };
    ProjectComponent.prototype.getTotalTodosCount = function () {
        var total = 0;
        if (!Array.isArray(this.projects))
            return 0;
        for (var _i = 0, _a = this.projects; _i < _a.length; _i++) {
            var prj = _a[_i];
            total += prj.todos.length;
        }
        return total;
    };
    ProjectComponent.prototype.toggleAllTodo = function (project, event) {
        var _this = this;
        this.makeProjectLoading(project, true);
        var is_done = event.target.checked;
        var project_toggle = {
            id: project.id,
            is_done: is_done
        };
        this.projectsService.toggleProject(project_toggle, 1).then(function (data) {
            _this.makeProjectLoading(project, false);
            if (data.error) {
                // show error
                alert(data.error_info.note);
            }
            else {
                for (var _i = 0, _a = project.todos; _i < _a.length; _i++) {
                    var todo = _a[_i];
                    todo.is_done = is_done;
                }
                project.is_done = is_done;
            }
        });
    };
    ProjectComponent.prototype.addTodo = function (project, event) {
        var _this = this;
        this.makeProjectLoading(project, true);
        var label = event.target.value.trim();
        if (label == '')
            return;
        var todo = new todo_1.Todo();
        todo.label = label;
        todo.is_done = false;
        todo.project_id = project.id;
        this.projectsService.addTodo(todo).then(function (data) {
            _this.makeProjectLoading(project, false);
            if (data.error) {
                // show error
                alert(data.error_info.note);
            }
            else {
                var ind = _this.getProjectIndex(data.todo.project_id);
                if (ind > -1) {
                    var project_2 = _this.projects[ind];
                    var todo_2 = data.todo;
                    project_2.todos.push(todo_2);
                    _this.updateProject(project_2);
                    event.target.value = '';
                }
            }
        });
    };
    ProjectComponent.prototype.editTodo = function ($event, todo) {
        this.editing_todo = todo;
    };
    ProjectComponent.prototype.editTodoDone = function ($event, todo) {
        var _this = this;
        if ($event) {
            todo.label = $event.target.value;
            this.makeProjectLoadingbyID(todo.project_id, true);
            var todo_send = {
                id: todo.id,
                label: todo.label
            };
            this.projectsService.updateTodo(todo_send).then(function (data) {
                _this.makeProjectLoadingbyID(todo.project_id, false);
                if (data.error) {
                    // show error
                    alert(data.error_info.note);
                }
                else {
                    _this.editing_todo = null;
                }
            });
        }
        else {
            this.editing_todo = null;
        }
    };
    ProjectComponent.prototype.deleteTodo = function (project, index) {
        var _this = this;
        this.makeProjectLoading(project, true);
        this.projectsService.deleteTodo(project.todos[index].id).then(function (data) {
            _this.makeProjectLoading(project, true);
            if (data.error) {
                // show error
                alert(data.error_info.note);
                if (data.error_info.code == 4) {
                    project.todos.splice(index, 1);
                    _this.updateProject(project);
                }
            }
            else {
                project.todos.splice(index, 1);
                _this.updateProject(project);
            }
        });
    };
    ProjectComponent.prototype.toggleTodo = function (project, index) {
        var _this = this;
        this.makeProjectLoading(project, true);
        var todo = {
            id: project.todos[index].id,
            is_done: !project.todos[index].is_done
        };
        this.projectsService.updateTodo(todo).then(function (data) {
            _this.makeProjectLoading(project, false);
            if (data.error) {
                // show error
                alert(data.error_info.note);
            }
            else {
                project.todos[index].is_done = data.todo.is_done;
                _this.updateProject(project);
            }
        });
    };
    ProjectComponent.prototype.deleteDone = function (project, event) {
        var _this = this;
        this.makeProjectLoading(project, true);
        this.projectsService.deleteTodoDone(project.id).then(function (data) {
            _this.makeProjectLoading(project, false);
            if (data.error) {
                // show error
                alert(data.error_info.note);
            }
            else {
                var undone = [];
                for (var _i = 0, _a = project.todos; _i < _a.length; _i++) {
                    var todo = _a[_i];
                    if (todo.is_done == false) {
                        undone.push(todo);
                    }
                }
                project.todos = undone;
                project.is_done = false;
            }
        });
        ;
        event.preventDefault();
    };
    ProjectComponent.prototype.updateProject = function (project) {
        var _this = this;
        var is_done = true;
        if (project.todos.length > 0) {
            for (var _i = 0, _a = project.todos; _i < _a.length; _i++) {
                var todo = _a[_i];
                if (todo.is_done == false) {
                    is_done = false;
                    break;
                }
            }
        }
        else {
            is_done = false;
        }
        if (project.is_done != is_done) {
            this.makeProjectLoading(project, true);
            // Update server
            var project_toggle = {
                id: project.id,
                is_done: is_done,
            };
            this.projectsService.toggleProject(project_toggle, 0).then(function (data) {
                _this.makeProjectLoading(project, false);
                if (data.error) {
                    // show error
                    alert(data.error_info.note);
                }
                else {
                }
            });
        }
        project.is_done = is_done;
    };
    ProjectComponent.prototype.getTodoCount = function (project) {
        var todo_count = 0;
        for (var _i = 0, _a = project.todos; _i < _a.length; _i++) {
            var todo = _a[_i];
            if (todo.is_done == false) {
                todo_count++;
            }
        }
        return todo_count;
    };
    ProjectComponent.prototype.isAllDone = function (project) {
        return (this.getTodoCount(project) == 0);
    };
    ProjectComponent = __decorate([
        core_1.Component({
            selector: 'project-list',
            templateUrl: 'app/component/project.component.html',
            styleUrls: ['app/component/project.component.css']
        }), 
        __metadata('design:paramtypes', [projects_service_1.ProjectsService])
    ], ProjectComponent);
    return ProjectComponent;
}());
exports.ProjectComponent = ProjectComponent;
//# sourceMappingURL=project.component.js.map