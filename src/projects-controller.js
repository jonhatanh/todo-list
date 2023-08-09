import { pubsub } from "./pubsub";
import { Task } from "./task";
import { Project } from "./project";

export class ProjectsController {
    #projects = [];
    #currentProject = null;
    #generalTasks = new Project('Tasks');

    constructor() {
        console.log(this);
        pubsub.subscribe('taskFormSubmitted', this.taskAdded.bind(this));
    }

    taskAdded(task) {
        console.log(`PROJECT-CONTROLLER: I hear that ${task.title} was added`);
        this.#currentProject === null ? this.#generalTasks.addTask(task) : this.#currentProject.addTask(task);
        // let list = new Set(this.#projects);
        // list.add(task);
        // this.#projects = Array.from(list);
    }

    getCurrentProjectTasks() {
        return this.#currentProject?.getTasks() ?? this.#generalTasks.getTasks();
    }

    
}