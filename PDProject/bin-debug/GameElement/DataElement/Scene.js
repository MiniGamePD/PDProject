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
//MVC中的M
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sceneData = []; //左上角是00    
        // // 根据消除的元素列表，把上面元素往下移
        // private MoveAfterEliminate() {
        //     if (this.eliminateInfo.HasInfo) {
        //         for (var count = 0; count < this.eliminateInfo.EliminatedElements.length; ++count) {
        //             var eliminatedElement = this.eliminateInfo.EliminatedElements[count];
        //             this.RemoveElement(eliminatedElement);
        //             eliminatedElement.renderer.alpha = 0; // TODO：这里后面改成View里面做动画，现在暂时直接隐藏了
        //             var moveDownValue = this.GetNullElementCountInDown(eliminatedElement.posx, eliminatedElement.posy);
        //             for (var upIdx = eliminatedElement.posy - 1; upIdx >= 0; --upIdx) {
        //                 var upElement = this.GetElement(eliminatedElement.posx, upIdx);
        //                 if (upElement != null) { // TODO：在这里加上病毒这种不可移动的判断。
        //                     var targetPosY = upIdx + moveDownValue;
        //                     var moveInfo: EliminateMoveInfo = new EliminateMoveInfo(upElement, upElement.posx, upElement.posy, upElement.posx, targetPosY); // TODO：改成池子
        //                     this.eliminateInfo.MoveElements.push(moveInfo);
        //                     this.MoveElement(upElement, upElement.posx, targetPosY);
        //                 }
        //                 else {
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // }
        _this.mGroupElementTemp = [];
        return _this;
    }
    Scene.prototype.Init = function () {
        this.eliminateInfo = new EliminateInfo();
        for (var i = 0; i < Scene.Columns; ++i) {
            this.sceneData.push([]);
            for (var j = 0; j < Scene.Rows; ++j) {
                this.sceneData[i].push(null);
            }
        }
        GameMain.GetInstance().AddEventListener(PlayerControlEvent.EventName, this.ProcessControl, this);
    };
    Scene.prototype.Release = function () {
        GameMain.GetInstance().RemoveEventListener(PlayerControlEvent.EventName, this.ProcessControl, this);
    };
    Scene.prototype.ProcessControl = function (event) {
        var operationSuccess = true;
        switch (event.controlType) {
            case ControlType.Create:
                {
                    operationSuccess = this.AddElementGroup(event.targets);
                    break;
                }
            case ControlType.MoveLeft:
                {
                    operationSuccess = this.GetElementGroupMoveSpace(event.targets, Direction.Left) > 0;
                    if (operationSuccess)
                        this.MoveElementGroup(event.targets, Direction.Left, 1);
                    break;
                }
            case ControlType.MoveRight:
                {
                    operationSuccess = this.GetElementGroupMoveSpace(event.targets, Direction.Right) > 0;
                    if (operationSuccess)
                        this.MoveElementGroup(event.targets, Direction.Right, 1);
                    break;
                }
            case ControlType.DropDown:
                {
                    operationSuccess = this.GetElementGroupMoveSpace(event.targets, Direction.Down) > 0;
                    if (operationSuccess)
                        this.MoveElementGroup(event.targets, Direction.Down, 1);
                    break;
                }
            case ControlType.Rotation:
                {
                    operationSuccess = this.TryRotate(event.targets);
                    break;
                }
        }
        if (!operationSuccess) {
            var failedEvent = new PlayerControlFailedEvent();
            failedEvent.controlType = event.controlType;
            GameMain.GetInstance().DispatchEvent(failedEvent);
        }
    };
    Scene.prototype.TryRotate = function (elements) {
        return false;
    };
    //把Element移动到newPos，并把老位置制成null
    Scene.prototype.MoveElement = function (element, newPosx, newPosy) {
        var result = false;
        if (this.IsPosLegal(newPosx, newPosy)
            && this.sceneData[newPosx][newPosy] == null) {
            // 清空现在的位置
            if (this.IsPosLegal(element.posx, element.posy)
                && this.sceneData[element.posx][element.posy] == element) {
                this.sceneData[element.posx][element.posy] = null;
            }
            // 移动到目标位置            
            this.sceneData[newPosx][newPosy] = element;
            element.MoveTo(newPosx, newPosy);
            result = true;
        }
        return result;
    };
    Scene.prototype.Update = function (deltaTime) {
        this.CheckEliminating();
    };
    //#####消除相关######
    Scene.prototype.TryEliminate = function () {
        this.ClearEliminateInfo();
        this.EliminateElement();
        do {
            var hasMove = this.MoveAfterEliminate();
        } while (hasMove);
        var result = this.eliminateInfo.HasInfo;
        return result;
    };
    Scene.prototype.FinishEliminate = function () {
        var newEvent = new SceneEliminateFinishEvent();
        GameMain.GetInstance().DispatchEvent(newEvent);
    };
    Scene.prototype.CheckEliminating = function () {
        if (this.isWorking && !this.eliminateInfo.HasInfo) {
            var result = this.TryEliminate();
            if (!result) {
                this.FinishEliminate();
            }
        }
    };
    // 重置eliminateInfo
    Scene.prototype.ClearEliminateInfo = function () {
        if (this.eliminateInfo.HasInfo) {
            this.eliminateInfo.Reset();
        }
    };
    // 计算消除元素，把消除的元素放到this.eliminateInfo.EliminatedElements列表
    Scene.prototype.EliminateElement = function () {
        for (var iColumn = 0; iColumn < this.sceneData.length; ++iColumn) {
            var cloumnList = this.sceneData[iColumn];
            for (var iRow = 0; iRow < cloumnList.length; ++iRow) {
                var element = cloumnList[iRow];
                if (element != null
                    && this.NeedEliminate(element)) {
                    this.eliminateInfo.EliminatedElements.push(element);
                    element.UnbindAllElement();
                    this.eliminateInfo.HasInfo = true;
                }
            }
        }
        // 把元素从Scene中移除
        if (this.eliminateInfo.HasInfo) {
            for (var count = 0; count < this.eliminateInfo.EliminatedElements.length; ++count) {
                var eliminatedElement = this.eliminateInfo.EliminatedElements[count];
                this.RemoveElement(eliminatedElement);
                eliminatedElement.renderer.alpha = 0; // TODO：这里后面改成View里面做动画，现在暂时直接隐藏了
            }
        }
    };
    //根据消除的元素列表，把上面元素往下移
    Scene.prototype.MoveAfterEliminate = function () {
        var hasMove = false;
        for (var y = Scene.Rows - 1; y >= 0; --y) {
            for (var x = Scene.Columns - 1; x >= 0; --x) {
                var upElement = this.GetElement(x, y);
                if (upElement != null
                    && upElement.canDrop) {
                    this.mGroupElementTemp = [];
                    this.mGroupElementTemp.push(upElement);
                    var bindElements = upElement.GetBindElements();
                    for (var i = 0; i < bindElements.length; ++i) {
                        this.mGroupElementTemp.push(bindElements[i]);
                    }
                    var moveDownValue = this.GetElementGroupMoveSpace(this.mGroupElementTemp, Direction.Down);
                    if (moveDownValue > 0) {
                        var result = this.MoveElementGroup(this.mGroupElementTemp, Direction.Down, moveDownValue);
                        hasMove = true;
                        for (var moveCount = 0; moveCount < this.mGroupElementTemp.length; ++moveCount) {
                            var e = this.mGroupElementTemp[moveCount];
                            var moveInfo = new EliminateMoveInfo(e, e.posx, e.posy - moveDownValue, e.posx, e.posy); // TODO：改成池子
                            this.eliminateInfo.MoveElements.push(moveInfo);
                        }
                    }
                }
            }
        }
        return hasMove;
    };
    // 计算某个位置下面的空槽数量(包括这个位置本身)
    Scene.prototype.GetNullElementCountInDown = function (posX, posY) {
        var count = 0;
        for (var downIdx = posY; downIdx < Scene.Rows; ++downIdx) {
            if (this.GetElement(posX, downIdx) == null) {
                ++count;
            }
            else {
                break;
            }
        }
        return count;
    };
    // 获取某个坐标的元素
    Scene.prototype.GetElement = function (posX, posY) {
        if (this.IsPosLegal(posX, posY)) {
            return this.sceneData[posX][posY];
        }
        return null;
    };
    // 一个坐标是否合法
    Scene.prototype.IsPosLegal = function (posX, posY) {
        if (posX >= 0 && posX < Scene.Columns
            && posY >= 0 && posY < Scene.Rows) {
            return true;
        }
    };
    // 把一个元素，从Data中移除
    Scene.prototype.RemoveElement = function (element) {
        if (element != null) {
            var posX = element.posx;
            var posY = element.posy;
            if (this.IsPosLegal(posX, posY)
                && this.sceneData[posX][posY] == element) {
                this.sceneData[posX][posY] = null;
                return true;
            }
        }
        return false;
    };
    // 把一个组元素，从Data中移除
    Scene.prototype.RemoveElementGroup = function (elements) {
        var result = true;
        for (var i = 0; i < elements.length; ++i) {
            result = result && this.RemoveElement(elements[i]);
        }
        return result;
    };
    // 把一个组元素，根据自带坐标，加到scene中
    Scene.prototype.AddElementGroup = function (elements) {
        var result = true;
        for (var i = 0; i < elements.length; ++i) {
            result = result && this.AddElement(elements[i]);
        }
        return result;
    };
    // 把一个元素，根据自带坐标，加到scene中
    Scene.prototype.AddElement = function (element) {
        if (element != null) {
            var posX = element.posx;
            var posY = element.posy;
            if (this.IsPosLegal(posX, posY)
                && this.sceneData[posX][posY] == null) {
                this.sceneData[posX][posY] = element;
                return true;
            }
        }
        return false;
    };
    // 判断一个元素是否需要被消除(横竖方向满足相邻的3个相同颜色的块)
    Scene.prototype.NeedEliminate = function (element) {
        var needEliminate = false;
        var cloumnCount = 1;
        var rowCount = 1;
        for (var up = element.posy - 1; up >= 0; --up) {
            var e = this.GetElement(element.posx, up);
            if (e != null
                && e.color == element.color) {
                ++cloumnCount;
            }
            else {
                break;
            }
        }
        for (var down = element.posy + 1; down < Scene.Rows; ++down) {
            var e = this.GetElement(element.posx, down);
            if (e != null
                && e.color == element.color) {
                ++cloumnCount;
            }
            else {
                break;
            }
        }
        for (var left = element.posx - 1; left >= 0; --left) {
            var e = this.GetElement(left, element.posy);
            if (e != null
                && e.color == element.color) {
                ++rowCount;
            }
            else {
                break;
            }
        }
        for (var right = element.posx + 1; right < Scene.Columns; ++right) {
            var e = this.GetElement(right, element.posy);
            if (e != null
                && e.color == element.color) {
                ++rowCount;
            }
            else {
                break;
            }
        }
        if (cloumnCount >= Scene.EliminateMinCount
            || rowCount >= Scene.EliminateMinCount) {
            needEliminate = true;
        }
        return needEliminate;
    };
    //#####消除相关######
    Scene.prototype.GetElementGroupMoveSpace = function (elements, dir) {
        var space = 0;
        var result = this.RemoveElementGroup(elements);
        if (true) {
            console.assert(result, "Can not calac move space while elements not in scene!");
        }
        var minSpace = -1;
        for (var i = 0; i < elements.length; ++i) {
            var moveSpace = this.GetElementMoveSpace(elements[i], dir);
            if (minSpace < 0
                || minSpace > moveSpace) {
                minSpace = moveSpace;
            }
        }
        if (minSpace >= 0) {
            space = minSpace;
        }
        result = this.AddElementGroup(elements);
        if (true) {
            console.assert(result, "Can not add elements to scene after calac move space!");
        }
        return space;
    };
    Scene.prototype.GetElementMoveSpace = function (element, dir) {
        var space = 0;
        if (element != null) {
            var posX = Tools.MoveScenePosX(element.posx, dir, 1);
            var posY = Tools.MoveScenePosY(element.posy, dir, 1);
            while (this.IsPosLegal(posX, posY)
                && this.GetElement(posX, posY) == null) {
                ++space;
                posX = Tools.MoveScenePosX(posX, dir, 1);
                posY = Tools.MoveScenePosY(posY, dir, 1);
            }
        }
        return space;
    };
    // 把一组元素，往某个方向移动
    Scene.prototype.MoveElementGroup = function (elements, dir, step) {
        var result = this.RemoveElementGroup(elements);
        if (true) {
            console.assert(result, "Can not move element while elements not in scene!");
        }
        for (var i = 0; i < elements.length; ++i) {
            elements[i].posx = Tools.MoveScenePosX(elements[i].posx, dir, step);
            elements[i].posy = Tools.MoveScenePosY(elements[i].posy, dir, step);
            elements[i].dirty = true;
        }
        result = this.AddElementGroup(elements);
        if (true) {
            console.assert(result, "Can not add elements to scene move!");
        }
        return result;
    };
    Scene.Columns = 8;
    Scene.Rows = 16;
    Scene.EliminateMinCount = 3; //触发消除的最小数量
    return Scene;
}(GameModuleComponentBase));
__reflect(Scene.prototype, "Scene");
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
//# sourceMappingURL=Scene.js.map