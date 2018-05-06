//横排消除
class ColumnEliminater extends EliminateTool
{
    private sceneColumnEliminater:SceneColunmEliminater;
    private range: number;

    public constructor()
    {
        super();
        this.sceneColumnEliminater = new SceneColunmEliminater(this);
        this.sceneColumnEliminater.MoveTo(3,0);
        this.eliminateType = EliminateType.Cloumn;
        this.range = Scene.Rows;
    }

    //todo
    public OnRotateACW(){}
    public GetRotateACWPosList(): number[]
    {
        return null;
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.sceneColumnEliminater);
    }

    public OnOnEliminate():boolean
    {
        var specialEliminateEvent = new SpecialEliminateRequestEvent();
        specialEliminateEvent.triggerElement = this.sceneColumnEliminater;
        specialEliminateEvent.targetPosList = Tools.GetColunmPosList(this.sceneColumnEliminater.posx, this.sceneColumnEliminater.posy, this.range);
        GameMain.GetInstance().DispatchEvent(specialEliminateEvent);
        return true;
    }
}