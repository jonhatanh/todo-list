import { pubsub } from "./pubsub";


export class Project {
    #tasks = [];

    constructor(name) {
        this.name = name;
    }

    addTask(task) {
        this.#tasks.push(task);
        console.log(`TASK: ${task.title} added to ${this.name}`);
        pubsub.publish('taskAdded', this.#tasks);
        pubsub.publish('projectTaskUpdated', {
            "project": this,
            "task": task
        });
    }

    getTasks() {
        return this.#tasks;
    }

    getNumOfTasks() {
        return this.#tasks.length;
    }

}