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
        GameMain.GetInstance().AddEventListener(SceneElementControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
    };
    PlayerControl.prototype.Release = function () {
        GameMain.GetInstance().RemoveEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
    };
    PlayerControl.prototype.SetTarget = function (target) {
        this.target = target;
    };
    PlayerControl.prototype.Work = function () {
        _super.prototype.Work.call(this);
        this.dropdownTimer = 0;
        this.DispatchControlEvent(SceneElementControlType.Add);
    };
    PlayerControl.prototype.Sleep = function () {
        _super.prototype.Sleep.call(this);
        this.target = null;
    };
    PlayerControl.prototype.OnInputEvent = function (event) {
        if (this.target != null) {
            var key = event.Key;
            if (key == InputKey.Left) {
                this.DispatchControlEvent(SceneElementControlType.Move, Direction.Left, 1);
            }
            else if (key == InputKey.Right) {
                this.DispatchControlEvent(SceneElementControlType.Move, Direction.Right, 1);
            }
            else if (key == InputKey.Down) {
                this.dropdownTimer += PlayerControl.DropdownInterval;
            }
            else if (key == InputKey.Rotate) {
                this.DispatchControlEvent(SceneElementControlType.Rotation);
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
            this.DispatchControlEvent(SceneElementControlType.Move, Direction.Down, 1);
        }
    };
    PlayerControl.prototype.OnPlayerControlFailed = function (event) {
        if (this.isWorking && this.target == null) {
            if (true) {
                console.error("Control Failed While Player Control Is Not Working");
            }
            return;
        }
        if (event.controlType == SceneElementControlType.Move && event.moveDir == Direction.Down) {
            //下落到不能再下落了，就进入消除状态        
            var event_1 = new PlayerControlFinishEvent();
            GameMain.GetInstance().DispatchEvent(event_1);
        }
        else if (event.controlType == SceneElementControlType.Add) {
            //已经无法创建新的元素了，就进入死亡状态
            var event_2 = new GameOverEvent();
            GameMain.GetInstance().DispatchEvent(event_2);
        }
    };
    PlayerControl.prototype.DispatchControlEvent = function (controlType, moveDir, moveStep) {
        var event = new SceneElementControlEvent();
        event.controlType = controlType;
        event.moveDir = moveDir;
        event.moveStep = moveStep;
        event.targets = this.target.GetControledElements();
        GameMain.GetInstance().DispatchEvent(event);
    };
    PlayerControl.DropdownInterval = 1000; //每隔多久药丸下落一格
    return PlayerControl;
}(GameModuleComponentBase));
__reflect(PlayerControl.prototype, "PlayerControl");
//# sourceMappingURL=PlayerControl.js.map