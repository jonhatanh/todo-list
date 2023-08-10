import { pubsub } from "./pubsub";
import { Task } from "./task";
import { Project } from "./project";
import { tasksList } from "./ui-controllers";

export class LocalSaves {
    
    constructor() {
        if (localStorage.getItem('projects') === null) {
            localStorage.setItem('projects', JSON.stringify({}));
        }
        pubsub.subscribe('projectTaskUpdated', this.saveProjectTask.bind(this));
        pubsub.subscribe('projectAdded', this.saveProject.bind(this));
    }

    saveProjectTask({project, task}) {
        const projects = JSON.parse(localStorage.getItem('projects'));
        const newTask = {
            "title": task.title,
            "description": task.description,
            "date": task.date,
            "priority": task.priority,
            "done": task.done,
            "id": task.id,
        };
        console.log(project, task);


        if(projects[project.name] === undefined) {
            projects[project.name] = [newTask];
        } else {
            const projectTasks = projects[project.name];
            console.log(this);
            const taskIndex = this.#getTaskIndex(projectTasks, task.id);
            taskIndex === -1 
                ? projectTasks.push(newTask)
                : projectTasks[taskIndex] = newTask;

            projects[project.name] = projectTasks;
        }
        console.log(`LOCAL-STORAGE: I'll save all changes`);
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    saveProject(projects) {
        const projectsLocal = JSON.parse(localStorage.getItem('projects'));
        projects.forEach(project => {
            if (projectsLocal[project.name] !== undefined) return;
            projectsLocal[project.name] = [];
        })
        
        console.log(`LOCAL-STORAGE: I'll save the new project`);
        localStorage.setItem('projects', JSON.stringify(projectsLocal));
    }

    #getTaskIndex(tasks, id) {
        return tasks.findIndex(task => task.id === id);
    }

    
}