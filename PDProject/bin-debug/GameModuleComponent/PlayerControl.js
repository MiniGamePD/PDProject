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
        GameMain.GetInstance().AddEventListener(PillControlFailedEvent.EventName, this.OnPillControlFailed, this);
    };
    PlayerControl.prototype.Release = function () {
        GameMain.GetInstance().RemoveEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(PillControlFailedEvent.EventName, this.OnPillControlFailed, this);
    };
    PlayerControl.prototype.SetTarget = function (target) {
        this.target = target;
    };
    PlayerControl.prototype.Work = function () {
        _super.prototype.Work.call(this);
        this.dropdownTimer = 0;
        this.DispatchPillControlEvent(PillControlType.Create);
    };
    PlayerControl.prototype.Sleep = function () {
        _super.prototype.Sleep.call(this);
        this.target = null;
    };
    PlayerControl.prototype.OnInputEvent = function (event) {
        if (this.target != null) {
            var key = event.Key;
            if (key == InputKey.Left) {
                this.DispatchPillControlEvent(PillControlType.MoveLeft);
            }
            else if (key == InputKey.Right) {
                this.DispatchPillControlEvent(PillControlType.MoveRight);
            }
            else if (key == InputKey.Down) {
            }
            else if (key == InputKey.Rotate) {
                this.DispatchPillControlEvent(PillControlType.Rotation);
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
            this.DispatchPillControlEvent(PillControlType.DropDown);
        }
    };
    PlayerControl.prototype.OnPillControlFailed = function (event) {
        if (this.isWorking && this.target == null) {
            if (true) {
                console.error("PillRenderer DropDown Failed While Player Control Is Not Working");
            }
            return;
        }
        if (event.pillControlType == PillControlType.DropDown) {
            //下落到不能再下落了，就进入消除状态        
            var event_1 = new PlayerControlFinishEvent();
            GameMain.GetInstance().DispatchEvent(event_1);
        }
        else if (event.pillControlType == PillControlType.Create) {
            //已经无法创建新的药丸，就进入死亡状态
            var event_2 = new GameOverEvent();
            GameMain.GetInstance().DispatchEvent(event_2);
        }
    };
    PlayerControl.prototype.DispatchPillControlEvent = function (pillControlType) {
        var event = new PillControlEvent();
        event.pillControlType = pillControlType;
        event.pill1 = this.target.pill1;
        event.pill2 = this.target.pill2;
        GameMain.GetInstance().DispatchEvent(event);
    };
    PlayerControl.DropdownInterval = 200; //每隔多久药丸下落一格    
    return PlayerControl;
}(GameModuleComponentBase));
__reflect(PlayerControl.prototype, "PlayerControl");
//# sourceMappingURL=PlayerControl.js.map