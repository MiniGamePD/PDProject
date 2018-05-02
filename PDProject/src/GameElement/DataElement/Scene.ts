//MVC中的M
class Scene extends GameModuleComponentBase {
    public static readonly Columns: number = 8;
    public static readonly Rows: number = 16;
    public sceneData: DisplayElementBase[][] = []; //左上角是00    
    public eliminateInfo: EliminateInfo;
    public isEliminating: boolean = false;

    public Init(): void {
        this.eliminateInfo = new EliminateInfo();
        for (var i = 0; i < Scene.Columns; ++i) {
            this.sceneData.push([]);
            for (var j = 0; j < Scene.Rows; ++j) {
                this.sceneData[i].push(null);
            }
        }

        GameMain.GetInstance().AddEventListener(PillControlEvent.EventName, this.PillControl, this);
    }

    public Release() {
        GameMain.GetInstance().RemoveEventListener(PillControlEvent.EventName, this.PillControl, this);
    }

    private PillControl(event: PillControlEvent) {
        let operationSuccess: boolean = true;
        switch (event.pillControlType) {
            case PillControlType.Create:
                {
                    operationSuccess = this.TryCreatePill(event.pill1, event.pill2);
                    break;
                }
            case PillControlType.MoveLeft:
                {
                    operationSuccess = this.TryMoveLeftPill(event.pill1, event.pill2);
                    break;
                }
            case PillControlType.MoveRight:
                {
                    operationSuccess = this.TryMoveRightPill(event.pill1, event.pill2);
                    break;
                }
            case PillControlType.DropDown:
                {
                    operationSuccess = this.TryDropdownPill(event.pill1, event.pill2);
                    break;
                }
            case PillControlType.Rotation:
                {
                    operationSuccess = this.TryRotatePill(event.pill1, event.pill2);
                    break;
                }
        }

        if (!operationSuccess) {
            let failedEvent = new PillControlFailedEvent();
            failedEvent.pillControlType = event.pillControlType;
            GameMain.GetInstance().DispatchEvent(failedEvent);
        }
    }

    private TryCreatePill(pill1: DisplayElementBase, pill2: DisplayElementBase): boolean {
        ;
        //TODO：如果在sceneData中已经存在东西了，则GameOver
        this.sceneData[pill1.posx][pill1.posy] = pill1;
        this.sceneData[pill2.posx][pill2.posy] = pill2;
        return true;
    }

    private TryDropdownPill(pill1: DisplayElementBase, pill2: DisplayElementBase): boolean {
        let result: boolean = true;

        if (pill1.posy > pill2.posy) {
            //pill1在底部
            let newPosx = pill1.posx;
            let newPosy = pill1.posy + 1;
            result = newPosy < Scene.Rows && this.sceneData[newPosx][newPosy] == null;
            if (result) {
                this.MoveElement(pill2, pill1.posx, pill1.posy);
                this.MoveElement(pill1, newPosx, newPosy);
            }
        }
        else if (pill1.posy < pill2.posy) {
            //pill2在底部
            let newPosx = pill2.posx;
            let newPosy = pill2.posy + 1;
            result = newPosy < Scene.Rows && this.sceneData[newPosx][newPosy] == null;
            if (result) {
                this.MoveElement(pill1, pill2.posx, pill2.posy);
                this.MoveElement(pill2, newPosx, newPosy);
            }
        }
        else {
            //药丸是横着的
            let newPosx1 = pill1.posx;
            let newPosy1 = pill1.posy + 1;
            let newPosx2 = pill2.posx;
            let newPosy2 = pill2.posy + 1;
            result = newPosy1 < Scene.Rows && this.sceneData[newPosx1][newPosy1] == null
                && newPosy2 < Scene.Rows && this.sceneData[newPosx2][newPosy2] == null;
            if (result) {
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }
        }
        return result;
    }

