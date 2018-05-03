class Virus extends LogicElementBase
{
    private virusRenderer:VirusRenderer;

    public constructor(posx:number, posy:number)
    {
        super();
        this.posx = posx;
        this.posy = posy;
        this.virusRenderer = new VirusRenderer();
        this.virusRenderer.RefreshTexture();
        this.virusRenderer.MoveTo(this.posx, this.posy);

        let event = new SceneElementControlEvent();
        event.controlType = SceneElementControlType.Add;
        event.targets = this.GetControledElements();
        GameMain.GetInstance().DispatchEvent(event);

        console.log("create virus " + posx + " " + posy);
    }

    protected FillTargets()
    {
        this.targets.push(this.virusRenderer);
    }
}