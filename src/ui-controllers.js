import { pubsub } from "./pubsub";
import {create, addClass, addChilds} from './dom-helper';
import {Project} from './project';
// import { Task } from "./task";

export const pageTitle = (function () {
    const titleContainer = document.querySelector('header .header__title');

    function init(project) {
        pubsub.subscribe('loadNewPage', changeTitle);
        changeTitle(project);
    }

    function changeTitle(project) {
        titleContainer.textContent = '';
        const i = addClass(create('i'), 'fa-solid', 'fa-list-check');
        const h1 = create('h1');
        h1.textContent = project.name;
        addChilds(titleContainer, i, h1);
    }

    return {
        init,
    }

})();

export const tasksList = (function () {
    const tasksContainer = document.getElementById('tasks');
    
    function init(tasks) {
        pubsub.subscribe('taskAdded', renderTasks);
        pubsub.subscribe('loadNewPage', renderProjectTasks);
        renderTasks(tasks);
        tasksContainer.addEventListener('click', e => {
            console.log(e.target);
            console.log(e.target.closest('.task').id);
        });
    }

    function renderTasks(tasks) {
        tasksContainer.textContent = '';
        console.log('TASK-LIST: RENDERING');
        tasks.forEach(task => {
            tasksContainer.appendChild(createTaskElement(task));
        })
    }

    function renderProjectTasks(project) {
        const tasks = project instanceof Project 
            ? project.getTasks()
            : project.tasks;
        renderTasks(tasks);

    }


    function createTaskElement(task) {
        const li = addClass(create('li'), 'task');
        li.id = task.id;
        const checkbox = create('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        const span = addClass(create('span'), 'task__name');
        span.textContent = task.title;
        const taskOptions = addClass(create('div'), 'task__options');
        const editButton = create('button');
        editButton.title = 'Edit';
        const deleteButton = create('button');
        deleteButton.title = 'Delete';
        
        addChilds(editButton, addClass(create('i'), 'fa-solid', 'fa-pen-to-square'));
        addChilds(deleteButton, addClass(create('i'), 'fa-regular', 'fa-trash-can'));
        addChilds(taskOptions, editButton, deleteButton);
        addChilds(li, checkbox, span, taskOptions);
        return li;
    }

    return {
        init,

    };
})();

export const projectsList = (function () {
    const projectContainer = document.getElementById('projects');
    
    function init(projects) {
        pubsub.subscribe('projectAdded', renderProjects);
        pubsub.subscribe('projectTaskUpdated', updateTasksCounter);
        renderProjects(projects);
        
        // projectContainer.addEventListener('click', e => {
        //     console.log(e.target);
        //     console.log(e.target.closest('.nav__item').id);
        // });
    }

    function renderProjects(projects) {
        projectContainer.textContent = '';
        console.log('PROJECT-LIST: RENDERING');
        projects?.forEach(project => {
            projectContainer.appendChild(createProjectElement(project));
        })
    }

    function updateTasksCounter({project}) {
        const qtyElement = document.querySelector(`.nav__item__qty[data-project="${project.name}"]`);
        if(!qtyElement) return;

        qtyElement.textContent = project.getNumOfTasks();
        if (project.name === 'Tasks') updateDefaultProjects(project);
    }

    function updateDefaultProjects(project) {
        const qtyTodayElement = document.querySelector('#Today .nav__item__qty');
        const qtyWeekElement = document.querySelector('#Week .nav__item__qty');
        qtyTodayElement.textContent = project.getTodayTasks().length;
        qtyWeekElement.textContent = project.getWeekTasks().length;
    }

    

    function createProjectElement(project) {
        const div = addClass(create('a'), 'nav__item');
        div.id = project.name;
        const titleContainer = addClass(create('div'), 'nav__item__title');
        const icon = addClass(create('i'), 'fa-solid', 'fa-list-check');
        const qtyContainer = addClass(create('div'), 'nav__item__qty');
        qtyContainer.dataset.project = project.name;
        qtyContainer.textContent = project.getNumOfTasks();

        addChilds(titleContainer, icon, document.createTextNode(project.name));
        addChilds(div, titleContainer, qtyContainer);

        return div;
    }

    return {
        init,

    };
})();

export const navController = (function () {
    const navContainer = document.getElementById('nav-items');
    
    function init() {
        
        navContainer.addEventListener('click', changeCurrentPage);
    }

    function changeCurrentPage(e) {
        const navItem = e.target.closest('.nav__item');
        if(navItem) {
            changeActivePage(navItem);
            const newPageName = navItem.id;
            pubsub.publish('changePage', newPageName);
        }
    }
    function changeActivePage(navItem) {
        document.querySelector('.nav__item--selected').classList.remove('nav__item--selected');
        navItem.classList.add('nav__item--selected');
    }

    return {
        init,
    };
})();

export const toast = (function () {
    const toastContainer = document.getElementById('toast');
    
    function init() {
        pubsub.subscribe('showToast', showToast);
        toastContainer.addEventListener('animationend', hideToast)
    }

    function hideToast(e) {
        if(e.animationName === 'progress-bar-modal') {
            toastContainer.classList.add('close');
        }
        if(e.animationName === 'modal-close') {
            toastContainer.classList.remove('open', 'close');
        }
    }

    function showToast({icon, message}) {
        const iconContainer = document.querySelector(".toast .icon i");
        const messageContainer = document.querySelector(".toast .message");
        iconContainer.className = icon;
        messageContainer.textContent = message;
        toastContainer.classList.add('open');
    }
    return {
        init,
    };
})();
