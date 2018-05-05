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
        event.displayElements = this.GetDisplayElements();
        GameMain.GetInstance().DispatchEvent(event);

        if(DEBUG)
            console.log("create virus " + posx + " " + posy);
    }

    protected FillDisplayElementArray()
    {
        this.displayElements.push(this.virusRenderer);
    }
}