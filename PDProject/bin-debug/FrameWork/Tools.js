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
    Tools.IsZero = function (value) {
        return Math.abs(value) < Tools.ZeroValue;
    };
    Tools.MoveNumber = function (from, to, moveValue) {
        if (Tools.IsZero(from - to)) {
            return to;
        }
        else {
            var value = from;
            if (from < to) {
                value += moveValue;
            }
            else {
                value -= moveValue;
            }
            value = Tools.Clamp(value, from, to);
        }
        return value;
    };
    Tools.Clamp = function (value, p1, p2) {
        var result = value;
        if (p1 < p2) {
            result = result < p1 ? p1 : result;
            result = result > p2 ? p2 : result;
        }
        else if (p1 > p2) {
            result = result > p1 ? p1 : result;
            result = result < p2 ? p2 : result;
        }
        return result;
    };
    Tools.ZeroValue = 0.00001;
    return Tools;
}());
__reflect(Tools.prototype, "Tools");
//# sourceMappingURL=Tools.js.map