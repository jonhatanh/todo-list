import { Project } from "./project";
import { pubsub } from "./pubsub";
import { Task } from "./task";

export const taskForm = (function () {
    const form = document.getElementById('task-form');
    const formUpdate = document.getElementById('update-task-form');
    const formTitle = document.getElementById('title');
    const formCollapse = document.getElementById('form-collapsible');
    const cancelBtn = document.getElementById('cancel-form');

    function init() {

        formUpdate.addEventListener('submit', updateTask);
        form.addEventListener('submit', addTask);
        formTitle.addEventListener('focus', collapse);
        cancelBtn.addEventListener('click', resetForm);
    }

    function addTask(e) {
        e.preventDefault();

        const data = e.target.elements;

        const task = new Task(
            data.title.value,
            data.description.value,
            data.date.value,
            data.priority.value
        );
        pubsub.publish('taskFormSubmitted', task);
        e.target.reset();
        formTitle.focus();
    }
    function updateTask(e) {
        e.preventDefault();

        const data = e.target.elements;

        const task = new Task(
            data.title.value,
            data.description.value,
            data.date.value,
            data.priority.value
        );
        pubsub.publish('taskUpdateSubmitted', {
            "taskId": e.target.dataset.id,
            "taskUpdated": task
        });
        pubsub.publish('closeEditModal', e);
        e.target.reset();
    }

    function collapse(e) {
            // formCollapse.classList.add('active');
            const inputs = formCollapse.nextElementSibling;
            inputs.style.maxHeight = inputs.scrollHeight + "px";
    }
    function resetForm() {
        // formCollapse.classList
        const inputs = formCollapse.nextElementSibling;
        inputs.style.maxHeight = null;
        form.reset();
    }

    return {
        init,

    };
})();

export const projectForm = (function () {
    const input = document.getElementById('new-project-input');

    function init() {

        input.addEventListener('keypress', addProject);
    }

    function addProject(e) {
        if (e.keyCode !== 13) return;
        const projectName = input.value.trim();
        const elementWithSameId = projectName != ""
            ? document.querySelector(`#${projectName}`)
            : null;
        if (projectName === "" 
            || projectName.length > 50
            || projectName.toLowerCase() === 'tasks' 
            || projectName.toLowerCase() === 'today'
            || projectName.toLowerCase() === 'this week' 
            || elementWithSameId !== null) {
            pubsub.publish("showToast", {
                icon: "fa-solid fa-xmark",
                message: "Invalid project name"
            });
            return;
        }
        input.value = "";
        pubsub.publish("projectFormSubmitted", new Project(projectName));
    }


    return {
        init,

    };
})();

