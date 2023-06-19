import { BudgetTransaction } from "../models/budget-transaction";

export interface IBudgetProvider {
    addTransaction(transaction: BudgetTransaction): Promise<void>;
}