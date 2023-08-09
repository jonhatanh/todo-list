import { pubsub } from "./pubsub";
import {create, addClass, addChilds} from './dom-helper'
// import { Task } from "./task";

export const tasksList = (function () {
    const tasksContainer = document.getElementById('tasks');
    
    function init(tasks) {
        pubsub.subscribe('taskAdded', renderTasks);
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


    function createTaskElement(task) {
        const div = addClass(create('div'), 'task');
        div.id = task.id;
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
        addChilds(div, checkbox, span, taskOptions);
        return div;
    }

    return {
        init,

    };
})();

