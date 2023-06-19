jest.doMock("../cqrs/command-executor", () => {

});
import { describe, it, expect, jest } from "@jest/globals";
import { buildApp } from "../app";
import { FastifyInstance } from "fastify";
import { asValue } from "awilix";
import { getRandomInvestecCardTransactionPayload } from "../test-helpers/factories/transaction-test-factory";
import { CreateBudgetItemFromTransactionCommand } from "../features/create-budget-item-from-transaction.command";
import { mockBudgetProvider } from "../test-helpers/mocks/mock-budget-provider";
import { mockRepository } from "../test-helpers/mocks/mock-repository";
import { mockCommandExecutor, mockExecute } from "../test-helpers/mocks/mock-command-executor";
import { Containers } from "../di/containers";

describe("POST /transaction", () => {
    describe("when the username/password is invalid", () => {
        it("should return 401 unauthorised", async () => {
            // arrange
            const app = create();

            // act
            const response = await app.inject({
                method: "POST",
                url: "/transaction",
                headers: {
                    ...getAuthHeader(
                        process.env.USERNAME || "",
                        "invalid_password"
                    )
                }
            });

            // assert
            expect(response.statusCode).toBe(401);
        });
    });

    describe("when the request in invalid", () => {
        it("should return a 400", async () => {
            // arrange
            const request = {
                invalidPayload: true
            }
            const app = create();

            // act
            const response = await app.inject({
                method: "POST",
                url: "/transaction",
                headers: {
                    ...getAuthHeader()
                },
                body: {
                    transactionString: request
                }
            });

            // assert
            expect(response.statusCode).toBe(400);
        });
    });

    it("should call the create-budget-item-from-transaction command with the payload", async () => {
        // arrange
        const request = getRandomInvestecCardTransactionPayload();
        const app = create();

        // act
        const response = await app.inject({
            method: "POST",
            url: "/transaction",
            headers: {
                ...getAuthHeader()
            },
            body: {
                transactionString: JSON.stringify(request)
            }
        });

        // assert
        expect(response.statusCode).toBe(200);
        const command = mockExecute.mock.calls[0][0] as CreateBudgetItemFromTransactionCommand;
        expect(command.transactionPayload)
            .toEqual(request);
    });
});

function create(): FastifyInstance {
    const diContainers = {
        [Containers.CommandExecutor]: asValue(mockCommandExecutor),
        [Containers.InvestecTransactionRepository]: asValue(mockRepository),
        [Containers.InvestecMerchantRepository]: asValue(mockRepository),
        [Containers.BudgetProvider]: asValue(mockBudgetProvider)
    }
    return buildApp(diContainers);
}

function getAuthHeader(
    username?: string,
    password?: string
) {
    username = username || process.env.USERNAME || "";
    password = password || process.env.PASSWORD || "";
    return {
        Authorization: `Basic ${Buffer.from(username + ':' + password).toString('base64')}`
    }
}
