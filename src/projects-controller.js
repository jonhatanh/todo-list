import { pubsub } from "./pubsub";
import { Task } from "./task";
import { Project } from "./project";

export const projectsController = (function() {
    let projects = [];
    let currentProject = null;
    const generalTasks = new Project('Tasks');

    function init() {
        pubsub.subscribe('taskFormSubmitted', taskAdded);
        pubsub.subscribe('taskUpdateSubmitted', taskUpdated);
        pubsub.subscribe('projectFormSubmitted', projectAdded);
        pubsub.subscribe('changePage', changeCurrentProject);
        // pubsub.subscribe('loadEditModal', loadEditModal);
        // pubsub.subscribe('loadDeleteModal', loadDeleteModal);
        pubsub.subscribe('loadModal', loadModal);
        pubsub.subscribe('deleteTask', deleteTask);
        pubsub.subscribe('toggleTaskDone', toggleTaskDone);
        pubsub.subscribe('deleteCurrentProject', deleteCurrentProject);
        if (localStorage.getItem('projects') !== null && localStorage.getItem('projects') != '{}') {
            loadProjects();
        } else {
            currentProject = 'Tasks';
        }
    }

    function taskAdded(task) {
        typeof currentProject === 'string'
         ? generalTasks.addTask(task, currentProject)
         : currentProject.addTask(task);
        // currentProject === null ? generalTasks.addTask(task) : currentProject.addTask(task);
        // let list = new Set(this.#projects);
        // list.add(task);
        // this.#projects = Array.from(list);
    }

    function taskUpdated(taskObj) {
        
        typeof currentProject === 'string'
         ? generalTasks.updateTask(taskObj, currentProject)
         : currentProject.updateTask(taskObj);
        // currentProject === null ? generalTasks.addTask(task) : currentProject.addTask(task);
        // let list = new Set(this.#projects);
        // list.add(task);
        // this.#projects = Array.from(list);
    }

    function projectAdded(project) {
        if(isDuplicateProject(project)) {
            pubsub.publish("showToast", {
                icon: 'fa-solid fa-xmark',
                message: 'This project already exists'
            });
            return
        }
        projects.push(project);
        pubsub.publish('projectAdded', projects);
        pubsub.publish("showToast", {
            icon: "fa-solid fa-check",
            message: "Project Added"
        });
    }

    function deleteTask(taskId) {
        typeof currentProject === 'string'
         ? generalTasks.deleteTask(taskId, currentProject)
         : currentProject.deleteTask(taskId)
    }

    function toggleTaskDone(taskId) {
        const project = typeof currentProject === 'string'
            ? generalTasks
            : currentProject;
        const task = project.getTaskById(taskId);
        task.toggleDone();
        pubsub.publish('projectTaskUpdated', {
            "project": project,
            "task": task
        });
    }

    function getCurrentProjectTasks() {
        return typeof currentProject === 'string'
            ? generalTasks.getTasks()
            : currentProject.getTasks();
    }

    function changeCurrentProject(projectName) {
        
        const newCurrentProject = projects.find(project => project.name === projectName);
        if(newCurrentProject === undefined) {
            checkDefaultProjects(projectName);
            return;
        }
        currentProject = newCurrentProject;
        pubsub.publish('loadNewPage', newCurrentProject);
    }

    function checkDefaultProjects(projectName) {
        if(projectName === 'Tasks') {
            currentProject = 'Tasks';
            pubsub.publish('loadNewPage', generalTasks);
        }
        if(projectName === 'Today') {
            currentProject = 'Today';
            pubsub.publish('loadNewPage', {
                "name": "Today",
                "tasks": generalTasks.getTodayTasks()
            });
        }
        if(projectName === 'Week') {
            currentProject = 'Week';
            pubsub.publish('loadNewPage', {
                "name": "This Week",
                "tasks": generalTasks.getWeekTasks()
            });
        }

    }

    function deleteCurrentProject() {
        projects = projects.filter(project => project.name !== currentProject.name);
        pubsub.publish('projectDeleted',currentProject.name);
        currentProject = 'Tasks';
        checkDefaultProjects('Tasks');
        pubsub.publish('changeCurrentPageById','Tasks');
        pubsub.publish('projectAdded', projects);
        pubsub.publish('showToast', {
            'icon': 'fa-solid fa-check',
            'message': 'Project deleted'
        });
    }

    // function loadEditModal(taskId) {
    //     const task = typeof currentProject === 'string'
    //         ? generalTasks.getTaskById(taskId)
    //         : currentProject.getTaskById(taskId);
    //     pubsub.publish('openEditModal', task);
    // }
    // function loadDeleteModal(taskId) {
    //     const task = typeof currentProject === 'string'
    //         ? generalTasks.getTaskById(taskId)
    //         : currentProject.getTaskById(taskId);
    //     pubsub.publish('openDeleteModal', task);
    // }

    function loadModal({taskId, modal}) {
        const task = typeof currentProject === 'string'
            ? generalTasks.getTaskById(taskId)
            : currentProject.getTaskById(taskId);
        pubsub.publish(`open${modal}`, task);
    }


    // function getTasks

    function isDuplicateProject(project) {
        const exists = projects.findIndex(el => el.name === project.name);
        return exists !== -1; 
    }

    function loadProjects() {
        const projectsLocal = JSON.parse(localStorage.getItem('projects'));
        for (const project in projectsLocal) {
            const projectTasks = projectsLocal[project];
            if (project === 'Tasks') {
                projectTasks.forEach(task =>
                        generalTasks.addTask(new Task(
                            task.title,
                            task.description,
                            task.date,
                            task.priority,
                            task.done,
                            task.id
                        ))
                );
                currentProject = 'Tasks';
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
            projects.push(newProject);
        }
        pubsub.publish('projectAdded', projects);
    }

    return {
        init,
        getCurrentProjectTasks,
    }

})();