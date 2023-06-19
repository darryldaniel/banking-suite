import { getRandomInvestecCardTransactionPayload } from "../test-helpers/factories/transaction-test-factory";
import { CommandExecutor } from "../cqrs/command-executor";
import { CreateBudgetItemFromTransactionCommand } from "../features/create-budget-item-from-transaction.command";
import { InvestecTransactionRepository } from "../db/investec-transaction-repository";
import { InvestecMerchantRepository } from "../db/investec-merchant-repository";
import { beforeEach, describe, expect, it, jest, afterAll } from "@jest/globals";
import { diContainer } from "@fastify/awilix";
import { asClass, asValue } from "awilix";
import Mock = jest.Mock;
import { Merchant } from "../models/merchant";
import { faker } from "@faker-js/faker";
import { Containers } from "../di/containers";

let commandExecutor: CommandExecutor,
    investecTransactionRepository: InvestecTransactionRepository,
    investecMerchantRepository: InvestecMerchantRepository;

beforeEach(() => {
    diContainer.register({
        [Containers.CommandExecutor]: asClass(CommandExecutor),
        [Containers.InvestecTransactionRepository]: asClass(InvestecTransactionRepository),
        [Containers.InvestecMerchantRepository]: asClass(InvestecMerchantRepository),
    });
    commandExecutor = diContainer.resolve<CommandExecutor>(Containers.CommandExecutor);
    investecTransactionRepository = diContainer.resolve<InvestecTransactionRepository>(Containers.InvestecTransactionRepository);
    investecMerchantRepository = diContainer.resolve<InvestecMerchantRepository>(Containers.InvestecMerchantRepository);
});

afterAll(async () => {
    await investecTransactionRepository.close();
    await investecMerchantRepository.close();
    await diContainer.dispose();
});

function mockBudgetProvider(spy: Mock) {
    diContainer.register(Containers.BudgetProvider, asValue({
        addTransaction: spy
    }));
}

describe("CreateBudgetItemFromTransactionCommand", () => {
    it("Should save a transaction payload to the database and to the budget provider", async () => {
        // arrange
        const addTransactionSpy = jest.fn();
        mockBudgetProvider(addTransactionSpy);
        const transactionPayload = getRandomInvestecCardTransactionPayload();

        // act
        await commandExecutor.execute(new CreateBudgetItemFromTransactionCommand(transactionPayload));

        // assert
        const merchantResult = await investecMerchantRepository.find({
            name: transactionPayload.merchant.name,
            city: transactionPayload.merchant.city,
        });
        expect(merchantResult.length).toBeGreaterThan(0);
        const transactionResult = await investecTransactionRepository.find({
            dateTime: transactionPayload.dateTime,
            centsAmount: transactionPayload.centsAmount,
        });
        expect(transactionResult.length).toBeGreaterThan(0);
        expect(addTransactionSpy).toHaveBeenCalledTimes(1);
        expect(addTransactionSpy).toHaveBeenCalledWith({
            amountInCents: transactionPayload.centsAmount,
            date: transactionPayload.dateTime,
            payee_name: transactionPayload.merchant.name
        });
    });

    describe("When a merchant already exists", () => {
        it("Should not create a new merchant", async () => {
            // arrange
            const addTransactionSpy = jest.fn();
            mockBudgetProvider(addTransactionSpy);
            const transactionPayload = getRandomInvestecCardTransactionPayload();
            await investecMerchantRepository.create(Merchant.create(transactionPayload.merchant));

            // act
            await commandExecutor.execute(new CreateBudgetItemFromTransactionCommand(transactionPayload));

            // assert
            const merchantResult = await investecMerchantRepository.find({
                name: transactionPayload.merchant.name,
                city: transactionPayload.merchant.city,
            });
            expect(merchantResult.length).toBe(1);
        });

        describe("And the merchant has a payee id", () => {
            it("Should send through the payee id to the budget provider", async () => {
                // arrange
                const payeeId = faker.string.uuid();
                const addTransactionSpy = jest.fn();
                mockBudgetProvider(addTransactionSpy);
                const transactionPayload = getRandomInvestecCardTransactionPayload();
                const merchant = Merchant.create(transactionPayload.merchant);
                merchant.payeeId = payeeId
                await investecMerchantRepository.create(merchant);

                // act
                await commandExecutor.execute(new CreateBudgetItemFromTransactionCommand(transactionPayload));

                // assert
                const merchantResult = await investecMerchantRepository.find({
                    name: transactionPayload.merchant.name,
                    city: transactionPayload.merchant.city,
                });
                expect(merchantResult.length).toBe(1);
                expect(addTransactionSpy).toHaveBeenCalledWith({
                    amountInCents: transactionPayload.centsAmount,
                    date: transactionPayload.dateTime,
                    payee_id: payeeId,
                });
            });
        });

        describe("When the payment is not in ZAR", () => {
            it("Should not save the transaction", async () => {
                // arrange
                const addTransactionSpy = jest.fn();
                mockBudgetProvider(addTransactionSpy);
                const transactionPayload = getRandomInvestecCardTransactionPayload();
                transactionPayload.currencyCode = "USD";

                // act
                await commandExecutor.execute(new CreateBudgetItemFromTransactionCommand(transactionPayload));

                // assert
                const merchantResult = await investecMerchantRepository.find({
                    name: transactionPayload.merchant.name,
                    city: transactionPayload.merchant.city,
                });
                expect(merchantResult.length).toBe(0);
                const transactionResult = await investecTransactionRepository.find({
                    dateTime: transactionPayload.dateTime,
                    centsAmount: transactionPayload.centsAmount,
                });
                expect(transactionResult.length).toBe(0);
                expect(addTransactionSpy).not.toHaveBeenCalled();
            });
        });
    });
});
