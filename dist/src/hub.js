"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hub {
    constructor() {
        this.clients = new Set();
    }
    register(funcs) {
        this.clients.add(funcs);
    }
    unregister(funcs) {
        this.clients.delete(funcs);
    }
    data(data, id) {
        this.clients.forEach(client => client.data(data, id));
    }
    event(event, data, id) {
        this.clients.forEach(client => client.event(event, data, id));
    }
    comment(comment) {
        this.clients.forEach(client => client.comment(comment));
    }
}
exports.Hub = Hub;
