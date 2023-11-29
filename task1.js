const {EventEmitter} = require("events");

// CREATING AN INSTANCE OF EVENT EMITTER
const eventEmitter = new EventEmitter();

// ATTACHING LISTENERS TO EVENTS
eventEmitter.on("event1", () => {
    console.log("Event 1 listener");
});
// ONCE LISTENER
eventEmitter.once("event1", () => {
    console.log("Event 1 listener ONCE");
});
eventEmitter.on("event2", () => {
    console.log("Event 2 listener");
});

// EMITTING EVENTS
eventEmitter.emit("event1");
eventEmitter.emit("event2");
eventEmitter.emit("event1");

// REMOVING LISTENER FROM EVENT 1
eventEmitter.removeListener("event1", () => console.log("Event 1 listener removed"));

// RAW LISTENERS METHOD
console.log(eventEmitter.rawListeners("event2"));

// LISTENER COUNT METHOD
console.log(eventEmitter.listenerCount("event2"));