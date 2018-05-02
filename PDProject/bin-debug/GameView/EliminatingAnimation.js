var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EliminatingAnimation = (function () {
    function EliminatingAnimation() {
    }
    EliminatingAnimation.prototype.Init = function (view) {
        this.matchView = view;
        this.state = EliminatingAnimState.Init;
        this.runningTime = 0;
        this.moveDownFinish = false;
    };
    EliminatingAnimation.prototype.IsPlaying = function () {
        return this.state != EliminatingAnimState.Init;
    };
    EliminatingAnimation.prototype.Start = function (eliminateInfo) {
        this.runningTime = 0;
        this.moveDownFinish = false;
        this.isLightningHide = false;
        this.eliminateInfo = eliminateInfo;
        this.EnterState(EliminatingAnimState.Lightning);
    };
    EliminatingAnimation.prototype.Update = function (deltaTime) {
        this.runningTime += deltaTime;
        switch (this.state) {
            case EliminatingAnimState.Lightning:
                {
                    this.UpdateLightning(deltaTime);
                    if (this.runningTime >= EliminatingAnimation.LightningStateTime) {
                        this.DeleteEliminatElements();
                        this.EnterState(EliminatingAnimState.MoveDown);
                    }
                    break;
                }
            case EliminatingAnimState.MoveDown:
                {
                    this.UpdateMoveDown(deltaTime);
                    if (this.moveDownFinish) {
                        this.EnterState(EliminatingAnimState.Init);
                    }
                }
        }
    };
    EliminatingAnimation.prototype.EnterState = function (toState) {
        this.state = toState;
    };
    EliminatingAnimation.prototype.UpdateLightning = function (deltaTime) {
        var cycle = this.runningTime / EliminatingAnimation.LightningInterval;
        var rate = cycle - Math.floor(cycle);
        var needHide = rate < EliminatingAnimation.LightningHideRate;
        if (needHide != this.isLightningHide) {
            this.isLightningHide = needHide;
            var alpha = needHide ? 0 : 1;
            for (var i = 0; i < this.eliminateInfo.EliminatedElements.length; ++i) {
                this.eliminateInfo.EliminatedElements[i].renderer.alpha = alpha;
            }
        }
    };
    EliminatingAnimation.prototype.DeleteEliminatElements = function () {
        for (var i = 0; i < this.eliminateInfo.EliminatedElements.length; ++i) {
            this.eliminateInfo.EliminatedElements[i].renderer.alpha = 0; //Todo 改成释放这个元素
        }
    };
    EliminatingAnimation.prototype.UpdateMoveDown = function (deltaTime) {
        var hasMove = false;
        var moveValue = EliminatingAnimation.MoveDownSpeed * deltaTime * 0.001;
        for (var i = 0; i < this.eliminateInfo.MoveElements.length; ++i) {
            var result = this.MoveRenderDown(moveValue, this.eliminateInfo.MoveElements[i].MoveElement);
            hasMove = hasMove || result;
        }
        if (!hasMove) {
            this.eliminateInfo.Reset();
            this.EnterState(EliminatingAnimState.Init);
        }
    };
    EliminatingAnimation.prototype.MoveRenderDown = function (moveValue, element) {
        var result = false;
        if (element != null) {
            var targetRenderPosX = this.matchView.GetRenderPosX(element.posx);
            var targetRenderPosY = this.matchView.GetRenderPosY(element.posy);
            result = Math.abs(element.renderer.x - targetRenderPosX) >= moveValue
                || Math.abs(element.renderer.y - targetRenderPosY) >= moveValue;
            element.renderer.x = Tools.MoveNumber(element.renderer.x, targetRenderPosX, moveValue);
            element.renderer.y = Tools.MoveNumber(element.renderer.y, targetRenderPosY, moveValue);
        }
        return result;
    };
    EliminatingAnimation.LightningStateTime = 300; // 闪烁总时长
    EliminatingAnimation.LightningInterval = 150; // 闪烁一个周期的时间
    EliminatingAnimation.LightningHideRate = 0.5; // 闪烁一个周期中，隐藏显示的时间占比
    EliminatingAnimation.MoveDownSpeed = 300; // 一秒移动多少像素
    return EliminatingAnimation;
}());
__reflect(EliminatingAnimation.prototype, "EliminatingAnimation");
var EliminatingAnimState;
(function (EliminatingAnimState) {
    EliminatingAnimState[EliminatingAnimState["Init"] = 0] = "Init";
    EliminatingAnimState[EliminatingAnimState["Lightning"] = 1] = "Lightning";
    EliminatingAnimState[EliminatingAnimState["MoveDown"] = 2] = "MoveDown";
})(EliminatingAnimState || (EliminatingAnimState = {}));
//# sourceMappingURL=EliminatingAnimation.js.map