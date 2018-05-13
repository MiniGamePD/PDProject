//MVC中的M
class Scene extends GameModuleComponentBase 
{
    public static readonly Columns: number = 8;
    public static readonly Rows: number = 16;
    public static readonly EliminateMinCount = 3; //触发消除的最小数量
    public sceneData: SceneElementBase[][] = []; //左上角是00    
    public eliminateInfo: EliminateInfo;

    private controlSuccessEvent: SceneElementControlSuccessEvent;
    private controlFailedEvent: SceneElementControlFailedEvent;
    private eliminateEvent: EliminateEvent;

    private eliminateMethod: EliminateMethod;
    private eliminateUnMove: boolean;

    public Init(): void 
    {
        this.eliminateInfo = new EliminateInfo();
        for (var i = 0; i < Scene.Columns; ++i) 
        {
            this.sceneData.push([]);
            for (var j = 0; j < Scene.Rows; ++j) 
            {
                this.sceneData[i].push(null);
            }
        }

        this.eliminateMethod = new EliminateMethod();
        this.eliminateMethod.Reset();

        this.eliminateUnMove = false;

        this.controlSuccessEvent = new SceneElementControlSuccessEvent();
        this.controlFailedEvent = new SceneElementControlFailedEvent();
        this.eliminateEvent = new EliminateEvent();

        GameMain.GetInstance().AddEventListener(SceneElementControlEvent.EventName, this.ProcessControlCmd, this);
        GameMain.GetInstance().AddEventListener(SpecialEliminateRequestEvent.EventName, this.ProcessSpecialEliminateRequest, this);
        GameMain.GetInstance().AddEventListener(SceneElementAccessEvent.EventName, this.OnAccessSceneElements, this);
    }

    public Release() 
    {
        GameMain.GetInstance().RemoveEventListener(SceneElementControlEvent.EventName, this.ProcessControlCmd, this);
        GameMain.GetInstance().RemoveEventListener(SpecialEliminateRequestEvent.EventName, this.ProcessSpecialEliminateRequest, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementAccessEvent.EventName, this.OnAccessSceneElements, this);
    }

    private ProcessControlCmd(event: SceneElementControlEvent) 
    {
        let operationSuccess: boolean = true;

        var elementList = event.sceneElements;
        switch (event.controlType) 
        {
            case SceneElementControlType.Add:
                {
                    operationSuccess = this.AddElementGroup(elementList);
                    break;
                }
            case SceneElementControlType.Move:
                {
                    operationSuccess = this.GetElementGroupMoveSpace(elementList, event.moveDir) >= event.moveStep;
                    if (operationSuccess)
                        this.MoveElementGroup(elementList, event.moveDir, event.moveStep);
                    break;
                }
            case SceneElementControlType.Rotation:
                {
                    operationSuccess = this.IsCanRotateAcwTarget(elementList, event.rotateTargetPosList);
                    if (operationSuccess)
                        this.RotateAcwTarget(elementList, event.rotateTargetPosList);
                    break;
                }
            default:
                operationSuccess = false;
                break;
        }

        if (operationSuccess) 
        {
            this.controlSuccessEvent = new SceneElementControlSuccessEvent();
            this.controlSuccessEvent.controlType = event.controlType;
            this.controlSuccessEvent.moveDir = event.moveDir;
            this.controlSuccessEvent.moveStep = event.moveStep;
            this.controlSuccessEvent.playerControl = event.playerControl;
            GameMain.GetInstance().DispatchEvent(this.controlSuccessEvent);
        }
        else 
        {
            this.controlFailedEvent = new SceneElementControlFailedEvent();
            this.controlFailedEvent.controlType = event.controlType;
            this.controlFailedEvent.moveDir = event.moveDir;
            this.controlFailedEvent.moveStep = event.moveStep;
            this.controlFailedEvent.playerControl = event.playerControl;
            GameMain.GetInstance().DispatchEvent(this.controlFailedEvent);
        }
    }