    private TryMoveLeftPill(pill1: DisplayElementBase, pill2: DisplayElementBase): boolean {
        let result: boolean = true;

        if (pill1.posx < pill2.posx) {
            //pill1在左边
            let newPosx = pill1.posx - 1;
            let newPosy = pill1.posy;
            result = newPosx >= 0 && this.sceneData[newPosx][newPosy] == null;
            if (result) {
                this.MoveElement(pill1, newPosx, newPosy);
                this.MoveElement(pill2, pill2.posx - 1, pill2.posy);
            }
        }
        else if (pill1.posx > pill2.posx) {
            //pill2在左边
            let newPosx = pill2.posx - 1;
            let newPosy = pill2.posy;
            result = newPosx >= 0 && this.sceneData[newPosx][newPosy] == null;
            if (result) {
                this.MoveElement(pill2, newPosx, newPosy);
                this.MoveElement(pill1, pill1.posx - 1, pill2.posy);
            }
        }
        else {
            //药丸是竖着的
            let newPosx1 = pill1.posx - 1;
            let newPosy1 = pill1.posy;
            let newPosx2 = pill2.posx - 1;
            let newPosy2 = pill2.posy;
            result = newPosx1 >= 0 && this.sceneData[newPosx1][newPosy1] == null
                && newPosx2 >= 0 && this.sceneData[newPosx2][newPosy2] == null;
            if (result) {
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }
        }
        return result;
    }

    private TryMoveRightPill(pill1: DisplayElementBase, pill2: DisplayElementBase): boolean {
        let result: boolean = true;

        if (pill1.posx > pill2.posx) {
            //pill1在右边
            let newPosx = pill1.posx + 1;
            let newPosy = pill1.posy;
            result = newPosx < Scene.Columns && this.sceneData[newPosx][newPosy] == null;
            if (result) {
                this.MoveElement(pill1, newPosx, newPosy);
                this.MoveElement(pill2, pill2.posx + 1, pill2.posy);
            }
        }
        else if (pill1.posx < pill2.posx) {
            //pill2在左边
            let newPosx = pill2.posx + 1;
            let newPosy = pill2.posy;
            result = newPosx < Scene.Columns && this.sceneData[newPosx][newPosy] == null;
            if (result) {
                this.MoveElement(pill2, newPosx, newPosy);
                this.MoveElement(pill1, pill1.posx + 1, pill1.posy);
            }
        }
        else {
            //药丸是竖着的
            let newPosx1 = pill1.posx + 1;
            let newPosy1 = pill1.posy;
            let newPosx2 = pill2.posx + 1;
            let newPosy2 = pill2.posy;
            result = newPosx1 < Scene.Columns && this.sceneData[newPosx1][newPosy1] == null
                && newPosx2 < Scene.Columns && this.sceneData[newPosx2][newPosy2] == null;
            if (result) {
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }
        }
        return result;
    }

    private TryRotatePill(pill1: DisplayElementBase, pill2: DisplayElementBase): boolean {
        return false;
    }

    //把Element移动到newPos，并把老位置制成null
    private MoveElement(element: DisplayElementBase, newPosx: number, newPosy: number): boolean {
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
    }

    public Work()
    {
        super.Work();
        this.TryEliminate();
    }

    public Update(deltaTime: number) {
        this.CheckEliminating();
    }

    //#####消除相关######
    public TryEliminate(): boolean {
        this.isEliminating = true;
        this.ClearEliminateInfo();
        this.EliminateElement();
        do {
            var hasMove = this.MoveAfterEliminate();
        } while(hasMove)
        this.CheckEliminating();
        return true;
    }

    public CheckEliminating()
    {
        if (this.isEliminating)
        {
            if (!this.eliminateInfo.HasInfo)
            {
                this.isEliminating = false;
                let newEvent = new SceneEliminateFinishEvent();
                GameMain.GetInstance().DispatchEvent(newEvent);
            }
        }
    }

