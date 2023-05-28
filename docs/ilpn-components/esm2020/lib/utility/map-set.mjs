import { iterate } from './iterate';
export class MapSet {
    constructor() {
        this._map = new Map();
    }
    add(key, value) {
        if (this._map.has(key)) {
            this._map.get(key).add(value);
        }
        else {
            this._map.set(key, new Set([value]));
        }
    }
    addAll(key, values) {
        if (this._map.has(key)) {
            const set = this._map.get(key);
            iterate(values, v => {
                set.add(v);
            });
        }
        else {
            this._map.set(key, new Set(values));
        }
    }
    has(key, value) {
        return this._map.has(key) && this._map.get(key).has(value);
    }
    get(key) {
        const set = this._map.get(key);
        if (set === undefined) {
            return new Set();
        }
        return set;
    }
    entries() {
        return this._map.entries();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXNldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi91dGlsaXR5L21hcC1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQyxNQUFNLE9BQU8sTUFBTTtJQUdmO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDO0lBQ3JDLENBQUM7SUFFTSxHQUFHLENBQUMsR0FBTSxFQUFFLEtBQVE7UUFDdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEM7YUFBTTtZQUNILElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQztJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMsR0FBTSxFQUFFLE1BQW1CO1FBQ3JDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFFLENBQUM7WUFDaEMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0wsQ0FBQztJQUVNLEdBQUcsQ0FBQyxHQUFNLEVBQUUsS0FBUTtRQUN2QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRU0sR0FBRyxDQUFDLEdBQU07UUFDYixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDbkIsT0FBTyxJQUFJLEdBQUcsRUFBSyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRU0sT0FBTztRQUNWLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvQixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2l0ZXJhdGV9IGZyb20gJy4vaXRlcmF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTWFwU2V0PEssIFY+IHtcclxuICAgIHByaXZhdGUgX21hcDogTWFwPEssIFNldDxWPj47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwID0gbmV3IE1hcDxLLCBTZXQ8Vj4+KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZChrZXk6IEssIHZhbHVlOiBWKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX21hcC5oYXMoa2V5KSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXAuZ2V0KGtleSkhLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFwLnNldChrZXksIG5ldyBTZXQ8Vj4oW3ZhbHVlXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQWxsKGtleTogSywgdmFsdWVzOiBJdGVyYWJsZTxWPikge1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXAuaGFzKGtleSkpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2V0ID0gdGhpcy5fbWFwLmdldChrZXkpITtcclxuICAgICAgICAgICAgaXRlcmF0ZSh2YWx1ZXMsIHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0LmFkZCh2KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFwLnNldChrZXksIG5ldyBTZXQodmFsdWVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXMoa2V5OiBLLCB2YWx1ZTogVikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXAuaGFzKGtleSkgJiYgdGhpcy5fbWFwLmdldChrZXkpIS5oYXModmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQoa2V5OiBLKTogU2V0PFY+IHtcclxuICAgICAgICBjb25zdCBzZXQgPSB0aGlzLl9tYXAuZ2V0KGtleSk7XHJcbiAgICAgICAgaWYgKHNldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU2V0PFY+KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudHJpZXMoKTogSXRlcmFibGVJdGVyYXRvcjxbSywgU2V0PFY+XT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXAuZW50cmllcygpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==