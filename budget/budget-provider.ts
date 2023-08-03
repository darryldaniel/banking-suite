import { BudgetTransaction } from "../models/budget-transaction";
import { Payee } from "ynab";

export interface IBudgetProvider {
    addTransaction(transaction: BudgetTransaction): Promise<void>;
    getAllPayees(): Promise<Payee[]>;
}