import { pubsub } from "./pubsub";
import { endOfDay, isAfter, isBefore, startOfDay, parse, isEqual, addWeeks } from "date-fns";

export class Project {
    #tasks = [];

    constructor(name) {
        this.name = name;
    }

    addTask(task, defaultProjectName = null) {
        this.#tasks.push(task);
        defaultProjectName
            ? this.#pubToDefaultProject(defaultProjectName)
            : pubsub.publish('taskAdded', this.#tasks);
        
        pubsub.publish('projectTaskUpdated', {
            "project": this,
            "task": task
        });
    }

    updateTask({taskId, taskUpdated}, defaultProjectName = null) {
        const task = this.getTaskById(taskId);
        task.title = taskUpdated.title;
        task.description = taskUpdated.description;
        task.date = taskUpdated.date;
        task.priority = taskUpdated.priority;
        defaultProjectName
            ? this.#pubToDefaultProject(defaultProjectName)
            : pubsub.publish('taskAdded', this.#tasks);
        
        pubsub.publish('projectTaskUpdated', {
            "project": this,
            "task": task
        });
        pubsub.publish('showToast', {
            'icon': 'fa-solid fa-check',
            'message': 'Task updated'
        })
    }


    deleteTask(taskId, defaultProjectName = null) {
        this.#tasks = this.#tasks.filter(task => task.id !== taskId);
        pubsub.publish('taskDeleted', {
            project: this,
            taskId: taskId
        });
        if(defaultProjectName) {
            this.#pubToDefaultProject(defaultProjectName);
        } else {
            pubsub.publish('taskAdded', this.#tasks);
        }
    }

    #pubToDefaultProject(name) {
        const defaultProjectsTasks = {
            'Tasks': this.#tasks,
            'Today': this.getTodayTasks(),
            'Week': this.getWeekTasks(),
        }
        pubsub.publish('taskAdded', defaultProjectsTasks[name]);
        // name === "Tasks" && pubsub.publish('taskAdded', this.#tasks);
        // name === "Today" && pubsub.publish('taskAdded', this.getTodayTasks());
        // name === "Week" && pubsub.publish('taskAdded', this.getWeekTasks());
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
        return (isAfter(date, startDate) && isBefore(date, endDate)) || (isEqual(date, startDate) || isEqual(date, endDate));
    }

    static isDefaultProject(project) {
        return project.name === 'Tasks' || project.name === 'Today' || project.name === 'This Week';
    }
}