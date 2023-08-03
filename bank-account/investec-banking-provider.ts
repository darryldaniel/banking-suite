import { Account, Client } from "investec-api";

export class InvestecBankingProvider {
    private client: Client | undefined;

    private async init() {
        this.client = await Client.create(
            process.env.INVESTEC_API_ID || "",
            process.env.INVESTEC_API_SECRET || "",
            process.env.INVESTEC_API_KEY || "",
        );
        await this.client.authenticate();
    }

    public async getAccounts(): Promise<Account[]> {
        try {
            const result = await this.client?.getAccounts("private");
            return Array.from(result?.values() || []);
        } catch (e) {
            console.error(e);
        }
        return [];
    }

    public async getBeneficiaries() {
        const result = await this.client?.getBeneficiaries();
        return Array.from(result?.values() || []);
    }

    public static async Create() {
        const investec = new InvestecBankingProvider();
        await investec.init();
        return investec;
    }
}
