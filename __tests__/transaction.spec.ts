import { InvestecTransaction } from "../models/investec-transaction";
import { InvestecCardTransactionPayload } from "../models/investec-card-transaction-payload";
import { getRandomInvestecCardTransactionPayload } from "../test-helpers/factories/transaction-test-factory";
import { ObjectId } from "mongodb";
import { describe, expect, it } from "@jest/globals";

describe("InvestecTransaction", () => {
    describe("createFromPayload", () => {
        it("should create a transaction from a payload", () => {
            const transactionData: InvestecCardTransactionPayload = getRandomInvestecCardTransactionPayload();
            const merchantId = new ObjectId();
            const transaction = InvestecTransaction.createFromPayload(
                transactionData,
                merchantId);
            expect(transaction).toEqual(
                {
                    accountNumber: transactionData.accountNumber,
                    centsAmount: transactionData.centsAmount,
                    currencyCode: transactionData.currencyCode,
                    dateTime: transactionData.dateTime,
                    merchantId,
                    reference: transactionData.reference,
                    type: transactionData.type,
                    cardId: transactionData.card.id
                });
        });
    });
});
