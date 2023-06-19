import { MongoClient } from "mongodb";

let mongoClient: MongoClient | undefined;

export function GetMongoDBConnection(collectionName: string) {
    if (!mongoClient) {
        mongoClient = new MongoClient(process.env.MONGODB_URI || "");
    }
    return mongoClient.db(process.env.DB_NAME).collection(collectionName);
}

export async function destroy() {
    if (mongoClient) {
        await mongoClient.close();
        mongoClient = undefined;
    }
}
