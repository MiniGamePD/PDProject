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
var MatchMgr = (function (_super) {
    __extends(MatchMgr, _super);
    function MatchMgr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatchMgr.prototype.Init = function () {
        return true;
    };
    MatchMgr.prototype.Update = function (deltaTime) {
    };
    MatchMgr.prototype.Release = function () {
    };
    return MatchMgr;
}(ModuleBase));
__reflect(MatchMgr.prototype, "MatchMgr", ["IMatchMgr", "IModule"]);
//# sourceMappingURL=MatchMgr.js.map