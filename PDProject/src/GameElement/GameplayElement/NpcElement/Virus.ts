class Virus extends NpcElement
{
    private virusRenderer:SceneVirus;

    public constructor()
    {
        super();
        this.virusRenderer = new SceneVirus(this);
        this.virusRenderer.RefreshTexture();
    }

    public MoveTo(posx:number, posy:number)
    {
        this.posx = posx;
        this.posy = posy;
        this.virusRenderer.MoveTo(posx, posy);
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.virusRenderer);
    }
}