import { InvestecTransaction } from "../models/investec-transaction";
import { Command } from "../cqrs/command";
import { InvestecTransactionRepository } from "../db/investec-transaction-repository";
import { diContainer } from "@fastify/awilix";
import { InvestecCardTransactionPayload } from "../models/investec-card-transaction-payload";
import { Merchant } from "../models/merchant";
import { InvestecMerchantRepository } from "../db/investec-merchant-repository";
import { IBudgetProvider } from "../budget/budget-provider";
import { ObjectId } from "mongodb";
import { Containers } from "../di/containers";

export class CreateBudgetItemFromTransactionCommand extends Command<void> {
    private transactionRepository: InvestecTransactionRepository;
    private merchantRepository: InvestecMerchantRepository;
    private budgetProvider: IBudgetProvider;

    constructor(public readonly transactionPayload: InvestecCardTransactionPayload) {
        super();
        this.merchantRepository = diContainer.resolve(Containers.InvestecMerchantRepository);
        this.transactionRepository = diContainer.resolve(Containers.InvestecTransactionRepository);
        this.budgetProvider = diContainer.resolve<IBudgetProvider>(Containers.BudgetProvider);
    }

    public async execute(): Promise<void> {
        if (this.transactionPayload.currencyCode.toLowerCase() !== "zar") {
            return;
        }
        const merchant = await this.fetchOrAddMerchant();
        await this.saveTransaction(merchant);
        await this.budgetProvider.addTransaction({
            amountInCents: this.transactionPayload.centsAmount,
            date: this.transactionPayload.dateTime,
            payee_id: merchant.payeeId,
            payee_name: !!merchant.payeeId
                ? undefined
                : merchant.name
        });
    }

    public async fetchOrAddMerchant(): Promise<Merchant> {
        const merchantFindResult = await this.merchantRepository.find({
            name: this.transactionPayload.merchant.name,
            city: this.transactionPayload.merchant.city
        });
        if (merchantFindResult.length > 0) {
            return merchantFindResult[0];
        }
        const merchant = Merchant.create(this.transactionPayload.merchant);
        const result = await this.merchantRepository.create(merchant);
        return {
            ...merchant,
            _id: result
        };
    }

    public async saveTransaction(merchant: Merchant): Promise<void> {
        const transaction = InvestecTransaction.createFromPayload(
            this.transactionPayload,
            merchant._id as ObjectId);
        await this.transactionRepository.create(transaction);
    }
}