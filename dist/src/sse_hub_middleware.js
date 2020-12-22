"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compose_middleware_1 = require("compose-middleware");
const hub_1 = require("./hub");
const sse_middleware_1 = require("./sse_middleware");
/**
 * SSE middleware that configures an Express response for an SSE session, installs `sse.*` functions on the Response
 * object, as well as the `sse.broadcast.*` variants.
 *
 * @param options An ISseMiddlewareOptions to configure the middleware's behaviour.
 */
function sseHub(options = {}) {
    const { hub = new hub_1.Hub() } = options;
    function middleware(req, res, next) {
        //=> Register the SSE functions of that client on the hub
        hub.register(res.sse);
        //=> Unregister the user from the hub when its connection gets closed (close=client, finish=server)
        res.once('close', () => hub.unregister(res.sse));
        res.once('finish', () => hub.unregister(res.sse));
        //=> Make hub's functions available on the response
        res.sse.broadcast = {
            data: hub.data.bind(hub),
            event: hub.event.bind(hub),
            comment: hub.comment.bind(hub),
        };
        //=> Done
        next();
    }
    return compose_middleware_1.compose(sse_middleware_1.sse(options), middleware);
}
exports.sseHub = sseHub;
