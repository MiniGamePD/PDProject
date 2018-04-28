var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ModuleBase = (function () {
    function ModuleBase() {
    }
    ModuleBase.prototype.Init = function () {
        return true;
    };
    ModuleBase.prototype.Update = function (deltaTime) {
    };
    ModuleBase.prototype.Release = function () {
    };
    ModuleBase.prototype.OnGameStateChange = function (from, to) {
    };
    return ModuleBase;
}());
__reflect(ModuleBase.prototype, "ModuleBase");
//# sourceMappingURL=ModuleBase.js.map