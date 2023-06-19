import { faker } from "@faker-js/faker";
import { Merchant } from "../models/merchant";
import { describe, expect, it } from "@jest/globals";

describe("Merchant", () => {
    describe("create",  () => {
        it("should create a new merchant object with given data", () => {
            // arrange
            const merchantCategoryName = faker.word.words(1)
            const countryCode = faker.location.countryCode({
                variant: "alpha-3",
            })
            const merchantData = {
                category: {
                    code: faker.number.int({ min: 1000, max: 9999 }),
                    key: merchantCategoryName.toLowerCase(),
                    name: merchantCategoryName
                },
                name: faker.company.name(),
                city: faker.location.city(),
                country: {
                    code: countryCode.substring(0, 2),
                    alpha3: countryCode,
                    name: faker.location.country()
                }
            }

            // act
            const merchant = Merchant.create(merchantData);

            // assert
            expect(merchant).toEqual({
                name: merchantData.name,
                city: merchantData.city,
                country: merchantData.country,
                category: merchantData.category
            });
        });
    });
});
