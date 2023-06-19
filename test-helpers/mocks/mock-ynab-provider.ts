import { jest } from "@jest/globals";

export const mockCreateTransaction = jest.fn();

const mockYnab = {
    API: jest.fn().mockImplementation(() => ({
        transactions: {
            createTransaction: mockCreateTransaction
        }
    }))
}

jest.doMock("ynab", () => mockYnab);
