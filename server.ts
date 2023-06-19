import { buildApp } from "./app";
import { asClass } from "awilix";
import { Containers } from "./di/containers";
import { CommandExecutor } from "./cqrs/command-executor";
import { InvestecTransactionRepository } from "./db/investec-transaction-repository";
import { InvestecMerchantRepository } from "./db/investec-merchant-repository";
import { YnabProvider } from "./budget/ynab-provider";

async function run() {
    if (process.env.NODE_ENV !== "production") {
        const DotEnv = (await import("dotenv"));
        DotEnv.config();
    }

    const diContainers = {
        [Containers.CommandExecutor]: asClass(CommandExecutor),
        [Containers.InvestecTransactionRepository]: asClass(InvestecTransactionRepository),
        [Containers.InvestecMerchantRepository]: asClass(InvestecMerchantRepository),
        [Containers.BudgetProvider]: asClass(YnabProvider)
    }

    const app = buildApp(diContainers);
    app.listen(
        {
            port: 3000
        },
        (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Server listening at ${address}`);
        });
}

(async () => await run())();
