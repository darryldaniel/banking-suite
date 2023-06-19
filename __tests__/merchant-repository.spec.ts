import { ObjectId } from "mongodb";
import {
    getRandomInvestecTransaction
} from "../test-helpers/factories/transaction-test-factory";
import { InvestecTransactionRepository } from "../db/investec-transaction-repository";
import { InvestecMerchantRepository } from "../db/investec-merchant-repository";
import { describe, it, expect } from "@jest/globals";

describe("InvestecMerchantRepository", () => {
    it('should be able to insert and find from the transactions collection', async () => {
        const transaction = getRandomInvestecTransaction();
        const investecTransactionRepository = new InvestecTransactionRepository();
        const insertId = await investecTransactionRepository.create(transaction);
        const findResult = await investecTransactionRepository.findById(insertId);
        expect(insertId).toEqual(findResult?._id as ObjectId);
        await investecTransactionRepository.deleteById(insertId);
        await investecTransactionRepository.close();
    });
});
