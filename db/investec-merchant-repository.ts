import { BaseRepository } from "./base-repository";
import { Merchant } from "../models/merchant";

export class InvestecMerchantRepository extends BaseRepository<Merchant> {
    constructor() {
        super("merchants");
    }
}