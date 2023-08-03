import { Client, CustomV1 } from "mindee";

export class MindeeProvider {
    private client: Client;

    constructor(
        accountName: string,
        private readonly endpointName: string
    ) {
        this.client = new Client({ apiKey: process.env.MINDEE_API_KEY || "" })
            .addEndpoint({
                accountName,
                endpointName,
            });
    }

    public async parseDocument<T>(documentPath: string): Promise<T | null> {
        const apiResponse = await this.client
            .docFromPath(documentPath)
            .parse(
                CustomV1,
                {
                    endpointName: this.endpointName,
                });
        const result: any = {};
        const fields = apiResponse.document?.fields;
        if (!fields) {
            return null;
        }
        const keys = Array.from(fields.keys());
        for (const key of keys) {
           result[key] = this.getAndParseValueFromContent(fields.get(key)?.values[0].content);
        }
        return result as T;
    }

    private getAndParseValueFromContent(content: string | number | undefined) {
        // const potentialDate = DateTime.fromISO(content as string);
        // if (potentialDate.isValid) {
        //     return potentialDate.toJSDate();
        // }
        const isDate = /(\d){4}-(\d){1,2}-(\d){1,2}/.test(content as string);
        if (isDate) {
            return content;
        }
        const value = parseFloat((content as string).replace(",", ""));
        if (isNaN(value)) {
            return content;
        }
        return value;
    }

    public static createForLightAccounts() {
        return new MindeeProvider(
            process.env.MINDEE_ACCOUNT_NAME || "",
            process.env.LIGHT_ACCOUNT_ENDPOINT_NAME || "");
    }
}
