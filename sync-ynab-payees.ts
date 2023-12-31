import DotEnv from "dotenv";
import { YnabProvider } from "./budget/ynab-provider";
import { YnabPayeeRepository } from "./db/ynab-payee-repository";
import { SyncYnabPayeesCommand } from "./features/sync-ynab-payees-command";
import { IBudgetProvider } from "./budget/budget-provider";
import { CommandExecutor } from "./cqrs/command-executor";
import { GetMongoDBConnection } from "./db/mongoConnectionFactory";
DotEnv.config({
    path: ".env.prod"
});

async function run() {
    await dropYnabCollection();
    const budgetProvider: IBudgetProvider = new YnabProvider();
    const ynabPayeeRepository = new YnabPayeeRepository();
    const cmd = new SyncYnabPayeesCommand(
        budgetProvider,
        ynabPayeeRepository);
    const commandExecutor = new CommandExecutor();
    await commandExecutor.execute(cmd);
    await ynabPayeeRepository.close();
}

async function dropYnabCollection() {
    const collection = GetMongoDBConnection("ynabPayee");
    await collection.drop();
}

(async () => await run())();