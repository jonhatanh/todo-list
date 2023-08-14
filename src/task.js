
export class Task {
    #id;
    #done;
    constructor(title, description = null, date = null, priority = 'low', done = false, id = this.#uniqueID()) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.date = date;
        this.priority = priority;
        this.#done = done;
        this.#id = id;
    }

    toggleDone() {
        this.#done = !this.#done;
    }
    get done() {
        return this.#done;
    }

    get id() {
        return this.#id;
    }

    #uniqueID() {
        return Math.floor(Math.random() * Date.now()).toString(16);
    }


}