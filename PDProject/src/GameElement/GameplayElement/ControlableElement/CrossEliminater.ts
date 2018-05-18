//横排消除
class CrossEliminater extends EliminateTool
{
    private sceneCrossEliminater:SceneCrossEliminater;
    private range: number;

    public constructor()
    {
        super();
        this.sceneCrossEliminater = new SceneCrossEliminater(this);
        this.sceneCrossEliminater.MoveTo(3,0);
        this.eliminateType = EliminateType.Cloumn;
        this.range = Math.max(Scene.Rows, Scene.Columns);
    }

    //todo
    public OnRotateACW(){}
    public GetRotateACWPosList(): number[]
    {
        return null;
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.sceneCrossEliminater);
    }

    public OnEliminate():boolean
    {
        var specialEliminateEvent = new SpecialEliminateRequestEvent();
        specialEliminateEvent.triggerElement = this.sceneCrossEliminater;
        specialEliminateEvent.targetPosList = Tools.GetCrossPosList(this.sceneCrossEliminater.posx, this.sceneCrossEliminater.posy, this.range);
        GameMain.GetInstance().DispatchEvent(specialEliminateEvent);
        return true;
    }
}