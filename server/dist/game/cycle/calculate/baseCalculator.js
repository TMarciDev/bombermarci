"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCalculator = void 0;
const gameBaseClasses_1 = require("../../gameBaseClasses");
class BaseCalculator extends gameBaseClasses_1.GameHandler {
    constructor(state) {
        super(state);
        this.state = state;
        /**
         * The base calculator function that will be inherited
         * @param client The connected socket if there is any
         */
        this.calculate = (client) => { };
    }
}
exports.BaseCalculator = BaseCalculator;
