var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ControlableElement = (function () {
    function ControlableElement() {
        this.targets = [];
        this.targetsFilled = false;
    }
    ControlableElement.prototype.GetControledElements = function () {
        if (!this.targetsFilled) {
            this.FillTargets();
            this.targetsFilled = true;
        }
        return this.targets;
    };
    return ControlableElement;
}());
__reflect(ControlableElement.prototype, "ControlableElement");
//# sourceMappingURL=ControlableElement.js.map