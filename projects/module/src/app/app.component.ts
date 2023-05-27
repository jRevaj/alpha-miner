import {Component, OnDestroy} from '@angular/core';
import {FD_LOG, FD_PETRI_NET, DropFile} from 'ilpn-components';
import {AlphaMinerService} from "./services/alpha-miner.service";
import {Subscription} from "rxjs";
import {Trace} from "../../../components/src/lib/models/log/model/trace";
import {XesLogParserService} from "../../../components/src/lib/models/log/parser/xes-log-parser.service";
import {
    PetriNetSerialisationService
} from "../../../components/src/lib/models/pn/parser/petri-net-serialisation.service";
import {AlgorithmResult} from "../../../components/src/lib/utility/algorithm-result";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    public fdLog = FD_LOG;
    public fdPN = FD_PETRI_NET;

    public log: Array<Trace> | undefined;
    public pnResult: DropFile | undefined = undefined;
    public reportResult: DropFile | undefined = undefined;
    public processing = false;

    private _sub: Subscription | undefined;

    constructor(private _logParser: XesLogParserService,
                private _netSerializer: PetriNetSerialisationService,
                private _miner: AlphaMinerService) {
    }

    ngOnDestroy(): void {
        this._sub?.unsubscribe()
    }

    /**
     * Main module method that processes log file, discovers Petri net and generates result files
     * @param files - array of files dropped on the module
     */
    public processLog(files: Array<DropFile>): void {
        this.processing = true;

        this.log = this._logParser.parse(files[0].content);
        console.debug(this.log);

        const runs = `Number of traces: ${this.log.length}`;

        // solve petri net
        const start = performance.now();
        const minerResult = this._miner.mine(this.log);
        const stop = performance.now();

        // compose report
        const report = new AlgorithmResult('Alpha Miner', start, stop);
        report.addOutputLine(runs);
        minerResult.report.forEach(l => report.addOutputLine(l));

        // generate result files
        this.pnResult = new DropFile('model.pn', this._netSerializer.serialise(minerResult.net));

        this.reportResult = new DropFile('report.txt', report.serialise());

        this.processing = false;
    }
}
