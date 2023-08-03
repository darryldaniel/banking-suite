import { Bill, IBillData } from "./bill";

export interface ILightsBillData extends IBillData {
    electricity: number;
    rates: number;
}

export class LightsBill extends Bill {
    public readonly type: string = "lights";
    constructor(
        billDate: Date,
        billTotal: number,
        public readonly electricity: number,
        public readonly rates: number,
    ) {
        super(
            billDate,
            billTotal,
            process.env.ETHEKWINI_BENEFICIARY_ID || ""
        );
        this.totalToPay = +(this.billTotal - this.rates).toFixed(2);
    }

    static Create({
        billDate,
        billTotal,
        electricity,
        rates
    }: ILightsBillData) {
        return new LightsBill(
            billDate,
            billTotal,
            electricity,
            rates
        );
    }
}