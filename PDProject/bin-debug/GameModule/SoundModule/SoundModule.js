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
var SoundModule = (function (_super) {
    __extends(SoundModule, _super);
    function SoundModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SoundModule.prototype.Init = function () {
        this.isForeground = true;
        this.mResModule = GameMain.GetInstance().GetModule(ModuleType.RES);
        GameMain.GetInstance().AddEventListener(PlaySoundEvent.EventName, this.OnPlaySoundEvent, this);
        return true;
    };
    SoundModule.prototype.Update = function (deltaTime) {
    };
    SoundModule.prototype.Release = function () {
    };
    SoundModule.prototype.SwitchForeOrBack = function (from, to) {
        this.isForeground = true;
    };
    SoundModule.prototype.PlaySound = function (key, loops) {
        if (this.mResModule != null) {
            var sound = this.mResModule.GetRes(key);
            if (sound != null) {
                return sound.play(0, loops);
            }
        }
        return null;
    };
    SoundModule.prototype.OnPlaySoundEvent = function (event) {
        if (event != null) {
            this.PlaySound(event.Key, event.Loops);
        }
    };
    return SoundModule;
}(ModuleBase));
__reflect(SoundModule.prototype, "SoundModule", ["ISoundModule", "IModule"]);
//# sourceMappingURL=SoundModule.js.map