    //把Element移动到newPos，并把老位置制成null
    private MoveElement(element: SceneElementBase, newPosx: number, newPosy: number): boolean
    {
        var result = false;
        if (this.IsPosLegal(newPosx, newPosy)
            && this.sceneData[newPosx][newPosy] == null)
        {

            // 清空现在的位置
            if (this.IsPosLegal(element.posx, element.posy)
                && this.sceneData[element.posx][element.posy] == element)
            {
                this.sceneData[element.posx][element.posy] = null;
            }

            // 移动到目标位置            
            this.sceneData[newPosx][newPosy] = element;
            element.MoveTo(newPosx, newPosy);
            result = true;
        }
        return result;
    }

    public Update(deltaTime: number)
    {
        this.CheckEliminating();
    }

    // 设置下一次消除方法
    public SetEliminateMethodNext(methodType: EliminateMethodType, color?: GameElementColor, region?: number[], elementType?: EliminateElementType)
    {
        this.eliminateMethod.methodType = methodType;

        if (elementType != null)
            this.eliminateMethod.eliminateElementType = elementType;

        var hasSetParam = false;

        switch (methodType)
        {
            case EliminateMethodType.SpecificColor:
            {
                if (color != null && color != undefined)
                {
                    this.eliminateMethod.specificColor = color;
                    hasSetParam = true;
                }
                break;
            }
            case EliminateMethodType.SpecificRegion:
            {
                if (region != null && region != undefined)
                {
                    this.eliminateMethod.specificRegion = region;
                    hasSetParam = true;
                }
                break;
            }
            case EliminateMethodType.SpecificRegionAndColor:
            {
                if (color != null && color != undefined && region != null && region != undefined)
                {
                    this.eliminateMethod.specificColor = color;
                    this.eliminateMethod.specificRegion = region;
                    hasSetParam = true;
                }
                break;
            }
        }

        if (DEBUG)
        {
            console.assert(hasSetParam, "Scene SetEliminateMethodNext() param error!");
        }
    }

    // 设置下一次消除后，不进行下落
    public SetNextEliminateUnMove()
    {
        this.eliminateUnMove = true;
    }

    //#####消除相关######
    public TryEliminate(): boolean
    {
        this.ClearEliminateInfo();
        this.EliminateElement();
        if (!this.eliminateUnMove)
        {
            do
            {
                var hasMove = this.MoveAfterEliminate();
                if (hasMove)
                {
                    this.eliminateInfo.HasInfo = true;
                }
            } while (hasMove)
        }
        var result = this.eliminateInfo.HasInfo;
        return result;
    }

    private FinishEliminate()
    {
        let newEvent = new SceneEliminateFinishEvent();
        GameMain.GetInstance().DispatchEvent(newEvent);
    }

    public CheckEliminating()
    {
        if (this.isWorking && !this.eliminateInfo.HasInfo)
        {
            var result = this.TryEliminate();
            this.eliminateMethod.Reset();
            if (!result)
            {
                this.eliminateUnMove = false;
                this.FinishEliminate();
            }
            else
            {
                this.DispatchEliminateEvent();
            }
        }
    }

    private DispatchEliminateEvent()
    {
        if (this.eliminateInfo != null
            && this.eliminateInfo.HasInfo)
        {
            this.eliminateEvent.eliminateInfo = this.eliminateInfo;
            GameMain.GetInstance().DispatchEvent(this.eliminateEvent);
        }
    }

    // 重置eliminateInfo
    public ClearEliminateInfo()
    {
        if (this.eliminateInfo.HasInfo)
        {
            this.eliminateInfo.Reset();
        }
    }

    // 判断某个元素是否在消除列表里面
    private IsElementInEliminateList(element: SceneElementBase): boolean
    {
        var inList = false;
        for (var count = 0; count < this.eliminateInfo.EliminatedElements.length; ++count)
        {
            if (element == this.eliminateInfo.EliminatedElements[count])
            {
                inList = true;
                break;
            }
        }
        return inList;
    }

