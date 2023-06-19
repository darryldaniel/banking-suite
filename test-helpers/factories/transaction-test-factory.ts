import { InvestecTransaction } from "../../models/investec-transaction";
import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";
import { InvestecCardTransactionPayload } from "../../models/investec-card-transaction-payload";

export function getRandomInvestecTransaction(): InvestecTransaction {
    return InvestecTransaction.createFromPayload(
        getRandomInvestecCardTransactionPayload(),
        new ObjectId()
    );
}

export function getRandomInvestecCardTransactionPayload(): InvestecCardTransactionPayload {
    const merchantCategoryName = faker.word.words(1);
    const countryCode = faker.location.countryCode({
        variant: "alpha-3",
    });
    return {
        accountNumber: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        dateTime: new Date().toISOString(),
        centsAmount: faker.number.int({ min: 1000, max: 10000 }),
        currencyCode: "zar",
        type: "card",
        reference: faker.company.name(),
        card: {
            id: faker.number.int({ min: 100000, max: 999999 }).toString(),
        },
        merchant: {
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
    };
}
