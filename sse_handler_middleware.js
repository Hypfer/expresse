const sseWrite = Symbol('@hypfer/expresse#sseWrite');
function sseHandler(options = {}) {
    const {
        keepAliveInterval = 5000,
        flushHeaders = true,
        flushAfterWrite = false,
        maxSocketBufferSize = (100 * 1024),
        terminateStaleConnections = false
    } = options;

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
        if (flushHeaders === true) {
            res.flushHeaders();
        }

        //=> Start heartbeats (if not disabled)
        if (keepAliveInterval !== false) {
            if (typeof keepAliveInterval !== 'number') {
                throw new Error('keepAliveInterval must be a number or === false');
            }
            startKeepAlives(keepAliveInterval);
        }
        //=> Attach the res.write wrapper function to the response for internal use
        res[sseWrite] = write;
        //=> Done.
        next();
        /**
         * Writes on the response socket with respect to compression settings.
         */
        function write(chunk) {
            if (res.socket.writableLength >= maxSocketBufferSize) {
                //We simply abort here since that's less harmful than going OOM due to buffers getting huge
                //Usually, missed SSE events shouldn't be an issue in almost all applications so it should be fine

                if (terminateStaleConnections === true) {
                    res.socket.destroy();
                }

                return false;
            }

            res.write(chunk);

            if (flushAfterWrite === true) {
                res.flush();
            }
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

sseHandler.sseWrite = sseWrite;
module.exports = sseHandler;
