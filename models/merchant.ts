import { InvestecCardMerchantPayload } from "./investec-card-merchant-payload";
import { Entity } from "./entity";

export class Merchant extends Entity {
    public payeeId: string | undefined;

    constructor(
        public readonly name: string,
        public readonly city: string,
        public readonly category: MerchantCategory,
        public readonly country: MerchantCountry
    ) {
        super();
    }

    static create({
        country,
        city,
        name,
        category
    }: InvestecCardMerchantPayload) {
        return new Merchant(
            name,
            city,
            category,
            country
        );
    }
}

export type MerchantCategory = {
    code: number;
    name: string;
    key: string
}

export type MerchantCountry = {
    code: string;
    name: string;
    alpha3: string
}