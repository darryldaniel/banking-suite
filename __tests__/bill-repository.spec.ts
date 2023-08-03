import { describe, expect, it } from "@jest/globals";
import { getRandomBill } from "../test-helpers/factories/bill-test-factory";
import { BillRepository } from "../db/bill-repository";
import { ObjectId } from "mongodb";

describe("BillRepository", () => {
    it("should be able to insert and find from the bills collection", async () => {
        // arrange
        const bill = getRandomBill();
        const billRepository = new BillRepository();

        // act
        const insertId = await billRepository.create(bill);

        // assert
        const findResult = await billRepository.findById(insertId);
        expect(insertId).toEqual(findResult?._id as ObjectId);
        await billRepository.deleteById(insertId);
        await billRepository.close();
    });
});