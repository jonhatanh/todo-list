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
        pubsub.subscribe('projectDeleted', this.deleteProject.bind(this));
        pubsub.subscribe('taskDeleted', this.removeTask.bind(this));
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


        if(projects[project.name] === undefined) {
            projects[project.name] = [newTask];
        } else {
            const projectTasks = projects[project.name];
            const taskIndex = this.#getTaskIndex(projectTasks, task.id);
            taskIndex === -1 
                ? projectTasks.push(newTask)
                : projectTasks[taskIndex] = newTask;

            projects[project.name] = projectTasks;
        }
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    saveProject(projects) {
        const projectsLocal = JSON.parse(localStorage.getItem('projects'));
        projects.forEach(project => {
            if (projectsLocal[project.name] !== undefined) return;
            projectsLocal[project.name] = [];
        })
        
        localStorage.setItem('projects', JSON.stringify(projectsLocal));
    }

    deleteProject(projectName) {
        const projectsLocal = JSON.parse(localStorage.getItem('projects'));
        delete projectsLocal[projectName];
        
        localStorage.setItem('projects', JSON.stringify(projectsLocal));
    }

    removeTask({project, taskId}) {
        const projectsLocal = JSON.parse(localStorage.getItem('projects'));
        const taskIndex = projectsLocal[project.name].findIndex(task => task.id === taskId);
        taskIndex != -1 && projectsLocal[project.name].splice(taskIndex, 1);
        localStorage.setItem('projects', JSON.stringify(projectsLocal));
    }

    #getTaskIndex(tasks, id) {
        return tasks.findIndex(task => {
            return task.id === id
        });
    }

    
}