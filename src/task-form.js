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