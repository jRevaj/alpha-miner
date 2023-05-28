import { PetriNet } from '../model/petri-net';
import { AbstractBlockParser } from '../../../utility/abstract-block-parser';
import * as i0 from "@angular/core";
export declare class PetriNetParserService extends AbstractBlockParser<PetriNet> {
    constructor();
    protected newResult(): PetriNet;
    protected resolveBlockParser(block: string): ((lines: Array<string>, result: PetriNet) => void) | undefined;
    private parsePlaces;
    private parseTransitions;
    private parseArcs;
    private extractSourceAndDestination;
    static ɵfac: i0.ɵɵFactoryDeclaration<PetriNetParserService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PetriNetParserService>;
}
