import { Trace } from '../model/trace';
import * as i0 from "@angular/core";
export declare class XesLogParserService {
    constructor();
    parse(text: string): Array<Trace>;
    private parseTraces;
    private parseTrace;
    private createTrace;
    private parseEvent;
    private parseKeyValue;
    private getAndRemove;
    private setIfPresent;
    static ɵfac: i0.ɵɵFactoryDeclaration<XesLogParserService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<XesLogParserService>;
}
