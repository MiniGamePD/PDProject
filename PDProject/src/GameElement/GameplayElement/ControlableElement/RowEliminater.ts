//横排消除
class RowEliminater extends EliminateTool
{
    private sceneRowEliminater:SceneRowEliminater;
    private range: number;

    public constructor()
    {
        super();
        this.sceneRowEliminater = new SceneRowEliminater(this);
        this.sceneRowEliminater.MoveTo(3,0);
        this.eliminateType = EliminateType.Row;
        this.range = Scene.Columns;
    }

    //todo
    public OnRotateACW(){}
    public GetRotateACWPosList(): number[]
    {
        return null;
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.sceneRowEliminater);
    }
    
    public OnEliminate():boolean
    {
        var specialEliminateEvent = new SpecialEliminateRequestEvent();
        specialEliminateEvent.triggerElement = this.sceneRowEliminater;
        specialEliminateEvent.targetPosList = Tools.GetRowPosList(this.sceneRowEliminater.posx, this.sceneRowEliminater.posy, this.range);
        GameMain.GetInstance().DispatchEvent(specialEliminateEvent);
        return true;
    }
}