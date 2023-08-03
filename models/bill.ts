import { Entity } from "./entity";
import { DateTime } from "luxon";

export interface IBillData {
    billDate: string;
    billTotal: number;
    beneficiaryId?: string;
}

export class Bill extends Entity {
    public readonly isApproved: boolean = false;
    public readonly datePaid: Date | null = null;
    public totalToPay: number;
    public readonly type: string = "";

    constructor(
        public readonly billDate: Date,
        public readonly billTotal: number,
        public readonly beneficiaryId: string
    ) {
        super();
        this.totalToPay = billTotal;
    }

    static Create({
        billDate,
        billTotal,
        beneficiaryId
    }: IBillData) {
        return new Bill(
            DateTime.fromFormat(billDate, "yyyy-MM-dd").toJSDate(),
            billTotal,
            beneficiaryId || ""
        );
    }
}
