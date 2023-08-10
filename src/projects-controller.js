import { pubsub } from "./pubsub";
import { Task } from "./task";
import { Project } from "./project";

export class ProjectsController {
    #projects = [];
    #currentProject = null;
    #generalTasks = new Project('Tasks');

    constructor() {
        pubsub.subscribe('taskFormSubmitted', this.taskAdded.bind(this));
        pubsub.subscribe('projectFormSubmitted', this.projectAdded.bind(this));
        pubsub.subscribe('changePage', this.#changeCurrentProject.bind(this));
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

    projectAdded(project) {
        console.log(`PROJECT-CONTROLLER: I hear that ${project.name} was added`);
        if(this.#isDuplicateProject(project)) {
            pubsub.publish("showToast", {
                icon: 'fa-solid fa-xmark',
                message: 'This project already exists'
            });
            return
        }
        this.#projects.push(project);
        pubsub.publish('projectAdded', this.#projects);
    }

    getCurrentProjectTasks() {
        return this.#currentProject?.getTasks() ?? this.#generalTasks.getTasks();
    }

    #changeCurrentProject(projectName) {
        if(projectName === 'Tasks') {
            pubsub.publish('loadNewPage', this.#generalTasks);
        }
        const newCurrentProject = this.#projects.find(project => project.name === projectName);
        if(newCurrentProject === undefined) return;
        this.#currentProject = newCurrentProject;
        pubsub.publish('loadNewPage', newCurrentProject);
    }

    #isDuplicateProject(project) {
        const exists = this.#projects.findIndex(el => el.name === project.name);
        return exists !== -1; 
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
        pubsub.publish('projectAdded', this.#projects);
    }


}