    // 计算消除元素，把消除的元素放到this.eliminateInfo.EliminatedElements列表
    private EliminateElement()
    {
        for (var iColumn = 0; iColumn < this.sceneData.length; ++iColumn)
        {
            var cloumnList = this.sceneData[iColumn];
            for (var iRow = 0; iRow < cloumnList.length; ++iRow)
            {
                var element = cloumnList[iRow];
                if (element != null
                    && !this.IsElementInEliminateList(element)
                    && this.NeedEliminate(element))
                {
                    this.eliminateInfo.EliminatedElements.push(element);
                    element.UnbindAllElement();
                    this.eliminateInfo.HasInfo = true;
                    element.OnEliminate();
                }
            }
        }

        // 把元素从Scene中移除
        if (this.eliminateInfo.HasInfo)
        {
            for (var count = 0; count < this.eliminateInfo.EliminatedElements.length; ++count)
            {
                var eliminatedElement = this.eliminateInfo.EliminatedElements[count];
                if (this.IsNeedRemoveAfterEliminate(eliminatedElement))
                {
                    this.RemoveElement(eliminatedElement);
                }
            }
        }
    }

    // 把元素触发消除后，是否需要从Scene中移除
    private IsNeedRemoveAfterEliminate(element: SceneElementBase)
    {
        if (element != null
            && element.ElementType() != SceneElementType.None
            && element.ElementType() != SceneElementType.PlaceHolder)
        {
            return true;
        }
        return false;
    }

    // 处理特殊消除要求
    private ProcessSpecialEliminateRequest(event: SpecialEliminateRequestEvent)
    {
        if (event != null
            && event.targetPosList != null)
        {
            this.eliminateInfo.SpecialEliminatedElement.push(event.triggerElement);
            for (var i = 1; i < event.targetPosList.length; i += 2)
            {
                var posx = event.targetPosList[i - 1];
                var posy = event.targetPosList[i];
                var element = this.GetElement(posx, posy);
                if (element != null
                    && !this.IsElementInEliminateList(element))
                {
                    this.eliminateInfo.EliminatedElements.push(element);
                    element.UnbindAllElement();
                    this.eliminateInfo.HasInfo = true;
                    element.OnEliminate();
                }
            }
        }
    }

    private 

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

