import { Bill, IBillData } from "../../models/bill";
import { faker } from "@faker-js/faker";
import { ILightsBillData } from "../../models/lights-bill";
import { DateTime } from "luxon";

export function getRandomBill(): Bill {
    return Bill.Create(getRandomBillData());
}

export function getRandomBillData(): IBillData {
    return {
        billDate: DateTime.fromJSDate(faker.date.recent()).toFormat("yyyy-MM-dd"),
        billTotal: +faker.number.float({ min: 100, max: 1000 }).toFixed(2),
        beneficiaryId: faker.string.alpha()
    }
}

export function getRandomLightsBillData(): ILightsBillData {
    return {
        ...getRandomBillData(),
        electricity: +faker.number.float({ min: 100, max: 1000 }).toFixed(2),
        rates: +faker.number.float({ min: 100, max: 1000 }).toFixed(2),
    }
}