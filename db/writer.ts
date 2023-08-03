import { ObjectId } from "mongodb";
import { Entity } from "../models/entity";

export interface IWriter<T extends Entity> {
    create(entity: T): Promise<ObjectId>;
    createMany(entities: T[]): Promise<ObjectId[]>;
    deleteById(id: ObjectId): Promise<boolean>;
}