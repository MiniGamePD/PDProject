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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //##############游戏逻辑##################
        _this.matchState = MatchState.None;
        return _this;
        //#######################################
    }
    MatchModule.prototype.CreateView = function () {
        this.matchData = new MatchData();
        this.matchData.Init();
        var view = new MatchView();
        view.SetMatchData(this.matchData);
        view.CreateView();
        this.gameViewList.push(view);
        this.matchState = MatchState.Init;
        return true;
    };
    MatchModule.prototype.Release = function () {
        this.matchData = null;
    };
    MatchModule.prototype.SwitchForeOrBack = function (from, to) {
        this.isForeground = to == GameStateType.Match;
    };
    MatchModule.prototype.Update = function (deltaTime) {
        //这里只处理match data的变化, view会根据data的变化进行绘制内容的更新
        switch (this.matchState) {
            case MatchState.Init:
                this.UpdateInitState();
                break;
            case MatchState.PlayerControl:
                this.UpdatePlayerControlState(deltaTime);
                break;
            case MatchState.Eliminate:
                this.UpdateEliminateState();
                break;
            case MatchState.GameOver:
                this.UpdateGameOverState();
                break;
            default:
                break;
        }
        _super.prototype.Update.call(this, deltaTime);
    };
    MatchModule.prototype.UpdateInitState = function () {
        //TODO:处理初始细菌出现的过程
        this.OnChangeToPlayerControlState();
        this.matchState = MatchState.PlayerControl;
    };
    MatchModule.prototype.OnChangeToInitState = function () {
    };
    MatchModule.prototype.UpdatePlayerControlState = function (deltaTime) {
        this.pillDropdownTimer += deltaTime;
        if (this.pillDropdownTimer >= MatchModule.PillDropdownInterval) {
            //即使时间很长，超过两个MatchModule.PillDropdownInterval，也还是移动一格，否则卡了，就忽然间下降很多，体验不好
            this.pillDropdownTimer = 0;
            if (!this.matchData.TryDropdownPill()) {
                //下落到不能再下落了，就进入消除状态
                this.OnChangeToEliminateState();
                this.matchState = MatchState.Eliminate;
            }
        }
    };
    MatchModule.prototype.OnChangeToPlayerControlState = function () {
        if (!this.matchData.TryCreatePill()) {
            this.OnChangeToGameOverState();
            this.matchState = MatchState.GameOver;
        }
        else {
            this.pillDropdownTimer = 0;
        }
    };
    MatchModule.prototype.UpdateEliminateState = function () {
        //TODO:处理消除的逻辑
        this.OnChangeToPlayerControlState();
        this.matchState = MatchState.PlayerControl;
    };
    MatchModule.prototype.OnChangeToEliminateState = function () {
    };
    MatchModule.prototype.UpdateGameOverState = function () {
    };
    MatchModule.prototype.OnChangeToGameOverState = function () {
    };
    MatchModule.PillDropdownInterval = 500; //每隔多久药丸下落一格
    return MatchModule;
}(GameViewModule));
__reflect(MatchModule.prototype, "MatchModule");
var MatchState;
(function (MatchState) {
    MatchState[MatchState["None"] = 0] = "None";
    MatchState[MatchState["Init"] = 1] = "Init";
    MatchState[MatchState["PlayerControl"] = 2] = "PlayerControl";
    MatchState[MatchState["Eliminate"] = 3] = "Eliminate";
    MatchState[MatchState["GameOver"] = 4] = "GameOver"; //拜拜了
})(MatchState || (MatchState = {}));
//# sourceMappingURL=MatchModule.js.map