    private mGroupElementTemp: SceneElementBase[] = [];
    //根据消除的元素列表，把上面元素往下移
    private MoveAfterEliminate(): boolean
    {
        var hasMove = false;
        for (var y = Scene.Rows - 1; y >= 0; --y)
        {
            for (var x = Scene.Columns - 1; x >= 0; --x)
            {
                var upElement = this.GetElement(x, y);
                if (upElement != null
                    && upElement.canDrop)
                {
                    this.mGroupElementTemp = [];
                    this.mGroupElementTemp.push(upElement);
                    var bindElements = upElement.GetBindElements();
                    for (var i = 0; i < bindElements.length; ++i)
                    {
                        this.mGroupElementTemp.push(bindElements[i]);
                    }
                    var moveDownValue = this.GetElementGroupMoveSpace(this.mGroupElementTemp, Direction.Down);
                    if (moveDownValue > 0)
                    {
                        var result = this.MoveElementGroup(this.mGroupElementTemp, Direction.Down, moveDownValue);
                        hasMove = true;
                        for (var moveCount = 0; moveCount < this.mGroupElementTemp.length; ++moveCount)
                        {
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
    private GetNullElementCountInDown(posX: number, posY: number): number
    {
        var count = 0;
        for (var downIdx = posY; downIdx < Scene.Rows; ++downIdx)
        {
            if (this.GetElement(posX, downIdx) == null)
            {
                ++count;
            }
            else
            {
                break;
            }
        }

        return count;
    }

    // 获取某个坐标的元素
    private GetElement(posX: number, posY: number): SceneElementBase
    {
        if (this.IsPosLegal(posX, posY))
        {
            return this.sceneData[posX][posY];
        }
        return null;
    }

    // 一个坐标是否合法
    private IsPosLegal(posX: number, posY: number): boolean
    {
        if (posX >= 0 && posX < Scene.Columns
            && posY >= 0 && posY < Scene.Rows)
        {
            return true;
        }
    }

    // 把一个元素，从Data中移除
    private RemoveElement(element: SceneElementBase): boolean
    {
        if (element != null)
        {
            var posX = element.posx;
            var posY = element.posy;
            if (this.IsPosLegal(posX, posY)
                && this.sceneData[posX][posY] == element)
            {
                this.sceneData[posX][posY] = null;
                return true;
            }
        }
        return false;
    }

    // 把一个组元素，从Data中移除
    private RemoveElementGroup(elements: SceneElementBase[]): boolean
    {
        var result = true;
        for (var i = 0; i < elements.length; ++i)
        {
            result = result && this.RemoveElement(elements[i])
        }
        return result;
    }

    // 把一个组元素，根据自带坐标，加到scene中
    private AddElementGroup(elements: SceneElementBase[]): boolean
    {
        var result = true;
        for (var i = 0; i < elements.length; ++i)
        {
            result = result && this.AddElement(elements[i])
        }
        return result;
    }

    // 把一个元素，根据自带坐标，加到scene中
    private AddElement(element: SceneElementBase): boolean
    {
        if (element != null)
        {
            var posX = element.posx;
            var posY = element.posy;
            if (this.IsPosLegal(posX, posY)
                && this.sceneData[posX][posY] == null)
            {
                this.sceneData[posX][posY] = element;
                return true;
            }
        }
        return false;
    }

    // 判断一个元素是否需要被消除(横竖方向满足相邻的3个相同颜色的块)
    private NeedEliminateByBorder(element: SceneElementBase): boolean
    {
        var needEliminate: boolean = false;
        var cloumnCount: number = 1;
        var rowCount: number = 1;
        for (var up = element.posy - 1; up >= 0; --up)
        {
            var e = this.GetElement(element.posx, up);
            if (e != null
                && e.color == element.color)
            {
                ++cloumnCount;
            }
            else
            {
                break;
            }
        }

        for (var down = element.posy + 1; down < Scene.Rows; ++down)
        {
            var e = this.GetElement(element.posx, down);
            if (e != null
                && e.color == element.color)
            {
                ++cloumnCount;
            }
            else
            {
                break;
            }
        }

        for (var left = element.posx - 1; left >= 0; --left)
        {
            var e = this.GetElement(left, element.posy);
            if (e != null
                && e.color == element.color)
            {
                ++rowCount;
            }
            else
            {
                break;
            }
        }

        for (var right = element.posx + 1; right < Scene.Columns; ++right)
        {
            var e = this.GetElement(right, element.posy);
            if (e != null
                && e.color == element.color)
            {
                ++rowCount;
            }
            else
            {
                break;
            }
        }

        if (cloumnCount >= element.eliminateMinCount
            || rowCount >= element.eliminateMinCount)
        {
            needEliminate = true;
        }

        return needEliminate;
    }

    // 判断一个元素是否需要被消除(按指定颜色)
    private NeedEliminateByColor(element: SceneElementBase, color: GameElementColor): boolean
    {
        if (element != null
            && element.color == color)
        {
            return true;
        }
        return false;
    }

    // 判断一个元素是否需要被消除(按指定区域)
    private NeedEliminateByRegion(element: SceneElementBase, region: number[]): boolean
    {
        if (element != null && region != null)
        {
            for (var i = 1; i < region.length; i += 2)
            {
                if (element.posx == region[i - 1]
                    && element.posy == region[i])
                {
                    return true;
                }
            }
        }
        return false;
    }

    // 判断一个element是否属于对应的消除类型
    private IsEliminateType(element: SceneElementBase, type: EliminateElementType): boolean
    {
        var result = false;
        if(element != null)
        {
            switch (type)
            {
                case EliminateElementType.Normal:
                {
                    result = true;
                    break;
                }
                case EliminateElementType.PillOnly:
                {
                    result = element.ElementType() == SceneElementType.Pill
                    break;
                }
                case EliminateElementType.VirusOnly:
                {
                    result = element.ElementType() == SceneElementType.Virus
                    break;
                }
                case EliminateElementType.PillAndVirus:
                {
                    result = element.ElementType() == SceneElementType.Pill 
                        || element.ElementType() == SceneElementType.Virus;
                    break;
                }
            }
        }
        return result;
    }

    // 判断一个元素是否需要被消除
    private NeedEliminate(element: SceneElementBase): boolean
    {
        var needEliminate: boolean = false;
        if (this.IsEliminateType(element, this.eliminateMethod.eliminateElementType))
        {
            if (this.eliminateMethod.methodType == EliminateMethodType.Normal)
            {
                needEliminate = this.NeedEliminateByBorder(element);
            }
            else if (this.eliminateMethod.methodType == EliminateMethodType.SpecificColor)
            {
                needEliminate = this.NeedEliminateByColor(element, this.eliminateMethod.specificColor);
            }
            else if (this.eliminateMethod.methodType == EliminateMethodType.SpecificRegion)
            {
                needEliminate = this.NeedEliminateByRegion(element, this.eliminateMethod.specificRegion);
            }
            else if (this.eliminateMethod.methodType == EliminateMethodType.SpecificRegionAndColor)
            {
                needEliminate = this.NeedEliminateByColor(element, this.eliminateMethod.specificColor)
                                && this.NeedEliminateByRegion(element, this.eliminateMethod.specificRegion);
            }
        }
        return needEliminate;
    }
    //#####消除相关######

    public GetElementGroupMoveSpace(elements: SceneElementBase[], dir: Direction): number
    {
        var space = 0;
        var result = this.RemoveElementGroup(elements);
        if (DEBUG)
        {
            console.assert(result, "Can not calac move space while elements not in scene!");
        }

        var minSpace = -1;
        for (var i = 0; i < elements.length; ++i)
        {
            var moveSpace = this.GetElementMoveSpace(elements[i], dir);
            if (minSpace < 0
                || minSpace > moveSpace)
            {
                minSpace = moveSpace;
            }
        }

        if (minSpace >= 0)
        {
            space = minSpace;
        }

        result = this.AddElementGroup(elements);
        if (DEBUG)
        {
            console.assert(result, "Can not add elements to scene after calac move space!");
        }
        return space;
    }

    public GetElementMoveSpace(element: SceneElementBase, dir: Direction): number
    {
        var space = 0;
        if (element != null)
        {
            var posX = Tools.MoveScenePosX(element.posx, dir, 1);
            var posY = Tools.MoveScenePosY(element.posy, dir, 1);
            while (this.IsPosLegal(posX, posY)
                && this.GetElement(posX, posY) == null)
            {
                ++space;
                posX = Tools.MoveScenePosX(posX, dir, 1);
                posY = Tools.MoveScenePosY(posY, dir, 1);
            }
        }
        return space;
    }

    // 把一组元素，往某个方向移动
    public MoveElementGroup(elements: SceneElementBase[], dir: Direction, step: number): boolean
    {
        var result = this.RemoveElementGroup(elements);
        if (DEBUG)
        {
            console.assert(result, "Can not move element while elements not in scene!");
        }

        for (var i = 0; i < elements.length; ++i)
        {
            elements[i].posx = Tools.MoveScenePosX(elements[i].posx, dir, step);
            elements[i].posy = Tools.MoveScenePosY(elements[i].posy, dir, step);
            elements[i].dirty = true;
        }

        result = this.AddElementGroup(elements);
        if (DEBUG)
        {
            console.assert(result, "Can not add elements to scene move!");
        }
        return result;
    }

    // 是否可以逆时针旋转目标
    public IsCanRotateAcwTarget(elements: SceneElementBase[], targetPosList: number[]): boolean
    {
        var canRotate = false;
        if (elements != null
            && targetPosList != null
            && elements.length * 2 == targetPosList.length)
        {
            var result = this.RemoveElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not query rotate while elements not in scene!");
            }

            canRotate = true;
            for (var i = 1; i < targetPosList.length; i += 2)
            {
                var posX = targetPosList[i - 1];
                var posY = targetPosList[i];
                canRotate = canRotate && this.IsPosLegal(posX, posY) && this.GetElement(posX, posY) == null
            }

            result = this.AddElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not add elements to scene after query rotate!");
            }
        }
        return canRotate;
    }

    // 是否可以逆时针旋转目标
    public RotateAcwTarget(elements: SceneElementBase[], targetPosList: number[]): boolean
    {
        var result = false;

        if (elements != null
            && targetPosList != null
            && elements.length * 2 == targetPosList.length)
        {
            result = this.RemoveElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not rotate while elements not in scene!");
            }

            var elementIndex = 0;
            for (var i = 1; i < targetPosList.length; i += 2)
            {
                elements[elementIndex].posx = targetPosList[i - 1];
                elements[elementIndex].posy = targetPosList[i];
                elements[elementIndex].dirty = true;
                ++elementIndex;
            }

            result = this.AddElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not add elements to scene after rotate!");
            }
        }
        return result;
    }

    private OnAccessSceneElements(event: SceneElementAccessEvent)
    {
        let queryElementBlocks: number[][] = null;

        switch (event.accessType)
        {
            case SceneElementAccessType.GetEmptyBlocks:
                {
                    queryElementBlocks = this.GetSpecifiedBlocks(this.IsEmptyElement, event.startX, event.startY, event.endX, event.endY);
                    break;
                }
            case SceneElementAccessType.GetPlaceholderBlocks:
                {
                    queryElementBlocks = this.GetSpecifiedBlocks(this.IsPlaceholderElement, event.startX, event.startY, event.endX, event.endY);
                    break;
                }
            default:
                {
                    console.error("Unknow access type " + event.accessType);
                    break;
                }
        }

        if (queryElementBlocks != null)
        {
            let answerEvent = new SceneElementAccessAnswerEvent();
            answerEvent.accessType = event.accessType;
            answerEvent.queryElementBlocks = queryElementBlocks;
            GameMain.GetInstance().DispatchEvent(answerEvent);
        }
    }

    private IsEmptyElement(element:SceneElementBase):boolean
    {
        return element == null;
    }

    private IsPlaceholderElement(element:SceneElementBase):boolean
    {
        return element != null && element != undefined && element instanceof ScenePlaceholder;
    }

    private GetSpecifiedBlocks(condition:Function, startX: number, startY: number, endX?: number, endY?: number): number[][]
    {
        let result: number[][] = undefined;

        if (endX == undefined)
            endX = Scene.Columns - 1;
        if (endY == undefined)
            endY = Scene.Rows - 1;

        if (startX <= endX || startY <= endY)
        {
            result = [];
            //X is Column
            for (var i = startX; i <= endX; ++i)
            {
                //Y is Row
                for (var j = startY; j <= endY; ++j)
                {
                    if (condition(this.sceneData[i][j]))
                    {
                        let block: number[] = [];
                        block.push(i);
                        block.push(j);
                        result.push(block);
                    }
                }
            }
        }
        else
        {
            console.error("GetSpecifiedBlocks With Invalid Range:" + startX + "," + startY + "," + endX + "," + endY);
        }

        return result;
    }
}

enum SceneElementControlType
{
    Add,
    Move,
    Rotation,
}

enum SceneElementAccessType
{
    GetEmptyBlocks,
    GetPlaceholderBlocks,
}

enum Direction 
{
    Left,
    Right,
    Up,
    Down,
}