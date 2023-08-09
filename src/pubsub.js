export const pubsub = {
    events: {},
    subscribe: function (eventName, fn) {
        console.log(`PUBSUB: someone just subscribed to know about ${eventName}`);
        //add an event with a name as new or to existing list
        this.events[eventName] = this.events[eventName] ?? [];
        this.events[eventName].push(fn);
    },
    unsubscribe: function (eventName, fn) {
        console.log(`PUBSUB: someone just UNsubscribed from ${eventName}`);
        //remove an event function by name
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(f => f !== fn);
        }
    },
    publish: function (eventName, data) {
        console.log(`PUBSUB: Making an broadcast about ${eventName} with ${data}`);
        //emit|publish|announce the event to anyone who is subscribed
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(fn => {
            fn(data);
        });
    }
};