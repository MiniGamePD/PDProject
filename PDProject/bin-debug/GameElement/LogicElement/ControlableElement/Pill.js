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
var Pill = (function (_super) {
    __extends(Pill, _super);
    function Pill() {
        var _this = _super.call(this) || this;
        _this.rotAngle = 0;
        _this.pill1 = new PillRenderer();
        _this.pill2 = new PillRenderer();
        _this.pill1.SetPillType(PillElementType.left);
        _this.pill1.RefreshTexture();
        _this.pill2.SetPillType(PillElementType.right);
        _this.pill2.RefreshTexture();
        _this.pill1.BindElement(_this.pill2);
        //坐标表示药丸左下角块的坐标, 初始坐标在瓶子正中间的最上方
        _this.MoveTo(3, 0);
        return _this;
    }
    Pill.prototype.TryRotate = function () {
        return false;
    };
    Pill.prototype.MoveTo = function (posx, posy) {
        this.posx = posx;
        this.posy = posy;
        //TODO：根据旋转角度，来决定子pill的位置
        this.pill1.MoveTo(this.posx, this.posy);
        this.pill2.MoveTo(this.posx + 1, this.posy);
    };
    Pill.prototype.FillTargets = function () {
        this.targets.push(this.pill1);
        this.targets.push(this.pill2);
    };
    return Pill;
}(ControlableElement));
__reflect(Pill.prototype, "Pill");
