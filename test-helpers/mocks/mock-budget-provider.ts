import { jest } from "@jest/globals";

export const mockAddTransaction = jest.fn();

export const mockBudgetProvider = {
    addTransaction: mockAddTransaction
}
