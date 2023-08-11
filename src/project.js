import { pubsub } from "./pubsub";
import { endOfDay, isAfter, isBefore, startOfDay, parse, isEqual, addWeeks } from "date-fns";

export class Project {
    #tasks = [];

    constructor(name) {
        this.name = name;
    }

    addTask(task, defaultProjectName = null) {
        this.#tasks.push(task);
        console.log(`TASK: ${task.title} added to ${this.name}`);
        if(defaultProjectName) {
            this.#pubToDefaultProject(defaultProjectName);
        } else {
            pubsub.publish('taskAdded', this.#tasks);
        }
        
        pubsub.publish('projectTaskUpdated', {
            "project": this,
            "task": task
        });
    }

    #pubToDefaultProject(name) {
        name === "Tasks" && pubsub.publish('taskAdded', this.#tasks);
        name === "Today" && pubsub.publish('taskAdded', this.getTodayTasks());
        name === "Week" && pubsub.publish('taskAdded', this.getWeekTasks());

    }

    getTasks() {
        return this.#tasks;
    }

    getTaskById(id) {
        return this.#tasks.find(task => task.id === id);
    }

    getNumOfTasks() {
        return this.#tasks.length;
    }

    getTodayTasks() {
        return this.getTasksInRange(startOfDay(new Date()), endOfDay(new Date()));
    }
    getWeekTasks() {
        return this.getTasksInRange(startOfDay(new Date()), addWeeks(startOfDay(new Date()), 1));
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