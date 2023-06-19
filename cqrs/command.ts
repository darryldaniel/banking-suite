export abstract class Command<T> {
    public validate(): Promise<void> {
        return Promise.resolve();
    }
    public abstract execute(): Promise<T | void>;
}