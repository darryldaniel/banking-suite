import { Command } from "../cqrs/command";
import { IBudgetProvider } from "../budget/budget-provider";
import { YnabPayeeRepository } from "../db/ynab-payee-repository";
import { YnabPayee } from "../models/ynab-payee";

export class SyncYnabPayeesCommand extends Command<void> {
    constructor(
        private readonly budgetProvider: IBudgetProvider,
        private readonly ynabPayeeRepository: YnabPayeeRepository) {
        super();
    }

    public async execute(): Promise<void> {
        const payees = await this.budgetProvider.getAllPayees();
        const payeeEntities = payees.map(p => YnabPayee.Create(p));
        await this.ynabPayeeRepository.createMany(payeeEntities);
    }
}