    // 重置eliminateInfo
    public ClearEliminateInfo() {
        if (this.eliminateInfo.HasInfo) {
            this.eliminateInfo.Reset();
        }
    }

    // 计算消除元素，把消除的元素放到this.eliminateInfo.EliminatedElements列表
    private EliminateElement() {
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
    }

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

    private mGroupElementTemp: DisplayElementBase[] = [];
    //根据消除的元素列表，把上面元素往下移
    private MoveAfterEliminate(): boolean {
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
                            var moveInfo: EliminateMoveInfo = new EliminateMoveInfo(e, e.posx, e.posy - moveDownValue, e.posx, e.posy); // TODO：改成池子
                            this.eliminateInfo.MoveElements.push(moveInfo);
                        }
                    }
                }
            }
        }
        return hasMove;
    }

    // 计算某个位置下面的空槽数量(包括这个位置本身)
    private GetNullElementCountInDown(posX: number, posY: number): number {
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
    }

    // 获取某个坐标的元素
    private GetElement(posX: number, posY: number): DisplayElementBase {
        if (this.IsPosLegal(posX, posY)) {
            return this.sceneData[posX][posY];
        }
        return null;
    }

    // 一个坐标是否合法
    private IsPosLegal(posX: number, posY: number): boolean {
        if (posX >= 0 && posX < Scene.Columns
            && posY >= 0 && posY < Scene.Rows) {
            return true;
        }
    }

    // 把一个元素，从Data中移除
    private RemoveElement(element: DisplayElementBase): boolean {
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
    }

    // 把一个组元素，从Data中移除
    private RemoveElementGroup(elements: DisplayElementBase[]): boolean {
        var result = true;
        for (var i = 0; i < elements.length; ++i) {
            result = result && this.RemoveElement(elements[i])
        }
        return result;
    }

    // 把一个组元素，根据自带坐标，加到scene中
    private AddElementGroup(elements: DisplayElementBase[]): boolean {
        var result = true;
        for (var i = 0; i < elements.length; ++i) {
            result = result && this.AddElement(elements[i])
        }
        return result;
    }

    // 把一个元素，根据自带坐标，加到scene中
    private AddElement(element: DisplayElementBase): boolean {
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
    }

    // 判断一个元素是否需要被消除(横竖方向满足相邻的3个相同颜色的块)
    private NeedEliminate(element: DisplayElementBase): boolean {
        var needEliminate: boolean = false;
        var cloumnCount: number = 1;
        var rowCount: number = 1;
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

        if (cloumnCount >= 3
            || rowCount >= 3) {
            needEliminate = true;
        }

        return needEliminate;
    }
    //#####消除相关######

    public GetElementGroupMoveSpace(elements: DisplayElementBase[], dir: Direction): number {
        var space = 0;
        var result = this.RemoveElementGroup(elements);
        if (DEBUG) {
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

        if (minSpace >= 0){
            space = minSpace;
        }

        result = this.AddElementGroup(elements);
        if (DEBUG) {
            console.assert(result, "Can not add elements to scene after calac move space!");
        }
        return space;
    }

    public GetElementMoveSpace(element: DisplayElementBase, dir: Direction): number {
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
    }

    // 把一组元素，往某个方向移动
    public MoveElementGroup(elements: DisplayElementBase[], dir: Direction, step: number): boolean {
        var result = this.RemoveElementGroup(elements);
        if (DEBUG) {
            console.assert(result, "Can not move element while elements not in scene!");
        }

        for (var i = 0; i < elements.length; ++i) {
            elements[i].posx = Tools.MoveScenePosX(elements[i].posx, dir, step);
            elements[i].posy = Tools.MoveScenePosY(elements[i].posy, dir, step);
            elements[i].dirty = true;
        }

        result = this.AddElementGroup(elements);
        if (DEBUG) {
            console.assert(result, "Can not add elements to scene move!");
        }
        return result;
    }
}

enum Direction {
    Left,
    Right,
    Up,
    Down,
}