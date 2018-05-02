var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DisplayElementBase = (function () {
    function DisplayElementBase() {
        this.posx = 0;
        this.posy = 0;
        this.canDrop = true;
        this.bindedElements = [];
    }
    DisplayElementBase.prototype.MoveTo = function (posx, posy) {
        if (this.posx != posx
            || this.posy != posy) {
            this.posx = posx;
            this.posy = posy;
            this.dirty = true;
        }
    };
    DisplayElementBase.prototype.RandomColor = function () {
        var random = Math.random() * 3;
        if (random >= 0 && random < 1) {
            return GameElementColor.red;
        }
        else if (random >= 1 && random < 2) {
            return GameElementColor.blue;
        }
        else {
            return GameElementColor.yellow;
        }
    };
    DisplayElementBase.prototype.GetTexture = function (path) {
        if (this.resModule == null) {
            this.resModule = GameMain.GetInstance().GetModule(ModuleType.RES);
        }
        return this.resModule.GetRes(path);
    };
    // 返回捆绑元素的列表
    DisplayElementBase.prototype.GetBindElements = function () {
        return this.bindedElements;
    };
    // 和某个元素绑定（双向）
    DisplayElementBase.prototype.BindElement = function (element) {
        if (element != null) {
            var index = this.bindedElements.indexOf(element);
            if (index < 0) {
                this.bindedElements.push(element);
                element.BindElement(this);
                return true;
            }
        }
        return false;
    };
    // 和某个元素解除绑定（双向）
    DisplayElementBase.prototype.UnbindElement = function (element) {
        if (element != null) {
            var index = this.bindedElements.indexOf(element);
            if (index >= 0) {
                this.bindedElements.splice(index, 1);
                element.UnbindElement(this);
                return true;
            }
        }
        return false;
    };
    // 和所有元素绑定（双向）    
    DisplayElementBase.prototype.UnbindAllElement = function () {
        for (var index = this.bindedElements.length - 1; index >= 0; --index) {
            var element = this.bindedElements[index];
            if (element != null) {
                element.UnbindElement(this);
            }
        }
        this.bindedElements = [];
    };
    return DisplayElementBase;
}());
__reflect(DisplayElementBase.prototype, "DisplayElementBase");
var GameElementColor;
(function (GameElementColor) {
    GameElementColor[GameElementColor["red"] = 0] = "red";
    GameElementColor[GameElementColor["blue"] = 1] = "blue";
    GameElementColor[GameElementColor["yellow"] = 2] = "yellow";
})(GameElementColor || (GameElementColor = {}));
//# sourceMappingURL=DisplayElementBase.js.map