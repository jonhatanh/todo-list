import { pubsub } from "./pubsub";
import {create, addClass, addChilds} from './dom-helper';
import {Project} from './project';
// import { Task } from "./task";

export const pageTitle = (function () {
    const titleContainer = document.querySelector('header .header__title h1');
    const deleteBtn = document.querySelector('header .header__options button');
    let actualPage;

    function init(project) {
        pubsub.subscribe('loadNewPage', changeTitle);
        changeTitle(project);
        deleteBtn.addEventListener('click', deleteProject);
    }

    function changeTitle(project) {
        actualPage = project.name;
        Project.isDefaultProject(project) 
            ? deleteBtn.style.display = 'none'
            : deleteBtn.style.display = 'block';
        titleContainer.textContent = project.name;
        // const i = addClass(create('i'), 'fa-solid', 'fa-list-check');
        // const h1 = create('h1');
        // h1.textContent = project.name;
        // addChilds(titleContainer, i, h1);
        // addChilds(titleContainer, createNavButton, h1);
    }

    function deleteProject(e) {
        pubsub.publish('openDeleteProjectModal');
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
        pubsub.subscribe('toggleTaskUI', toggleTask);
        renderTasks(tasks);
        tasksContainer.addEventListener('click', makeAction);
    }

    function renderTasks(tasks) {
        tasksContainer.textContent = '';
        console.log('TASK-LIST: RENDERING');
        console.log(tasks);
        //Add filters here
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

    function toggleTask(taskId) {
        const taskContainer = document.getElementById(taskId);
        if (!taskContainer) return;
        const checkBox = taskContainer.firstChild;
        taskContainer.classList.contains('task--done')
            ? taskContainer.classList.remove('task--done')
            : taskContainer.classList.add('task--done');
        checkBox.checked = !checkBox.checked;
    }

    function makeAction(e) {
        if(e.target.dataset.action === undefined) return;
        const action = e.target.dataset.action;
        const taskElement = e.target.closest('.task');
        const taskId = e.target.closest('.task').id;
        
        console.log(action);
        if(action === 'task-details') {
            pubsub.publish('loadModal', {"taskId":taskElement.id, "modal": "DetailsModal"});
        }
        if(action === 'task-edit') {
            pubsub.publish('loadModal', {"taskId":taskElement.id, "modal": "EditModal"});
        }
        if(action === 'task-delete') {
            pubsub.publish('loadModal', {"taskId":taskElement.id, "modal": "DeleteModal"});
        }
        if(action === 'task-check') {
            pubsub.publish('toggleTaskDone', taskElement.id);
            e.target.checked
                ? taskElement.classList.add('task--done')
                : taskElement.classList.remove('task--done');
        }

        
    }


    function createTaskElement(task) {
        const li = addClass(create('li'), 'task');
        li.id = task.id;
        task.done && li.classList.add('task--done');
        if(task.priority === 'low') {
            li.classList.add('task--low');
        } else if(task.priority === 'medium') {
            li.classList.add('task--medium');
        } else {
            li.classList.add('task--high');
        }

        const checkbox = create('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.dataset.action="task-check";

        const span = addClass(create('span'), 'task__info');
        const spanName = addClass(create('span'), 'task__name');
        const spanDate = addClass(create('span'), 'task__date');
        spanName.textContent = task.title;
        spanDate.textContent = task.date;
        span.dataset.action="task-details";
        addChilds(span, spanName, spanDate);

        const taskOptions = addClass(create('div'), 'task__options');
        const editButton = create('button');
        editButton.title = 'Edit';
        editButton.dataset.action="task-edit";
        const deleteButton = create('button');
        deleteButton.title = 'Delete';
        deleteButton.dataset.action="task-delete";
        
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
        pubsub.subscribe('taskDeleted', updateTasksCounter);
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
        const icon = addClass(create('i'), 'fa-solid', 'fa-list');
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
        pubsub.subscribe('changeCurrentPageById', changeCurrentPageById);
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
        document.querySelector('.nav__item--selected')?.classList.remove('nav__item--selected');
        navItem.classList.add('nav__item--selected');
    }

    function changeCurrentPageById(projectId) {
        document.getElementById(projectId).classList.add('nav__item--selected');
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
        if(e.animationName === 'progress-bar-toast') {
            toastContainer.classList.add('close');
        }
        if(e.animationName === 'toast-close') {
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

export const modal = (function () {
    const modalContainer = document.getElementById('modal');
    const formContainer = document.getElementById('update-task-form');
    const modalCancelButton = document.getElementById('modal-cancel');
    const modalConfirmButton = document.getElementById('modal-confirm');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalDate = document.getElementById('modal-date');
    const modalLow = document.getElementById('modal-low');
    const modalMedium = document.getElementById('modal-medium');
    const modalHigh = document.getElementById('modal-high');
    
    function init() {
        pubsub.subscribe('openEditModal', openEditModal);
        pubsub.subscribe('closeEditModal', hiddeModal);
        modalCancelButton.addEventListener('click', hiddeModal)
        modalContainer.addEventListener('animationend', removeModalClasses);
    }

    function hiddeModal(e) {
        modalContainer.classList.add('hidde');
        formContainer.classList.add('hidde');
    }
    function removeModalClasses(e) {
        if(e.animationName === 'close-modal') {
            modalContainer.classList.remove('hidde');
            modalContainer.classList.remove('show');
        }
        if(e.animationName === 'close-form') {
            formContainer.classList.remove('hidde');
            formContainer.classList.remove('show');
            formContainer.reset();
        }
    }

    function openEditModal(task) {
        addTaskToForm(task);
        modalContainer.classList.add('show');
        formContainer.classList.add('show');
    }

    function addTaskToForm(task) {
        formContainer.dataset.id = task.id;
        modalTitle.value = task.title;
        modalDescription.value = task.description;
        modalDate.value = task.date;
        if(task.priority === 'low') {
            modalLow.checked = true;
        } else if(task.priority === 'medium') {
            modalMedium.checked = true;
        } else {
            modalHigh.checked = true;
        }
    }
    return {
        init,
    };
})();

export const confirmModal = (function () {
    const modalContainer = document.getElementById('confirmModal');
    const confirmContent = document.querySelector('.confirm-content');
    const modalCancelButton = document.getElementById('confirmModal-cancel');
    const modalConfirmButton = document.getElementById('confirmModal-confirm');
    const modalText = document.querySelector('.confirm-content p');
    const modalTitle = document.querySelector('.confirm-content h5');
    
    function init() {
        pubsub.subscribe('openDeleteModal', openDeleteModal);
        pubsub.subscribe('openDetailsModal', openDetailsModal);
        pubsub.subscribe('closeDeleteModal', hiddeModal);
        pubsub.subscribe('openDeleteProjectModal', openDeleteProjectModal);
        modalCancelButton.addEventListener('click', hiddeModal)
        modalConfirmButton.addEventListener('click', confirmAction);
        modalContainer.addEventListener('animationend', removeModalClasses);
    }

    function hiddeModal(e) {
        modalContainer.classList.add('hidde');
        confirmContent.classList.add('hidde');
    }
    function removeModalClasses(e) {
        if(e.animationName === 'close-modal') {
            modalContainer.classList.remove('hidde');
            modalContainer.classList.remove('show');
        }
        if(e.animationName === 'close-form') {
            confirmContent.classList.remove('hidde');
            confirmContent.classList.remove('show');
        }
    }

    function openDetailsModal(task) {
        modalTitle.textContent = task.title;
        modalText.innerHTML = `
        <b>Description:</b> ${task.description ? task.description : '---'}<br>
        <b>Due date:</b> ${task.date ? task.date : '---'}<br>
        <b>Priority:</b> ${firstToUpper(task.priority)}<br>
        `
        confirmContent.dataset.id = task.id;
        confirmContent.dataset.action = "details-task";
        modalCancelButton.textContent = 'Close';
        modalConfirmButton.textContent = task.done ? 'Unmark' : 'Mark Complete';
        modalContainer.classList.add('show');
        confirmContent.classList.add('show');
    }


    function firstToUpper(str) {
        return str.charAt(0).toUpperCase().concat(str.slice(1));
    }

    function openDeleteModal(task) {
        modalTitle.textContent = 'Are you sure?';
        modalText.innerHTML = `The task <b>${task.title}</b> will be gone forever.`
        confirmContent.dataset.id = task.id;
        confirmContent.dataset.action = "delete-task";
        modalCancelButton.textContent = 'Cancel';
        modalConfirmButton.textContent = 'Delete';
        modalContainer.classList.add('show');
        confirmContent.classList.add('show');
    }

    function openDeleteProjectModal() {
        modalTitle.textContent = 'Are you sure?';
        modalText.innerHTML = `This project will be gone forever.`
        confirmContent.dataset.action = "delete-project";
        modalCancelButton.textContent = 'Cancel';
        modalConfirmButton.textContent = 'Delete';
        modalContainer.classList.add('show');
        confirmContent.classList.add('show');
    }

    function confirmAction() {
        if(confirmContent.dataset.action === 'delete-task') {
            console.log(confirmContent.dataset.id);
            pubsub.publish('deleteTask', confirmContent.dataset.id);
            pubsub.publish('showToast', {
                'icon': 'fa-solid fa-check',
                'message': 'Task deleted'
            })
        }
        if(confirmContent.dataset.action === 'details-task') {
            console.log(confirmContent.dataset.id);
            pubsub.publish('toggleTaskDone', confirmContent.dataset.id);
            pubsub.publish('toggleTaskUI', confirmContent.dataset.id);
        }

        if(confirmContent.dataset.action === 'delete-project') {
            pubsub.publish('deleteCurrentProject');
        }

        hiddeModal();
    }

    // function addTaskToForm(task) {
    //     confirmContent.dataset.id = task.id;
    //     modalTitle.value = task.title;
    //     modalDescription.value = task.description;
    //     modalDate.value = task.date;
    //     if(task.priority === 'low') {
    //         modalLow.checked = true;
    //     } else if(task.priority === 'medium') {
    //         modalMedium.checked = true;
    //     } else {
    //         modalHigh.checked = true;
    //     }
    // }
    return {
        init,
    };
})();


export const mediaQueries = (function () {
    const headerToggle = document.getElementById('header-toggle');
    const navToggle = document.getElementById('nav-toggle');
    const navContainer = document.querySelector('nav.nav');
    const navBackground = document.querySelector('.nav-background');
    const media = window.matchMedia("(min-width: 640px)");

    function init() {
        applyQueries(media.matches);
        media.addEventListener('change', applyQueries)
        headerToggle.addEventListener('click', e => {
            navContainer.classList.add('nav--show');
        })
        navToggle.addEventListener('click', e => {
            navContainer.classList.remove('nav--show');
        })
        navBackground.addEventListener('click', e => {
            navContainer.classList.remove('nav--show');
        })
    }

    function applyQueries(e) {
        const match = typeof e === 'boolean' ? e : e.target.matches;
        if (match) {
            console.log('More than 400px');
            navContainer.classList.remove('nav--hidden');
            navContainer.classList.remove('nav--show');
            headerToggle.classList.remove('show');
            navToggle.classList.remove('show');
        } else {
            console.log('Less than 400px');
            navContainer.classList.add('nav--hidden');
            headerToggle.classList.add('show');
            navToggle.classList.add('show');
        }
    }

    

    return {
        init,
    }

})();