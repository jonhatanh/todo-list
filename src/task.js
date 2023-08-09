
export class Task {

    constructor(title, description = null, date = null, priority = 'low') {
        this.title = title;
        this.description = description;
        this.date = date;
        this.date = date;
        this.priority = priority;
        this.done = false;
    }

    completeTask() {
        this.done = true;
    }
}