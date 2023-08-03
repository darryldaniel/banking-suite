import { BaseRepository } from "./base-repository";
import { YnabPayee } from "../models/ynab-payee";

export class YnabPayeeRepository extends BaseRepository<YnabPayee> {
    constructor() {
        super("ynabPayee");
    }
}
