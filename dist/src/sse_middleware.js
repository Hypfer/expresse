"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compose_middleware_1 = require("compose-middleware");
const fmt = require("./sse_formatter");
const sse_handler_middleware_1 = require("./sse_handler_middleware");
/**
 * SSE middleware that configures an Express response for an SSE session, and installs the `sse.*` functions
 * on the Response object.
 *
 * @param options An ISseMiddlewareOptions to configure the middleware's behaviour.
 */
function sse(options = {}) {
    const { serializer } = options;
    function middleware(req, res, next) {
        const write = res[sse_handler_middleware_1.sseWrite];
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
            }
        };
        //=> Done
        next();
    }
    return compose_middleware_1.compose(sse_handler_middleware_1.sseHandler(options), middleware);
}
exports.sse = sse;
