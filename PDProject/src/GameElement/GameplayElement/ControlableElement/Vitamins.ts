//维他命-炸弹
class Vitamins extends EliminateTool
{
    private sceneVitamins:SceneVitamins;

    public constructor()
    {
        super();
        this.sceneVitamins = new SceneVitamins(this);
        this.sceneVitamins.MoveTo(3,0);
        this.eliminateType = EliminateType.Range;
    }

    //todo
    public OnRotateACW(){}
    public GetRotateACWPosList(): number[]
    {
        return null;
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.sceneVitamins);
    }

    public OnOnEliminate():boolean
    {
        var specialEliminateEvent = new SpecialEliminateRequestEvent();
        specialEliminateEvent.triggerElement = this.sceneVitamins;
        specialEliminateEvent.targetPosList = Tools.GetSquareRangePosList(this.sceneVitamins.posx, this.sceneVitamins.posy, 1);
        GameMain.GetInstance().DispatchEvent(specialEliminateEvent);
        return true;
    }
}