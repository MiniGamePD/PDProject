var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EliminateInfo = (function () {
    function EliminateInfo() {
        this.HasInfo = false;
        this.EliminatedElements = [];
        this.MoveElements = [];
    }
    // 重置
    EliminateInfo.prototype.Reset = function () {
        this.HasInfo = false;
        this.EliminatedElements = [];
        this.MoveElements = [];
    };
    return EliminateInfo;
}());
__reflect(EliminateInfo.prototype, "EliminateInfo");
// 消除后，需要移动的元素信息
var EliminateMoveInfo = (function () {
    function EliminateMoveInfo(element, startPosX, startPosY, endPosX, endPosY) {
        this.MoveElement = element;
        this.StartPosX = startPosX;
        this.StartPosY = startPosY;
        this.EndPosX = endPosX;
        this.EndPosY = endPosY;
    }
    return EliminateMoveInfo;
}());
__reflect(EliminateMoveInfo.prototype, "EliminateMoveInfo");
//# sourceMappingURL=EliminateInfo.js.map