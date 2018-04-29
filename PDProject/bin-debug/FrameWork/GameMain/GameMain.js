var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameMain = (function () {
    function GameMain() {
    }
    //创建单例
    GameMain.CreatInstance = function (egretMain) {
        if (!GameMain.HasInstance()) {
            GameMain.msInstance = new GameMain();
            GameMain.msInstance.mEgretMain = egretMain;
            return true;
        }
        else {
            return false;
        }
    };
    //是否存在单例
    GameMain.HasInstance = function () {
        return GameMain.msInstance != null;
    };
    //获取单例
    GameMain.GetInstance = function () {
        return GameMain.msInstance;
    };
    //初始化
    GameMain.prototype.Init = function (stage) {
        this.GameStage = stage;
        this.mStateMgr = new StateMgr();
        this.mStateMgr.Init();
        this.mModuleMgr = new ModuleMgr();
        this.mModuleMgr.Init();
        this.SwitchGameState(GameStateType.Lobby);
    };
    //更新
    GameMain.prototype.Update = function (deltaTime) {
        if (this.mStateMgr != null) {
            this.mStateMgr.Update(deltaTime);
        }
        if (this.mModuleMgr != null) {
            this.mModuleMgr.Update(deltaTime);
        }
    };
    //释放
    GameMain.prototype.Release = function () {
        if (this.mStateMgr != null) {
            this.mStateMgr.Release();
        }
        if (this.mModuleMgr != null) {
            this.mModuleMgr.Release();
        }
    };
    GameMain.prototype.GetGameStage = function () {
        return this.GameStage;
    };
    GameMain.prototype.GetCureGameState = function () {
        if (this.mStateMgr != null) {
            return this.mStateMgr.CurGameState();
        }
        return GameStateType.Init;
    };
    GameMain.prototype.SwitchGameState = function (toState) {
        var hasSwitch = false;
        if (this.mStateMgr != null) {
            var fromState = this.mStateMgr.CurGameState();
            if (fromState != toState) {
                hasSwitch = this.mStateMgr.SwitchGameState(toState);
                if (hasSwitch && this.mModuleMgr != null) {
                    this.mModuleMgr.OnGameStateChange(fromState, toState);
                }
            }
        }
        return hasSwitch;
    };
    GameMain.prototype.GetModule = function (moduleType) {
        if (this.mModuleMgr != null) {
            return this.mModuleMgr.GetModule(moduleType);
        }
        return null;
    };
    GameMain.prototype.GetEgretMain = function () {
        return this.mEgretMain;
    };
    GameMain.prototype.DispatchEvent = function (event) {
        if (this.mEgretMain.hasEventListener(event.$type)) {
            console.log(event.$type + " dispatch event " + this.mEgretMain.willTrigger(event.$type));
            this.mEgretMain.dispatchEvent(event);
        }
        else {
            console.log(event.$type + " has no lisenter");
        }
    };
    GameMain.prototype.AddEventListener = function (type, listener, thisObject, useCapture, priority) {
        this.mEgretMain.addEventListener(type, listener, thisObject, useCapture, priority);
    };
    GameMain.prototype.RemoveEventListener = function (type, listener, thisObject, useCapture) {
        this.mEgretMain.removeEventListener(type, listener, thisObject, useCapture);
    };
    GameMain.prototype.GetStageWidth = function () {
        return this.GameStage.stageWidth;
    };
    GameMain.prototype.GetStageHeight = function () {
        return this.GameStage.stageHeight;
    };
    return GameMain;
}());
__reflect(GameMain.prototype, "GameMain", ["IGameMain"]);
//# sourceMappingURL=GameMain.js.map