import { jest } from "@jest/globals";

export const mockExecute = jest.fn();

export const mockCommandExecutor = {
    execute: mockExecute
}
