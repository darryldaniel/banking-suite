import { InvestecCardMerchantPayload } from "./investec-card-merchant-payload";

export type InvestecCardTransactionPayload = {
    dateTime: string;
    reference: string;
    centsAmount: number;
    accountNumber: string;
    type: string;
    currencyCode: string;
    card: { id: string }
    merchant: InvestecCardMerchantPayload;
}
