import { Node } from './node';
import { DragPoint } from './drag-point';
import { MouseListener } from './mouse-listener';
import { Observable, Subject } from 'rxjs';
import { Identifiable } from '../../../utility/get-by-id';
export declare class Arc extends Identifiable implements MouseListener {
    private readonly _source;
    private readonly _destination;
    private _weight;
    private readonly _breakpoints;
    constructor(id: string, source: Node, destination: Node, weight?: number);
    get sourceId(): string;
    get destinationId(): string;
    get source(): Node;
    get destination(): Node;
    get weight(): number;
    get breakpoints(): Array<DragPoint>;
    set weight(value: number);
    get hasBreakpoints(): boolean;
    get firstBreakpoint(): DragPoint;
    get lastBreakpoint(): DragPoint;
    addBreakpoint(point: DragPoint): void;
    bindEvents(mouseMoved$: Subject<MouseEvent>, mouseUp$: Subject<MouseEvent>, kill$: Observable<void>, redraw$: Subject<void>): void;
}
