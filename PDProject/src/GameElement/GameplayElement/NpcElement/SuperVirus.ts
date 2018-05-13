class SuperVirus extends NpcElement
{
    public blockWidth:number;
    public blockHeight:number;

    private virusRenderer:SceneSuperVirus;
    private placeholderArray:ScenePlaceholder[];

    public constructor()
    {
        super();

        this.color = this.RandomColor();

        this.virusRenderer = new SceneSuperVirus(this);
        this.virusRenderer.RefreshTexture();

        this.placeholderArray = [];
        for(var i = 0; i < 7; ++i)
        {
            this.placeholderArray.push(new ScenePlaceholder(this));
        }
        //renderer固定都放在最后一个
        this.placeholderArray.push(this.virusRenderer);

        this.ArrangeSceneElementsPosByColor();

        this.bornType = NpcBornType.Destroy;
        this.bornSound = "VirusBorn_mp3";
    }

    public MoveTo(posx:number, posy:number)
    {
        //this.pos是super virus左上角点的位置
        this.posx = posx;
        this.posy = posy;
        for(var i = 0; i < this.placeholderArray.length; ++i)
        {
            this.placeholderArray[i].Move(posx, posy);
        }
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

    private ArrangeSceneElementsPosByColor()
    {
        if(this.color == GameElementColor.red)
        {
            //2x4
            // @@
            // @@
            // @@
            // @@
            this.placeholderArray[0].MoveTo(0,0);
            this.placeholderArray[1].MoveTo(1,0);
            this.placeholderArray[2].MoveTo(0,1);
            this.placeholderArray[3].MoveTo(1,1);
            this.placeholderArray[4].MoveTo(0,2);
            this.placeholderArray[5].MoveTo(1,2);
            this.placeholderArray[6].MoveTo(0,3);
            this.placeholderArray[7].MoveTo(1,3);
        }
        else if(this.color == GameElementColor.blue)
        {
            //3x3
            // @@@
            // @ @
            // @@@
            this.placeholderArray[0].MoveTo(0,0);
            this.placeholderArray[1].MoveTo(1,0);
            this.placeholderArray[2].MoveTo(2,0);
            this.placeholderArray[3].MoveTo(0,1);
            this.placeholderArray[4].MoveTo(2,1);
            this.placeholderArray[5].MoveTo(0,3);
            this.placeholderArray[6].MoveTo(1,3);
            this.placeholderArray[7].MoveTo(2,3);
        }
        else if(this.color == GameElementColor.yellow)
        {
            //4x2
            // @@@@
            // @@@@
            this.placeholderArray[0].MoveTo(0,0);
            this.placeholderArray[1].MoveTo(1,0);
            this.placeholderArray[2].MoveTo(2,0);
            this.placeholderArray[3].MoveTo(3,0);
            this.placeholderArray[4].MoveTo(0,1);
            this.placeholderArray[5].MoveTo(1,1);
            this.placeholderArray[6].MoveTo(2,1);
            this.placeholderArray[7].MoveTo(3,1);
        }
    }
}