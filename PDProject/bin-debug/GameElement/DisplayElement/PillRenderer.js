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
var PillRenderer = (function (_super) {
    __extends(PillRenderer, _super);
    function PillRenderer() {
        var _this = _super.call(this) || this;
        _this.renderer = new egret.Bitmap();
        _this.color = _this.RandomColor();
        _this.canDrop = true;
        return _this;
    }
    PillRenderer.prototype.SetPillType = function (pillType) {
        this.mPillType = pillType;
        this.dirty = true;
    };
    PillRenderer.prototype.RefreshTexture = function () {
        _super.prototype.RefreshTexture.call(this);
        var texture;
        var path = "pd_res_json.Pill_";
        if (this.mPillType == PillElementType.Single) {
            path += "Single_";
        }
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
        if (this.mPillType == PillElementType.right) {
            this.renderer.rotation = 180;
        }
    };
    // 删除捆绑元素后，重新计算药丸的类型
    PillRenderer.prototype.UnbindElement = function (element) {
        var result = _super.prototype.UnbindElement.call(this, element);
        if (result
            && this.GetBindElements().length == 0) {
            this.SetPillType(PillElementType.Single);
        }
        return result;
    };
    // 删除捆绑元素后，重新计算药丸的类型
    PillRenderer.prototype.UnbindAllElement = function () {
        _super.prototype.UnbindAllElement.call(this);
        this.SetPillType(PillElementType.Single);
    };
    return PillRenderer;
}(DisplayElementBase));
__reflect(PillRenderer.prototype, "PillRenderer");
var PillElementType;
(function (PillElementType) {
    PillElementType[PillElementType["left"] = 0] = "left";
    PillElementType[PillElementType["right"] = 1] = "right";
    PillElementType[PillElementType["Single"] = 2] = "Single";
})(PillElementType || (PillElementType = {}));
//# sourceMappingURL=PillRenderer.js.map