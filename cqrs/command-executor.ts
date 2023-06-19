import { Command } from "./command";

export class CommandExecutor {
    public async execute<T>(command: Command<T>): Promise<T | void> {
        await command.validate();
        return await command.execute();
    }
}
