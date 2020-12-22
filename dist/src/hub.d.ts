import * as fmt from './sse_formatter';
import { ISseFunctions } from './sse_middleware';
export interface IHub extends ISseFunctions {
    /**
     * Remember a new client.
     *
     * @param funcs SSE functions bound to the client.
     */
    register(funcs: ISseFunctions): void;
    /**
     * Unregister a known client.
     *
     * @param funcs SSE function to unregister.
     */
    unregister(funcs: ISseFunctions): void;
}
export declare class Hub implements IHub {
    protected readonly clients: Set<ISseFunctions>;
    register(funcs: ISseFunctions): void;
    unregister(funcs: ISseFunctions): void;
    data(data: fmt.SseValue, id?: string): void;
    event(event: string, data: fmt.SseValue, id?: string): void;
    comment(comment: string): void;
}
