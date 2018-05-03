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
var PlayerControl = (function (_super) {
    __extends(PlayerControl, _super);
    function PlayerControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerControl.prototype.Init = function () {
        GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(PlayerControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
    };
    PlayerControl.prototype.Release = function () {
        GameMain.GetInstance().RemoveEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().RemoveEventListener(PlayerControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
    };
    PlayerControl.prototype.SetTarget = function (target) {
        this.target = target;
    };
    PlayerControl.prototype.Work = function () {
        _super.prototype.Work.call(this);
        this.dropdownTimer = 0;
        this.DispatchControlEvent(ControlType.Create);
    };
    PlayerControl.prototype.Sleep = function () {
        _super.prototype.Sleep.call(this);
        this.target = null;
    };
    PlayerControl.prototype.OnInputEvent = function (event) {
        if (this.target != null) {
            var key = event.Key;
            if (key == InputKey.Left) {
                this.DispatchControlEvent(ControlType.MoveLeft);
            }
            else if (key == InputKey.Right) {
                this.DispatchControlEvent(ControlType.MoveRight);
            }
            else if (key == InputKey.Down) {
                this.dropdownTimer += PlayerControl.DropdownInterval;
            }
            else if (key == InputKey.Rotate) {
                this.DispatchControlEvent(ControlType.Rotation);
            }
        }
    };
    PlayerControl.prototype.Update = function (deltaTime) {
        if (this.isWorking && this.target != null) {
            this.TryDropdown(deltaTime);
        }
    };
    PlayerControl.prototype.TryDropdown = function (deltaTime) {
        this.dropdownTimer += deltaTime;
        if (this.dropdownTimer >= PlayerControl.DropdownInterval) {
            //即使时间很长，超过两个MatchModule.PillDropdownInterval，也还是移动一格，否则卡了，就忽然间下降很多，体验不好
            this.dropdownTimer = 0;
            this.DispatchControlEvent(ControlType.DropDown);
        }
    };
    PlayerControl.prototype.OnPlayerControlFailed = function (event) {
        if (this.isWorking && this.target == null) {
            if (true) {
                console.error("Player Control Failed While Player Control Is Not Working");
            }
            return;
        }
        if (event.controlType == ControlType.DropDown) {
            //下落到不能再下落了，就进入消除状态        
            var event_1 = new PlayerControlFinishEvent();
            GameMain.GetInstance().DispatchEvent(event_1);
        }
        else if (event.controlType == ControlType.Create) {
            //已经无法创建新的元素了，就进入死亡状态
            var event_2 = new GameOverEvent();
            GameMain.GetInstance().DispatchEvent(event_2);
        }
    };
    PlayerControl.prototype.DispatchControlEvent = function (controlType) {
        var event = new PlayerControlEvent();
        event.controlType = controlType;
        event.targets = this.target.GetControledElements();
        GameMain.GetInstance().DispatchEvent(event);
    };
    PlayerControl.DropdownInterval = 1000; //每隔多久药丸下落一格
    return PlayerControl;
}(GameModuleComponentBase));
__reflect(PlayerControl.prototype, "PlayerControl");
var ControlType;
(function (ControlType) {
    ControlType[ControlType["Create"] = 0] = "Create";
    ControlType[ControlType["MoveLeft"] = 1] = "MoveLeft";
    ControlType[ControlType["MoveRight"] = 2] = "MoveRight";
    ControlType[ControlType["DropDown"] = 3] = "DropDown";
    ControlType[ControlType["Rotation"] = 4] = "Rotation";
})(ControlType || (ControlType = {}));
//# sourceMappingURL=PlayerControl.js.map