import { BaseRepository } from "./base-repository";
import { Bill } from "../models/bill";

export class BillRepository extends BaseRepository<Bill> {
    constructor() {
        super("bills");
    }
}
