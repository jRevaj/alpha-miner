/**
 * Enum for relation between two tasks
 */
export enum Relation {
    PRECEDES = ">",
    FOLLOWS = "<",
    PARALLEL = "|",
    NOT_CONNECTED = "#",
}
