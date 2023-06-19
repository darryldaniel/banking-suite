export type InvestecCardMerchantPayload = {
    country: {
        code: string;
        name: string;
        alpha3: string
    };
    city: string;
    name: string;
    category: {
        code: number;
        name: string;
        key: string
    }
}