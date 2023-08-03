import { Command } from "../cqrs/command";
import { MindeeProvider } from "../ocr/mindee-provider";
import { LightsBill } from "../models/lights-bill";
import { BillRepository } from "../db/bill-repository";

interface LightBillParsedData {
    date: string;
    electricity: number;
    rates: number;
    total: number;
}

export class SaveLightBillCommand extends Command<void> {
    constructor(private readonly documentPath: string) {
        super();
    }
    
    public async execute(): Promise<void> {
        const mindee = MindeeProvider.createForLightAccounts();
        const result = await mindee.parseDocument<LightBillParsedData>(this.documentPath);
        if (!result) {
            return;
        }
        const { date, electricity, rates, total } = result;
        const bill = LightsBill.Create({
            billDate: date,
            electricity: electricity,
            rates: rates,
            billTotal: total,
        });
        const billRepository = new BillRepository();
        await billRepository.create(bill);
    }
}