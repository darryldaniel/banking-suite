import { Entity } from "./entity";
import { Payee } from "ynab";

export class YnabPayee extends Entity {
    constructor(
        public readonly ynabId: string,
        public readonly name: string,
    ) {
        super();
    }

    static Create(ynabPayee: Payee) {
        return new YnabPayee(ynabPayee.id, ynabPayee.name);
    }
}
