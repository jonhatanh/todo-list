import { pubsub } from "./pubsub";
import { Task } from "./task";
import { Project } from "./project";

export class ProjectsController {
    #projects = [];
    #currentProject = null;
    #generalTasks = new Project('Tasks');

    constructor() {
        pubsub.subscribe('taskFormSubmitted', this.taskAdded.bind(this));
        if (localStorage.getItem('projects') !== null) {
            this.#loadProjects();
        }
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

    #loadProjects() {
        const projects = JSON.parse(localStorage.getItem('projects'));
        for (const project in projects) {
            const projectTasks = projects[project];
            if (project === 'Tasks') {
                projectTasks.forEach(task =>
                        this.#generalTasks.addTask(new Task(
                            task.title,
                            task.description,
                            task.date,
                            task.priority,
                            task.done,
                            task.id
                        ))
                );
                continue;
            }

            const newProject = new Project(project);
            projectTasks.forEach(task =>
                newProject.addTask(new Task(
                    task.title,
                    task.description,
                    task.date,
                    task.priority,
                    task.done,
                    task.id
                ))
            );
            this.#projects.push(newProject);
        }
    }


}