class SceneVirus extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.color = this.RandomColor(); 
        this.renderer = this.CreateAnimator(this.GetPreAnimName("Idle"));
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.Virus;
        this.RefreshTexture();
        this.eliminateSound = "VirusEliminate_mp3";
    }

    private CreateAnimator(name: string): dragonBones.EgretArmatureDisplay
    {
        let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
		return egretFactory.buildArmatureDisplay(name);
    }

    public Adapte(width: number, height: number)
    {
        this.renderer.width = width;
        this.renderer.height = height;
    }

    public RefreshTexture():void
    {
        var time = egret.getTimer();
        var passTime = time % 500;
        (<dragonBones.EgretArmatureDisplay> this.renderer).animation.play(this.GetPreAnimName("Idle"), -1);
        (<dragonBones.EgretArmatureDisplay> this.renderer).animation.advanceTime(passTime);
    }

    private GetPreAnimName(anim: string): string
    {
        var name = "Virus_";
        switch(this.color)
        {
            case GameElementColor.red:
                name += "Red";
                break;
            case GameElementColor.blue:
                name += "Blue";
                break;
            case GameElementColor.yellow:
                name += "Yellow";
                break;
            default:
                if(DEBUG)
                {
                    console.log("Unknow Color:" + this.color);
                }    
                break;
        }
        name += "_" + anim;
        return name;
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

    public PlayEliminateAnim()
    {
        this.PlayBoomEffect();
        this.PlayScaling();
    }
}