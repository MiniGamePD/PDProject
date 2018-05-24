class SceneVirus extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();       
        this.color = this.RandomColor(); 
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.Virus;
        this.RefreshTexture();
        this.eliminateSound = "VirusEliminate_mp3";
    }

    public RefreshTexture():void
    {
        let texture: egret.Texture;
        let path = "pd_res_json.Virus_";
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
        texture = this.GetTexture(path);
		this.renderer.texture = texture;
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
}