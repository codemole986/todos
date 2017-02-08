import { Todo } from './todo';

export class Project {
	id: number;
	name: string;
	description: string;
	is_done: boolean;
	todos: Todo[];
}