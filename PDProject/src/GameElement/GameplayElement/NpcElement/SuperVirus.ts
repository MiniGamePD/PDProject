class SuperVirus extends NpcElement
{
    public blockWidth:number;
    public blockHeight:number;

    private virusRenderer:SceneSuperVirus;
    private placeholderArray:ScenePlaceholder[];

    public constructor()
    {
        super();
        this.virusRenderer = new SceneSuperVirus(this, GameElementColor.red);
        this.virusRenderer.RefreshTexture();

        this.bornType = NpcBornType.Destroy;
        this.bornSound = "VirusBorn_mp3";
    }

    public MoveTo(posx:number, posy:number)
    {
        this.posx = posx;
        this.posy = posy;
        this.virusRenderer.MoveTo(posx, posy);
    }

    protected FillSceneElementArray()
    {
        for(var i = 0; i < this.placeholderArray.length; ++i)
        {
            this.sceneElements.push(this.placeholderArray[i]);
        }
    }

    public PlayAnim(animType:NpcAnimType)
    {
        
    }
}