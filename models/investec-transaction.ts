import { InvestecCardTransactionPayload } from "./investec-card-transaction-payload";
import { Entity } from "./entity";
import { ObjectId } from "mongodb";

export class InvestecTransaction extends Entity {
    constructor(
        public readonly accountNumber: string,
        public readonly centsAmount: number,
        public readonly currencyCode: string,
        public readonly dateTime: string,
        public readonly merchantId: ObjectId,
        public readonly reference: string,
        public readonly type: string,
        public readonly cardId: string
    ) {
        super();
    }

    static createFromPayload({
                                 accountNumber,
                                 centsAmount,
                                 currencyCode,
                                 dateTime,
                                 reference,
                                 type,
                                 card
                             }: InvestecCardTransactionPayload,
                             merchantId: ObjectId) {
        return new InvestecTransaction(
            accountNumber,
            centsAmount,
            currencyCode,
            dateTime,
            merchantId,
            reference,
            type,
            card.id);
    }
}
