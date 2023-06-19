import { API } from "ynab";
import { IBudgetProvider } from "./budget-provider";
import { BudgetTransaction } from "../models/budget-transaction";

const YnabAmountMultiplier = 1000;
const OutflowModifier = -1;

export class YnabProvider implements IBudgetProvider {
    private readonly client: API;
    private readonly budgetId: string;

    constructor() {
        if (!process.env.YNAB_API_KEY) {
            throw new Error("YNAB_API_KEY not set");
        }
        this.client = new API(process.env.YNAB_API_KEY);
        this.budgetId = process.env.YNAB_BUDGET_ID || "";
    }

    public async addTransaction(transaction: BudgetTransaction): Promise<void> {
        try {
            await this.client.transactions.createTransaction(
                this.budgetId,
                {
                    transaction: {
                        ...transaction,
                        amount: +(transaction.amountInCents / 100).toFixed(2) * YnabAmountMultiplier * OutflowModifier,
                        account_id: process.env.INVESTEC_DEBIT_ACCOUNT_ID
                    }
                });
        } catch (e) {
             console.error(e);
        }
    }
}
