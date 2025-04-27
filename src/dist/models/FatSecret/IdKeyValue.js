"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdKeyValue {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.value = data.value !== undefined || data.value === -1
            ? undefined
            : (data.value === 1 ? true : false);
    }
}
exports.default = IdKeyValue;
