import { Trace } from '../../models/log/model/trace';
export declare abstract class LogCleaner {
    protected cleanLog(log: Array<Trace>): Array<Trace>;
    protected cleanTrace(trace: Trace): Trace;
}
