"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compose_middleware = require("compose-middleware");
const fmt = require("./sse_formatter");
const sse_handler_middleware = require("./sse_handler_middleware");
/**
 * SSE middleware that configures an Express response for an SSE session, and installs the `sse.*` functions
 * on the Response object.
 *
 * @param options An ISseMiddlewareOptions to configure the middleware's behaviour.
 */
function sse(options = {}) {
    const { serializer } = options;
    function middleware(req, res, next) {
        const write = res[sse_handler_middleware.sseWrite];
        //=> Install the sse*() functions on Express' Response
        res.sse = {
            data(data, id) {
                write(fmt.message(null, data, id, serializer));
            },
            event(event, data, id) {
                write(fmt.message(event, data, id, serializer));
            },
            comment(comment) {
                write(fmt.comment(comment));
            },
            write(data) {
                write(data);
            }
        };
        //=> Done
        next();
    }
    return compose_middleware.compose(sse_handler_middleware(options), middleware);
}

module.exports = sse;
