/// <reference types="node" />
export declare type SseField = 'event' | 'data' | 'id' | 'retry';
export declare type SseValue = Buffer | any;
export declare type SseSerializer = (value: any) => string | Buffer;
export interface ISseBlockConfiguration {
    [field: string]: SseValue;
}
/**
 * Creates a Buffer for a SSE "instruction" -- `event: myEvent\n`
 *
 * @param field The instruction field
 * @param value The instruction value
 * @param serializer Value serializer for `data`
 */
export declare function instruction(field: SseField, value: SseValue, serializer?: SseSerializer): Buffer;
/**
 * Creates a Buffer for a SSE comment -- `: this is a comment\n`
 *
 * @param comment The comment message
 */
export declare function comment(comment: string): Buffer;
/**
 * Creates a Buffer for a SSE block of instructions -- event: myEvent\ndata: "eventData"\n\n
 *
 * @param instructions An object map of SSEFields to SSEValues
 * @param serializer Value serializer for `data`
 */
export declare function block(instructions: ISseBlockConfiguration, serializer?: SseSerializer): Buffer;
/**
 * Create a buffer for a standard SSE block composed of `event`, `data`, and `id` (only `data` is mandatory).
 * To create a data-only message (without event name), pass `null` to `event`.
 *
 * @param event The event name, null to create a data-only message
 * @param data The event data
 * @param id The event ID
 * @param serializer Value serializer for `data`
 */
export declare function message(event: string | null, data: SseValue, id?: string, serializer?: SseSerializer): Buffer;
