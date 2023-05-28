export class DropFile {
    constructor(name, content, suffix) {
        this.content = content;
        this.extractSuffix(name);
        if (suffix !== undefined) {
            this._suffix = suffix;
        }
    }
    get name() {
        return `${this._name}.${this.suffix}`;
    }
    set name(name) {
        this.extractSuffix(name);
    }
    get suffix() {
        return this._suffix;
    }
    set suffix(value) {
        this._suffix = value;
    }
    extractSuffix(name) {
        const parts = name.split('.');
        if (parts.length === 1) {
            this._name = name;
            this._suffix = '';
        }
        else {
            this._suffix = parts.splice(-1)[0];
            this._name = parts.join('.');
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC1maWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL3V0aWxpdHkvZHJvcC1maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxRQUFRO0lBS2pCLFlBQVksSUFBWSxFQUFrQixPQUFlLEVBQUUsTUFBZTtRQUFoQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ3JELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUVELElBQUksSUFBSTtRQUNKLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsSUFBWTtRQUNqQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQWE7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVPLGFBQWEsQ0FBQyxJQUFZO1FBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztTQUNyQjthQUFNO1lBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIERyb3BGaWxlIHtcclxuXHJcbiAgICBwcml2YXRlIF9uYW1lITogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfc3VmZml4ITogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcHVibGljIHJlYWRvbmx5IGNvbnRlbnQ6IHN0cmluZywgc3VmZml4Pzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5leHRyYWN0U3VmZml4KG5hbWUpO1xyXG4gICAgICAgIGlmIChzdWZmaXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWZmaXggPSBzdWZmaXg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuX25hbWV9LiR7dGhpcy5zdWZmaXh9YDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbmFtZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmV4dHJhY3RTdWZmaXgobmFtZSlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc3VmZml4KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1ZmZpeDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3VmZml4KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9zdWZmaXggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4dHJhY3RTdWZmaXgobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgcGFydHMgPSBuYW1lLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgdGhpcy5fc3VmZml4ID0gJyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fc3VmZml4ID0gcGFydHMuc3BsaWNlKC0xKVswXTtcclxuICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHBhcnRzLmpvaW4oJy4nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19