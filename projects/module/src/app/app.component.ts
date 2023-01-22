import {Component, OnDestroy} from '@angular/core';
import {
    FD_LOG,
    FD_PETRI_NET,
} from '../../../components/src/lib/components/layout/file-display';
import {Trace} from '../../../components/src/lib/models/log/model/trace';
import {XesLogParserService} from '../../../components/src/lib/models/log/parser/xes-log-parser.service';
import {PetriNet} from '../../../components/src/lib/models/pn/model/petri-net';
import {Subscription} from "rxjs";
import {AlphaMinerService} from "./services/alpha-miner.service";
import {AlgorithmResult} from "../../../components/src/lib/utility/algorithm-result";
import {
    PetriNetSerialisationService
} from "../../../components/src/lib/models/pn/parser/petri-net-serialisation.service";
import {DropFile} from "../../../components/src/lib/utility/drop-file";
import {NetAndReport} from "../../../components/src/lib/algorithms/pn/synthesis/model/net-and-report";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    public fdLog = FD_LOG;
    public fdPn = FD_PETRI_NET;
    public log: Array<Trace> = [];
    public petriNet: DropFile | undefined = undefined;
    public report: DropFile | undefined = undefined;
    public processing = false;

    private _sub: Subscription | undefined;

    constructor(
        private _parser: XesLogParserService,
        private _miner: AlphaMinerService,
        private _serializer: PetriNetSerialisationService,
    ) {
    }

    ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }

    public processLog(files: Array<DropFile>) {
        this.processing = true;
        this.petriNet = undefined;

        this.log = this._parser.parse(files[0].content);

        // filter out start events
        // this.log.map((trace) => {
        //     for (let i = 0; i < trace.events.length; i++) {
        //         let event = trace.events[i];
        //         if (event.lifecycle != "complete") {
        //             trace.events.splice(i, 1);
        //         }
        //     }
        // })

        console.log("filtered log: ", this.log);

        // count num of traces
        const iterations = `number of traces: ${this.log.length}`;
        console.log(iterations);

        const start = performance.now();
        this._sub = this._miner.mine(this.log).subscribe((r: PetriNet) => {
            const stop = performance.now();
            const report = new AlgorithmResult('Alpha miner', start, stop);
            report.addOutputLine(iterations);
            r.report.forEach(l => report.addOutputLine(l));
            this.petriNet = new DropFile('model.pn', this._serializer.serialise(r.net));
            this.report = report.toDropFile('report.txt');
            this.processing = false;
        });
    }
}
