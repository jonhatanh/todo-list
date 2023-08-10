import { Project } from "./project";
import { pubsub } from "./pubsub";
import { Task } from "./task";

export const taskForm = (function () {

    function init() {
        const form = document.getElementById('task-form');

        form.addEventListener('submit', addTask);
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
        console.log("TASK-FORM: task form submitted", task);
        pubsub.publish('taskFormSubmitted', task);
        e.target.reset();
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
        if (e.code !== "Enter") return;
        const projectName = input.value.trim();
        if(projectName === "" || projectName.length > 50) {
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
