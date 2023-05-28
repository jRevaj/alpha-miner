export declare class DirectlyFollowsExtractor {
    private _directlyFollows;
    constructor();
    /**
     * Adds a pair to the directly follows relation.
     *
     * @param follows the event that directly follows the predecessor
     * @param predecessor
     */
    add(follows: string, predecessor: string): void;
    /**
     * Extracts all pairs from the directly follows relation, that only appear in one direction.
     *
     * @returns an array of pairs, where the first element precedes the second element
     * and the two elements don't appear in the opposite order in the relation
     */
    oneWayDirectlyFollows(): Array<[first: string, second: string]>;
}
