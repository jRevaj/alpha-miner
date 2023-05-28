import { MapSet } from '../../../../utility/map-set';
export declare class MappingManager {
    private readonly _mappingCounters;
    private readonly _mappingOrder;
    constructor(possibleMappings: MapSet<string, string>);
    getCurrentMapping(): Map<string, string>;
    /**
     * Increments the current mapping to the next possibility.
     *
     * @returns `true` if the final mapping was passed. `false` otherwise.
     */
    moveToNextMapping(): boolean;
}
