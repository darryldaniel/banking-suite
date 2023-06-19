import { BaseRepository } from "./base-repository";
import { InvestecTransaction } from "../models/investec-transaction";

export class InvestecTransactionRepository extends BaseRepository<InvestecTransaction> {
    constructor() {
        super("transactions");
    }
}
