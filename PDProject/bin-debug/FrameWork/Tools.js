var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Tools = (function () {
    function Tools() {
    }
    Tools.MoveScenePosX = function (posX, dir, step) {
        var targetPosX = posX;
        switch (dir) {
            case Direction.Left:
                targetPosX -= step;
                break;
            case Direction.Right:
                targetPosX += step;
                break;
            default:
                break;
        }
        return targetPosX;
    };
    Tools.MoveScenePosY = function (posY, dir, step) {
        var targetPosY = posY;
        switch (dir) {
            case Direction.Up:
                targetPosY -= step;
                break;
            case Direction.Down:
                targetPosY += step;
                break;
            default:
                break;
        }
        return targetPosY;
    };
    return Tools;
}());
__reflect(Tools.prototype, "Tools");
//# sourceMappingURL=Tools.js.map