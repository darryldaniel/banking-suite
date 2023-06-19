import {Collection, MongoClient, ObjectId} from "mongodb";
import {Entity} from "../models/entity";
import { destroy, GetMongoDBConnection } from "./mongoConnectionFactory";
import { IWriter } from "./writer";
import { IReader } from "./reader";

export class BaseRepository<T extends Entity> implements IReader<T>, IWriter<T> {
    public collection: Collection;

    protected constructor(collectionName: string) {
        this.collection = GetMongoDBConnection(collectionName);
    }

    public async find(filter: Partial<T>): Promise<T[]> {
        return await this.collection.find(filter).toArray() as T[];
    }

    public async create(entity: T): Promise<ObjectId> {
        const result = await this.collection.insertOne(entity);
        return result.insertedId;
    }

    public async findById(id: ObjectId): Promise<T | null> {
        const result = await this.collection.findOne({_id: id});
        return result as T | null;
    }

    public async deleteById(id: ObjectId): Promise<boolean> {
        const result = await this.collection.deleteOne({_id: id});
        return result.deletedCount === 1;
    }

    public async close(): Promise<void> {
        await destroy();
    }
}
