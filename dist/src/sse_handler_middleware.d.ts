/// <reference types="express" />
import { Handler, Response } from 'express';
import * as fmt from './sse_formatter';
export interface ISseMiddlewareOptions {
    /**
     * Serializer function applied on all messages' data field (except when you direclty pass a Buffer).
     * SSE comments are not serialized using this function.
     *
     * @default JSON.stringify
     */
    serializer: fmt.SseSerializer;
    /**
     * Whether to flush headers immediately or wait for the first res.write().
     *  - Setting it to false can allow you or 3rd-party middlewares to set more headers on the response.
     *  - Setting it to true is useful for debug and tesing the connection, ie. CORS restrictions fail only when headers
     *    are flushed, which may not happen immediately when using SSE (it happens after the first res.write call).
     *
     * @default true
     */
    flushHeaders: boolean;
    /**
     * Determines the interval, in milliseconds, between keep-alive packets (neutral SSE comments).
     * Pass false to disable heartbeats (ie. you only support modern browsers/native EventSource implementation and
     * therefore don't need heartbeats to avoid the browser closing an inactive socket).
     *
     * @default 5000
     */
    keepAliveInterval: false | number;
    /**
     * If you are using expressjs/compression, you MUST set this option to true.
     * It will call res.flush() after each SSE messages so the partial content is compressed and reaches the client.
     * Read {@link https://github.com/expressjs/compression#server-sent-events} for more.
     *
     * @default false
     */
    flushAfterWrite: boolean;
}
export declare const sseWrite: unique symbol;
export interface ISseHandlerResponse extends Response {
    [sseWrite]: (chunk: any) => void;
}
export declare function sseHandler(options?: Partial<ISseMiddlewareOptions>): Handler;
