import { Command } from "../command";

export class HelpCommand implements Command {
    async execute(...args: any): Promise<void> {
        console.log(`
            usage: show-md <command>

            possible commands are:
                root      to print current server root directory.
                status    to show current options.
                start     to start the server.
                stop      to stop the server.
                exit      to stop the server and shut down show-md.
                help      to show this help screen.
        `);
    }

}