/**
 * A type for commands.
 * Every command has to implement the method execute, which is called by the CommandDispatcher.
 * Each command fulfills exactly one action. Try to use as granular commands as possible.
 */
export interface Command {
    constructor(...args: any): any;
    /**
     * This method is called by the dispatcher to fulfill a task.
     */
    execute(): Promise<void>;
}