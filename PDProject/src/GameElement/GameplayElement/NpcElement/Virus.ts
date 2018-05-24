class Virus extends NpcElement
{
    private virusRenderer:SceneVirus;

    public constructor()
    {
        super();
        this.virusRenderer = new SceneVirus(this);
        this.virusRenderer.RefreshTexture();

        this.bornType = NpcBornType.Normal;
        this.bornSound = "VirusBorn_mp3";

        this.hp = 1;
        this.shield = 0;
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

    public PlayAnim(animType:NpcAnimType)
    {
        
    }

    public GetPreViewContainer():egret.DisplayObjectContainer
    {
        console.error("Not Implement Error");
        return null;
    }
}