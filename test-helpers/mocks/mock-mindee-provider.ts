import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

export const mockCustomV1 = faker.string.alpha();
export const mockParse = jest.fn();
export const mockDocFromPath = jest.fn().mockReturnValue({
    parse: mockParse
});
export const mockClient = {
    docFromPath: mockDocFromPath
}
export const mockAddEndpoint = jest.fn().mockReturnValue(mockClient);

const mockMindee = {
    Client: jest.fn().mockImplementation(() => ({
        addEndpoint: mockAddEndpoint,
    })),
    CustomV1: mockCustomV1
}

jest.doMock("mindee", () => mockMindee);
