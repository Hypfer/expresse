const compose_middleware = require("compose-middleware");
const Hub = require("./hub");
const sse_middleware = require("./sse_middleware");
/**
 * SSE middleware that configures an Express response for an SSE session, installs `sse.*` functions on the Response
 * object, as well as the `sse.broadcast.*` variants.
 *
 * @param options An ISseMiddlewareOptions to configure the middleware's behaviour.
 */
function sseHub(options = {}) {
    const { hub = new Hub(), maxClients = 5, rejectWhenFull = false } = options;
    function middleware(req, res, next) {
        //We need this reference to later terminate the connection if required
        res.sse.res = res;

        if (hub.clients.size >= maxClients) {
            if (rejectWhenFull === true){
                res.end();
                res.socket.destroy();
                return;
            } else {
                //Sets are iterated in insertion order. Therefore, to disconnect the oldest connection,
                //we just take the first value
                const clientToTerminate = hub.clients.values().next().value;
                clientToTerminate.res.end();
                clientToTerminate.res.socket.destroy();

                hub.clients.delete(clientToTerminate);
            }
        }

        //=> Register the SSE functions of that client on the hub
        hub.register(res.sse);

        //=> Unregister the user from the hub when its connection gets closed (close=client, finish=server)
        res.once('close', () => {
            hub.unregister(res.sse);
        });

        res.once('finish', () => {
            hub.unregister(res.sse);
        });

        //=> Make hub's functions available on the response
        res.sse.broadcast = {
            data: hub.data.bind(hub),
            event: hub.event.bind(hub),
            comment: hub.comment.bind(hub),
        };
        //=> Done
        next();
    }
    return compose_middleware.compose(sse_middleware(options), middleware);
}
module.exports = sseHub;
