export function setOfAllSubsets(original: Set<string>): Set<any> {
    let sets: Set<any> = new Set();
    if (original.size == 0) {
        sets.add(new Set());
        return sets;
    }

    let arr: Array<string> = [];
    original.forEach(e => arr.push(e));
    let head: string = arr[0];
    let rest: Set<string> = new Set(arr.slice(1, arr.length));
    for (let set of setOfAllSubsets(rest)) {
        let newSet: Set<any> = new Set();
        newSet.add(head)
        set.forEach((e: any) => newSet.add(e));
        sets.add(newSet);
        sets.add(set);
    }

    return sets;
}
