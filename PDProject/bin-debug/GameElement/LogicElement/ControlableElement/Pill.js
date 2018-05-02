var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Pill = (function () {
    function Pill() {
        this.rotAngle = 0;
        this.pill1 = new PillRenderer();
        this.pill2 = new PillRenderer();
        this.pill1.SetPillType(PillElementType.left);
        this.pill2.SetPillType(PillElementType.right);
        this.pill1.BindElement(this.pill2);
        //坐标表示药丸左下角块的坐标, 初始坐标在瓶子正中间的最上方
        this.MoveTo(3, 0);
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
    return Pill;
}());
__reflect(Pill.prototype, "Pill");
//# sourceMappingURL=Pill.js.map