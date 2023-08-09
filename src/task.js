
export class Task {
    #id;
    constructor(title, description = null, date = null, priority = 'low') {
        this.title = title;
        this.description = description;
        this.date = date;
        this.date = date;
        this.priority = priority;
        this.done = false;
        this.#id = this.#uniqueID();
    }

    completeTask() {
        this.done = true;
    }

    get id() {
        return this.#id;
    }

    #uniqueID() {
        return Math.floor(Math.random() * Date.now()).toString(16);
    }


}