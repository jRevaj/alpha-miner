import { PetriNet } from '../../../../models/pn/model/petri-net';
import { Region } from './region';
export declare class RegionSynthesiser {
    private _regions;
    private _counter;
    constructor();
    addRegion(region: Region): void;
    synthesise(): PetriNet;
    private transition;
    private computeGradient;
    private addArc;
    private isEquivalentPlaceInNet;
}
