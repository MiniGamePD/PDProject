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
var InputModule = (function (_super) {
    __extends(InputModule, _super);
    function InputModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InputModule.prototype.Init = function () {
        this.isForeground = true;
        var stageWidth = GameMain.GetInstance().GetStageWidth();
        var stageHeight = GameMain.GetInstance().GetStageHeight();
        this.mMoveEventMinDisX = stageWidth * INPUT_MOVE_EVENT_DIS_RATE;
        this.mMoveEventMinDisY = stageHeight * INPUT_MOVE_EVENT_DIS_RATE;
        this.RegisterTouchEvent();
        this.InitKey();
        return true;
    };
    InputModule.prototype.InitKey = function () {
        this.mKeyState = [];
        for (var i = 0; i < InputKey.Max; ++i) {
            this.mKeyState.push(false);
        }
    };
    InputModule.prototype.ClearKey = function () {
        for (var i = 0; i < InputKey.Max; ++i) {
            this.mKeyState[i] = false;
        }
    };
    InputModule.prototype.InputKey = function (key, stageX, stageY) {
        if (!this.mKeyState[key]) {
            this.mKeyState[key] = true;
            // egret.log("InputKey " + key + " (" + stageX + "," + stageY + ")");
            //Event
            var event = new InputEvent(key, stageX, stageY);
            GameMain.GetInstance().DispatchEvent(event);
        }
    };
    InputModule.prototype.RegisterTouchEvent = function () {
        GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchBegin, this);
        GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchMove, this);
        GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchTap, this);
    };
    InputModule.prototype.UnRegisterTouchEvent = function () {
        GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchBegin, this);
        GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchMove, this);
        GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchTap, this);
    };
    InputModule.prototype.OnTouchBegin = function (evt) {
        if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
            this.mTouchBeginX = evt.stageX;
            this.mTouchBeginY = evt.stageY;
            // egret.log("OnTouchBegin(" + evt.stageX + "," + evt.stageY + ")");
            this.mLastTouchEvent = egret.TouchEvent.TOUCH_BEGIN;
        }
    };
    InputModule.prototype.OnTouchMove = function (evt) {
        if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
            // egret.log("OnTouchMove(" + evt.stageX + "," + evt.stageY + ")");
            var hasInput = false;
            var deltaX = evt.stageX - this.mTouchBeginX;
            var deltaY = evt.stageY - this.mTouchBeginY;
            if (deltaX >= this.mMoveEventMinDisX) {
                this.InputKey(InputKey.Right, evt.stageX, evt.stageY);
                hasInput = true;
            }
            if (deltaX <= -this.mMoveEventMinDisX) {
                this.InputKey(InputKey.Left, evt.stageX, evt.stageY);
                hasInput = true;
            }
            if (deltaY >= this.mMoveEventMinDisY) {
                this.InputKey(InputKey.Down, evt.stageX, evt.stageY);
                hasInput = true;
            }
            if (deltaY <= -this.mMoveEventMinDisY) {
                this.InputKey(InputKey.Up, evt.stageX, evt.stageY);
                hasInput = true;
            }
            if (hasInput) {
                this.mTouchBeginX = evt.stageX;
                this.mTouchBeginY = evt.stageY;
            }
            this.mLastTouchEvent = egret.TouchEvent.TOUCH_MOVE;
        }
    };
    InputModule.prototype.OnTouchTap = function (evt) {
        if (evt.type == egret.TouchEvent.TOUCH_TAP) {
            // egret.log("OnTouchTap(" + evt.stageX + "," + evt.stageY + ")");
            if (this.mLastTouchEvent == egret.TouchEvent.TOUCH_BEGIN) {
                this.InputKey(InputKey.Rotate, evt.stageX, evt.stageY);
            }
            this.mLastTouchEvent = egret.TouchEvent.TOUCH_TAP;
        }
    };
    InputModule.prototype.Update = function (deltaTime) {
        this.ClearKey();
    };
    InputModule.prototype.Release = function () {
        this.UnRegisterTouchEvent();
    };
    InputModule.prototype.SwitchForeOrBack = function (from, to) {
        this.isForeground = true;
    };
    InputModule.prototype.GetKey = function (key) {
        return this.mKeyState[key];
    };
    return InputModule;
}(ModuleBase));
__reflect(InputModule.prototype, "InputModule", ["IInputModule", "IModule"]);
//# sourceMappingURL=InputModule.js.map