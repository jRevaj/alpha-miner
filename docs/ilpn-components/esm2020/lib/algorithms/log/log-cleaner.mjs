import { Trace } from '../../models/log/model/trace';
import { Lifecycle } from '../../models/log/model/lifecycle';
export class LogCleaner {
    cleanLog(log) {
        return log.map(t => this.cleanTrace(t));
    }
    cleanTrace(trace) {
        const result = new Trace();
        result.name = trace.name;
        result.description = trace.description;
        result.events = trace.events.filter(e => e.lifecycle === undefined || e.lifecycle === Lifecycle.COMPLETE);
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWNsZWFuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvYWxnb3JpdGhtcy9sb2cvbG9nLWNsZWFuZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ25ELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUUzRCxNQUFNLE9BQWdCLFVBQVU7SUFDbEIsUUFBUSxDQUFDLEdBQWlCO1FBQ2hDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRVMsVUFBVSxDQUFDLEtBQVk7UUFDN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDekIsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRyxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1RyYWNlfSBmcm9tICcuLi8uLi9tb2RlbHMvbG9nL21vZGVsL3RyYWNlJztcclxuaW1wb3J0IHtMaWZlY3ljbGV9IGZyb20gJy4uLy4uL21vZGVscy9sb2cvbW9kZWwvbGlmZWN5Y2xlJztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMb2dDbGVhbmVyIHtcclxuICAgIHByb3RlY3RlZCBjbGVhbkxvZyhsb2c6IEFycmF5PFRyYWNlPik6IEFycmF5PFRyYWNlPiB7XHJcbiAgICAgICAgcmV0dXJuIGxvZy5tYXAodCA9PiB0aGlzLmNsZWFuVHJhY2UodCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjbGVhblRyYWNlKHRyYWNlOiBUcmFjZSk6IFRyYWNlIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgVHJhY2UoKTtcclxuICAgICAgICByZXN1bHQubmFtZSA9IHRyYWNlLm5hbWU7XHJcbiAgICAgICAgcmVzdWx0LmRlc2NyaXB0aW9uID0gdHJhY2UuZGVzY3JpcHRpb247XHJcbiAgICAgICAgcmVzdWx0LmV2ZW50cyA9IHRyYWNlLmV2ZW50cy5maWx0ZXIoZSA9PiBlLmxpZmVjeWNsZSA9PT0gdW5kZWZpbmVkIHx8IGUubGlmZWN5Y2xlID09PSBMaWZlY3ljbGUuQ09NUExFVEUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn1cclxuIl19