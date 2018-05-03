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
var VirusRenderer = (function (_super) {
    __extends(VirusRenderer, _super);
    function VirusRenderer() {
        var _this = _super.call(this) || this;
        _this.renderer = new egret.Bitmap();
        _this.color = _this.RandomColor();
        _this.canDrop = false;
        _this.RefreshTexture();
        return _this;
    }
    VirusRenderer.prototype.RefreshTexture = function () {
        var texture;
        var path = "pd_res_json.Virus_";
        switch (this.color) {
            case GameElementColor.red:
                path += "Red";
                break;
            case GameElementColor.blue:
                path += "Blue";
                break;
            case GameElementColor.yellow:
                path += "Yellow";
                break;
            default:
                if (true) {
                    console.log("Unknow Color:" + this.color);
                }
                break;
        }
        texture = this.GetTexture(path);
        this.renderer.texture = texture;
    };
    return VirusRenderer;
}(DisplayElementBase));
__reflect(VirusRenderer.prototype, "VirusRenderer");
