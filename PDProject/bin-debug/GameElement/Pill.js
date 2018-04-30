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
        _this.renderer = new egret.Bitmap();
        return _this;
    }
    Pill.prototype.ChangePillTexByColor = function () {
        this.color = this.RandomColor();
        var texture;
        switch (this.color) {
            case GameElementColor.red:
                texture = this.GetTexture("pd_res_json.Pill_Red");
                break;
            case GameElementColor.blue:
                texture = this.GetTexture("pd_res_json.Pill_Blue");
                break;
            case GameElementColor.yellow:
                texture = this.GetTexture("pd_res_json.Pill_Yellow");
                break;
            default:
                if (true) {
                    console.log("Unknow Color:" + this.color);
                }
                break;
        }
        this.renderer.texture = texture;
    };
    return Pill;
}(GameElementBase));
__reflect(Pill.prototype, "Pill");
//# sourceMappingURL=Pill.js.map