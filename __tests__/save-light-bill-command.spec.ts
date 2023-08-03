import { mockDocFromPath, mockParse } from "../test-helpers/mocks/mock-mindee-provider";
import { describe, it, expect } from "@jest/globals";
import { SaveLightBillCommand } from "../features/save-light-bill-command";
import { CommandExecutor } from "../cqrs/command-executor";
import { BillRepository } from "../db/bill-repository";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

describe("SaveLightBillCommand", () => {
    it("should read in light bill and save details to the database", async () => {
        // arrange
        const command = new SaveLightBillCommand("./docs/Water and lights - June 2023.pdf");
        const commandExecutor = new CommandExecutor();
        const billParsedData = {
            date: DateTime.fromJSDate(faker.date.recent()).toFormat("yyyy-MM-dd"),
            electricity: faker.number.float(),
            total: faker.number.float(),
            rates: faker.number.float(),
        }
        const fields = new Map<string, any>();
        fields.set("date", {
            values: [
                {
                    content: billParsedData.date,
                }
            ]
        });
        fields.set("electricity", {
            values: [
                {
                    content: billParsedData.electricity.toString(),
                }
            ]
        });
        fields.set("total", {
            values: [
                {
                    content: billParsedData.total.toString(),
                }
            ]
        });
        fields.set("rates", {
            values: [
                {
                    content: billParsedData.rates.toString(),
                }
            ]
        });
        mockParse.mockReturnValue({
            document: {
                fields
            }
        })

        // act
        await commandExecutor.execute(command);

        // assert
        expect(mockDocFromPath).toHaveBeenCalledWith("./docs/Water and lights - June 2023.pdf");
        const billRepository = new BillRepository();
        const result = await billRepository.find({
            billTotal: billParsedData.total,
        });
        expect(result.length).toEqual(1);
    });
});