class Virus extends GameplayElementBase
{
    private virusRenderer:LogicVirus;

    public constructor(posx:number, posy:number)
    {
        super();
        this.posx = posx;
        this.posy = posy;
        this.virusRenderer = new LogicVirus();
        this.virusRenderer.RefreshTexture();
        this.virusRenderer.MoveTo(this.posx, this.posy);

        let event = new SceneElementControlEvent();
        event.controlType = SceneElementControlType.Add;
        event.sceneElements = this.GetSceneElements();
        GameMain.GetInstance().DispatchEvent(event);

        if(DEBUG)
            console.log("create virus " + posx + " " + posy);
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.virusRenderer);
    }
}