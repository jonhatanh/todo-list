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
    }


}