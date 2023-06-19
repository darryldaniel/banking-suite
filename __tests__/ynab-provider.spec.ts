import { mockCreateTransaction } from "../test-helpers/mocks/mock-ynab-provider";
import { describe, expect, it } from "@jest/globals";
import { BudgetTransaction } from "../models/budget-transaction";
import { faker } from "@faker-js/faker";
import { YnabProvider } from "../budget/ynab-provider";

describe("YnabProvider", () => {
    describe("addTransaction", () => {
        it("should add a ynab transaction with the given data", async () => {
            // arrange
            const transaction: BudgetTransaction = {
                amountInCents: faker.number.int({ min: 1000, max: 99999 }),
                payee_id: faker.string.uuid(),
                date: faker.date.past().toISOString(),
            };
            const ynabProvider = new YnabProvider();

            // act
            await ynabProvider.addTransaction(transaction);

            // assert
            expect(mockCreateTransaction).toHaveBeenCalledWith(
                process.env.YNAB_BUDGET_ID,
                {
                    transaction: {
                        ...transaction,
                        amount: +(transaction.amountInCents / 100).toFixed(2) * -1000,
                        account_id: process.env.INVESTEC_DEBIT_ACCOUNT_ID
                    }
                }
            )
        });
    });
});