const fmt = require("./sse_formatter");

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
        const formattedData = fmt.message(event, data, id);

        this.clients.forEach(client => client.write(formattedData));
    }
    comment(comment) {
        this.clients.forEach(client => client.comment(comment));
    }
}
module.exports = Hub;
