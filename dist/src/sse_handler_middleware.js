"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseWrite = Symbol('@toverux/expresse#sseWrite');
function sseHandler(options = {}) {
    const { keepAliveInterval = 5000, flushHeaders = true, flushAfterWrite = false } = options;
    return (req, res, next) => {
        //=> Basic headers for an SSE session
        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no'
        });
        //=> Flush headers immediately
        // This has the advantage to 'test' the connection: if the client can't access this resource because of
        // CORS restrictions, the connection will fail instantly.
        flushHeaders && res.flushHeaders();
        //=> Start heartbeats (if not disabled)
        if (keepAliveInterval !== false) {
            if (typeof keepAliveInterval !== 'number') {
                throw new Error('keepAliveInterval must be a number or === false');
            }
            startKeepAlives(keepAliveInterval);
        }
        //=> Attach the res.write wrapper function to the response for internal use
        res[exports.sseWrite] = write;
        //=> Done.
        next();
        /**
         * Writes on the response socket with respect to compression settings.
         */
        function write(chunk) {
            res.write(chunk);
            flushAfterWrite && res.flush();
        }
        /**
         * Writes heartbeats at a regular rate on the socket.
         */
        function startKeepAlives(interval) {
            //=> Regularly send keep-alive SSE comments, clear interval on socket close
            const keepAliveTimer = setInterval(() => write(': sse-keep-alive\n'), interval);
            //=> When the connection gets closed (close=client, finish=server), stop the keep-alive timer
            res.once('close', () => clearInterval(keepAliveTimer));
            res.once('finish', () => clearInterval(keepAliveTimer));
        }
    };
}
exports.sseHandler = sseHandler;
