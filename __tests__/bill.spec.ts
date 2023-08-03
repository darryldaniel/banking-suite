import { describe, expect, it } from "@jest/globals";
import { Bill, IBillData } from "../models/bill";
import { getRandomBillData, getRandomLightsBillData } from "../test-helpers/factories/bill-test-factory";
import { LightsBill } from "../models/lights-bill";
import { DateTime } from "luxon";

describe("Bill", () => {
    describe("Create", () => {
        it("should create a new Bill object", async () => {
            // arrange
            const billData: IBillData = getRandomBillData();

            // act
            const bill = Bill.Create(billData);

            // assert
            expect(bill).toEqual({
                _id: undefined,
                billDate: DateTime.fromFormat(billData.billDate, "yyyy-MM-dd").toJSDate(),
                billTotal: billData.billTotal,
                isApproved: false,
                datePaid: null,
                beneficiaryId: billData.beneficiaryId,
                totalToPay: billData.billTotal,
                type: ""
            });
        });
    });
});

describe("LightsBill", () => {
    it("should include date, electricity, rates", async () => {
        // arrange
        const billData = getRandomLightsBillData();

        // act
        const lightsBill = LightsBill.Create(billData);

        // assert
        const totalToPay = billData.billTotal - billData.rates;
        expect(lightsBill).toEqual({
            _id: undefined,
            billDate: billData.billDate,
            electricity: billData.electricity,
            rates: billData.rates,
            billTotal: billData.billTotal,
            isApproved: false,
            datePaid: null,
            beneficiaryId: process.env.ETHEKWINI_BENEFICIARY_ID,
            totalToPay,
            type: "lights"
        });
    });
});