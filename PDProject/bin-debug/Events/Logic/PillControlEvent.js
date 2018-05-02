var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var PillControlEvent = (function (_super) {
    __extends(PillControlEvent, _super);
    function PillControlEvent(bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        return _super.call(this, PillControlEvent.EventName, bubbles, cancelable) || this;
    }
    PillControlEvent.EventName = "PillControlEvent";
    return PillControlEvent;
}(egret.Event));
__reflect(PillControlEvent.prototype, "PillControlEvent");
var PillControlType;
(function (PillControlType) {
    PillControlType[PillControlType["Create"] = 0] = "Create";
    PillControlType[PillControlType["MoveLeft"] = 1] = "MoveLeft";
    PillControlType[PillControlType["MoveRight"] = 2] = "MoveRight";
    PillControlType[PillControlType["DropDown"] = 3] = "DropDown";
    PillControlType[PillControlType["Rotation"] = 4] = "Rotation";
})(PillControlType || (PillControlType = {}));
//# sourceMappingURL=PillControlEvent.js.map