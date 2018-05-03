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
        _this.matchState = MatchState.None;
        return _this;
    }
    MatchModule.prototype.CreateView = function () {
        GameMain.GetInstance().AddEventListener(PlayerControlFinishEvent.EventName, this.OnPlayerControlFinish, this);
        GameMain.GetInstance().AddEventListener(SceneEliminateFinishEvent.EventName, this.OnSceneElininateFinish, this);
        GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);
        this.scene = new Scene();
        this.scene.Init();
        var view = new MatchView();
        view.SetScene(this.scene);
        view.CreateView();
        this.gameViewList.push(view);
        this.playerControl = new PlayerControl();
        this.playerControl.Init();
        //TODO:应该先从Init事件开始
        this.OnInitFinish();
        return true;
    };
    MatchModule.prototype.ReleaseView = function () {
        _super.prototype.ReleaseView.call(this);
        this.scene.Release();
        this.scene = null;
        this.playerControl.Release();
        this.playerControl = null;
        GameMain.GetInstance().RemoveEventListener(PlayerControlFinishEvent.EventName, this.OnPlayerControlFinish, this);
        GameMain.GetInstance().RemoveEventListener(SceneEliminateFinishEvent.EventName, this.OnSceneElininateFinish, this);
        GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOver, this);
    };
    MatchModule.prototype.SwitchForeOrBack = function (from, to) {
        this.isForeground = to == GameStateType.Match;
    };
    MatchModule.prototype.Update = function (deltaTime) {
        _super.prototype.Update.call(this, deltaTime);
        this.scene.Update(deltaTime);
        this.playerControl.Update(deltaTime);
    };
    MatchModule.prototype.OnInitFinish = function () {
        this.matchState = MatchState.PlayerControl;
        var pill = new Pill(); //TODO
        this.playerControl.SetTarget(pill);
        this.playerControl.Work();
        this.scene.Sleep();
    };
    MatchModule.prototype.OnPlayerControlFinish = function (event) {
        this.matchState = MatchState.Eliminate;
        this.playerControl.Sleep();
        this.scene.Work();
    };
    MatchModule.prototype.OnSceneElininateFinish = function (event) {
        this.matchState = MatchState.PlayerControl;
        var pill = new Pill(); //TODO
        this.playerControl.SetTarget(pill);
        this.playerControl.Work();
        this.scene.Sleep();
    };
    MatchModule.prototype.OnGameOver = function (event) {
    };
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
