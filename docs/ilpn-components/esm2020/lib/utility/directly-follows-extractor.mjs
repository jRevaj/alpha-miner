import { MapSet } from './map-set';
export class DirectlyFollowsExtractor {
    constructor() {
        this._directlyFollows = new MapSet();
    }
    /**
     * Adds a pair to the directly follows relation.
     *
     * @param follows the event that directly follows the predecessor
     * @param predecessor
     */
    add(follows, predecessor) {
        this._directlyFollows.add(follows, predecessor);
    }
    /**
     * Extracts all pairs from the directly follows relation, that only appear in one direction.
     *
     * @returns an array of pairs, where the first element precedes the second element
     * and the two elements don't appear in the opposite order in the relation
     */
    oneWayDirectlyFollows() {
        const oneWayDirectlyFollowsPairs = [];
        for (const entry of this._directlyFollows.entries()) {
            const second = entry[0];
            for (const first of entry[1]) {
                if (!this._directlyFollows.has(first, second)) {
                    oneWayDirectlyFollowsPairs.push([first, second]);
                }
            }
        }
        return oneWayDirectlyFollowsPairs;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0bHktZm9sbG93cy1leHRyYWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvdXRpbGl0eS9kaXJlY3RseS1mb2xsb3dzLWV4dHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBR2pDLE1BQU0sT0FBTyx3QkFBd0I7SUFHakM7UUFDSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLEVBQWtCLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksR0FBRyxDQUFDLE9BQWUsRUFBRSxXQUFtQjtRQUMzQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxxQkFBcUI7UUFDeEIsTUFBTSwwQkFBMEIsR0FBMkMsRUFBRSxDQUFDO1FBQzlFLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2pELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUFFO29CQUMzQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztpQkFDcEQ7YUFDSjtTQUNKO1FBQ0QsT0FBTywwQkFBMEIsQ0FBQztJQUN0QyxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01hcFNldH0gZnJvbSAnLi9tYXAtc2V0JztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRGlyZWN0bHlGb2xsb3dzRXh0cmFjdG9yIHtcclxuICAgIHByaXZhdGUgX2RpcmVjdGx5Rm9sbG93czogTWFwU2V0PHN0cmluZywgc3RyaW5nPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9kaXJlY3RseUZvbGxvd3MgPSBuZXcgTWFwU2V0PHN0cmluZywgc3RyaW5nPigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIHBhaXIgdG8gdGhlIGRpcmVjdGx5IGZvbGxvd3MgcmVsYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGZvbGxvd3MgdGhlIGV2ZW50IHRoYXQgZGlyZWN0bHkgZm9sbG93cyB0aGUgcHJlZGVjZXNzb3JcclxuICAgICAqIEBwYXJhbSBwcmVkZWNlc3NvclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkKGZvbGxvd3M6IHN0cmluZywgcHJlZGVjZXNzb3I6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RpcmVjdGx5Rm9sbG93cy5hZGQoZm9sbG93cywgcHJlZGVjZXNzb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXh0cmFjdHMgYWxsIHBhaXJzIGZyb20gdGhlIGRpcmVjdGx5IGZvbGxvd3MgcmVsYXRpb24sIHRoYXQgb25seSBhcHBlYXIgaW4gb25lIGRpcmVjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBwYWlycywgd2hlcmUgdGhlIGZpcnN0IGVsZW1lbnQgcHJlY2VkZXMgdGhlIHNlY29uZCBlbGVtZW50XHJcbiAgICAgKiBhbmQgdGhlIHR3byBlbGVtZW50cyBkb24ndCBhcHBlYXIgaW4gdGhlIG9wcG9zaXRlIG9yZGVyIGluIHRoZSByZWxhdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25lV2F5RGlyZWN0bHlGb2xsb3dzKCk6IEFycmF5PFtmaXJzdDogc3RyaW5nLCBzZWNvbmQ6IHN0cmluZ10+IHtcclxuICAgICAgICBjb25zdCBvbmVXYXlEaXJlY3RseUZvbGxvd3NQYWlyczogQXJyYXk8W2ZpcnN0OiBzdHJpbmcsIHNlY29uZDogc3RyaW5nXT4gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuX2RpcmVjdGx5Rm9sbG93cy5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kID0gZW50cnlbMF07XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmlyc3Qgb2YgZW50cnlbMV0pIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fZGlyZWN0bHlGb2xsb3dzLmhhcyhmaXJzdCwgc2Vjb25kKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uZVdheURpcmVjdGx5Rm9sbG93c1BhaXJzLnB1c2goW2ZpcnN0LCBzZWNvbmRdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb25lV2F5RGlyZWN0bHlGb2xsb3dzUGFpcnM7XHJcbiAgICB9XHJcbn1cclxuIl19