export declare class MaxFlowPreflowN3 {
    private readonly n;
    private readonly cap;
    constructor(n: number);
    setCap(i: number, j: number, cap: number): void;
    setUnbounded(i: number, j: number): void;
    getCap(i: number, j: number): number;
    maxFlow(s: number, t: number): number;
}
