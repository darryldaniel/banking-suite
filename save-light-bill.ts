import { CommandExecutor } from "./cqrs/command-executor";
import DotEnv from "dotenv";
import { SaveLightBillCommand } from "./features/save-light-bill-command";

DotEnv.config();

async function run() {
    const commandExecutor = new CommandExecutor();
    const command = new SaveLightBillCommand("./docs/Water and lights - June 2023.pdf");
    await commandExecutor.execute(command);
}

(async () => {
    await run();
    process.exit(0);
})();
