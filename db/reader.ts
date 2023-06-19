import { ObjectId } from "mongodb";

export interface IReader<T> {
    find(filter: Partial<T>): Promise<T[]>;
    findById(id: ObjectId): Promise<T | null>;
}
