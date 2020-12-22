/// <reference types="express" />
import { Handler, Response } from 'express';
import { IHub } from './hub';
import { ISseMiddlewareOptions } from './sse_handler_middleware';
import { ISseFunctions } from './sse_middleware';
export interface ISseHubFunctions extends ISseFunctions {
    /**
     * Holds the broadcasting variants of the normal SSE functions.
     */
    broadcast: ISseFunctions;
}
/**
 * An ISseHubResponse is an augmented ISseResponse that contains a `sse.broadcast` property that contains the normal
 * SSE functions, except that they will send messages to every client connected to the hub.
 *
 * Example:
 *     res.sse.event('myevent', data'); // send to the client that originated the request.
 *     res.sse.broadcast.event('myevent', 'data'); // send to every client that passed through the middleware.
 */
export interface ISseHubResponse extends Response {
    sse: ISseHubFunctions;
}
export interface ISseHubMiddlewareOptions extends ISseMiddlewareOptions {
    /**
     * You can pass a IHub-compatible instance for controlling the stream outside of the middleware.
     * Otherwise, a Hub instance is automatically created.
     */
    hub: IHub;
}
/**
 * SSE middleware that configures an Express response for an SSE session, installs `sse.*` functions on the Response
 * object, as well as the `sse.broadcast.*` variants.
 *
 * @param options An ISseMiddlewareOptions to configure the middleware's behaviour.
 */
export declare function sseHub(options?: Partial<ISseHubMiddlewareOptions>): Handler;
