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
var MatchModule = (function (_super) {
    __extends(MatchModule, _super);
    function MatchModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatchModule.prototype.CreateView = function () {
        var view = new MatchView();
        view.CreateView();
        this.gameViewList.push(view);
        _super.prototype.Init.call(this);
        return true;
    };
    MatchModule.prototype.SwitchForeOrBack = function (from, to) {
        this.isForeground = to == GameStateType.Match;
    };
    return MatchModule;
}(GameViewModule));
__reflect(MatchModule.prototype, "MatchModule");
//# sourceMappingURL=MatchModule.js.map