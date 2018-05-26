class SceneVirus extends SceneElementBase
{
    private bubbleShield:egret.Bitmap;

    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();   
        this.accessory = new egret.DisplayObjectContainer();    
        this.color = this.RandomColor(); 
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.Virus;
        this.RefreshTexture();
        this.eliminateSound = "VirusEliminate_mp3";
        if(this.owner.HasShield())
            this.ShowBubbleShield();
    }

    protected GetResPathByColor():string
    {
        var path = "pd_res_json.Virus_";
        switch(this.color)
        {
            case GameElementColor.red:
                path += "Red";
                break;
            case GameElementColor.blue:
                path += "Blue";
                break;
            case GameElementColor.yellow:
                path += "Yellow";
                break;
            default:
                if(DEBUG)
                {
                    console.log("Unknow Color:" + this.color);
                }    
                break;
        }
        return path;
    }

    protected PlayParticalEff()
    {
        var param = new PaPlayParticalParam;
        param.textureName = "Particle_Virus_Boom";
        param.jsonName = "Particle_Virus_Boom";
        param.duration = 1000;
        param.emitDuration = 100;
        param.posX = Tools.ElementPosToGameStagePosX(this.posx);
        param.posY = Tools.ElementPosToGameStagePosY(this.posy);
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    public ShowBubbleShield()
    {
        this.CreateBubbleShield();
        this.accessory.addChild(this.bubbleShield);
    }

    public HideBubbleShield()
    {
        if(this.bubbleShield != undefined)
            this.accessory.removeChild(this.bubbleShield);
    }

    private CreateBubbleShield()
    {
        if(this.bubbleShield == undefined)
        {
            var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
            this.bubbleShield = res.CreateBitmapByName("pd_res_json.Particle_Boom_Bomb");
            this.bubbleShield.width = Tools.MatchViewElementWidth;
            this.bubbleShield.height = Tools.MatchViewElementHeight;
            this.bubbleShield.anchorOffsetX = Tools.MatchViewElementWidth / 2;
            this.bubbleShield.anchorOffsetY = Tools.MatchViewElementHeight / 2;
        }
    }

    public OnEliminate():boolean
    {
        var result = super.OnEliminate();
        if(!this.owner.HasShield())
        {
            this.HideBubbleShield();
        }
        return result;
    }
}