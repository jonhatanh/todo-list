import { pubsub } from "./pubsub";
import { endOfDay, isAfter, isBefore, startOfDay, parse, isEqual } from "date-fns";

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

    getTodayTasks() {
        return this.getTasksInRange(startOfDay(new Date()), endOfDay(new Date()));
    }

    getTasksInRange(startDate, endDate) {
        return this.#tasks.filter(task => 
            this.#dateBetweenRange(parse(task.date, 'yyyy-MM-dd', new Date()), startDate, endDate));
    }

    #dateBetweenRange(date, startDate, endDate) {
        console.log({date, startDate, endDate});
        return (isAfter(date, startDate) && isBefore(date, endDate)) || (isEqual(date, startDate) || isEqual(date, endDate));
    }

}