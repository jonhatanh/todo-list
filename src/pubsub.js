export const pubsub = {
    events: {},
    subscribe: function (eventName, fn) {
        //add an event with a name as new or to existing list
        this.events[eventName] = this.events[eventName] ?? [];
        this.events[eventName].push(fn);
    },
    unsubscribe: function (eventName, fn) {
        //remove an event function by name
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(f => f !== fn);
        }
    },
    publish: function (eventName, data) {
        //emit|publish|announce the event to anyone who is subscribed
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(fn => {
            fn(data);
        });
    }
};