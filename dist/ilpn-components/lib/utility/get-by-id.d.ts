export declare abstract class Identifiable {
    private _id;
    protected constructor(id?: string);
    get id(): string | undefined;
    set id(value: string | undefined);
    getId(): string;
}
export declare function getById<T extends Identifiable>(map: Map<string, T>, object: T | string): T | undefined;
