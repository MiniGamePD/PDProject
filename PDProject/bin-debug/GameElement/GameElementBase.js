var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameElementBase = (function () {
    function GameElementBase() {
        this.posx = 0;
        this.posy = 0;
    }
    GameElementBase.prototype.MoveTo = function (posx, posy) {
        this.posx = posx;
        this.posy = posy;
        this.dirty = true;
    };
    GameElementBase.prototype.RandomColor = function () {
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
    GameElementBase.prototype.GetTexture = function (path) {
        if (this.resModule == null) {
            this.resModule = GameMain.GetInstance().GetModule(ModuleType.RES);
        }
        return this.resModule.GetRes(path);
    };
    return GameElementBase;
}());
__reflect(GameElementBase.prototype, "GameElementBase");
var GameElementColor;
(function (GameElementColor) {
    GameElementColor[GameElementColor["red"] = 0] = "red";
    GameElementColor[GameElementColor["blue"] = 1] = "blue";
    GameElementColor[GameElementColor["yellow"] = 2] = "yellow";
})(GameElementColor || (GameElementColor = {}));
//# sourceMappingURL=GameElementBase.js.map