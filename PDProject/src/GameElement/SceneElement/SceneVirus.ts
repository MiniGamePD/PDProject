class SceneVirus extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.color = this.RandomColor(); 
        this.renderer = new egret.Bitmap();
        this.accessory = new egret.DisplayObjectContainer();
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.Virus;
        this.RefreshTexture();
        this.eliminateSound = "VirusEliminate_mp3";
    }

    private GetAnimDelay(): number
    {
        var delay = 0;
        switch(this.color)
        {
            case GameElementColor.red:
                delay = 0;
                break;
            case GameElementColor.blue:
                delay = 250;
                break;
            case GameElementColor.yellow:
                delay = 500;
                break;
        }
        return delay;
    }

    private GetFramesAnimIdle()
    {
        if (this.color == GameElementColor.red)
        {
            return Frame_Anim_Virus_Red_Idle;
        }
        else if (this.color == GameElementColor.blue)
        {
            return Frame_Anim_Virus_Blue_Idle;
        }
        else if (this.color == GameElementColor.yellow)
        {
            return Frame_Anim_Virus_Yellow_Idle;
        }
        return [];
    }

    private CreateFramesAnim(): SyncFramesAnim
    {
        var framesAnim = new SyncFramesAnim();
        framesAnim.Init(<egret.Bitmap>this.renderer, this.GetFramesAnimIdle(), 100, this.GetAnimDelay());
        return framesAnim;
    }

    public RefreshTexture():void
    {
        this.framesAnim = this.CreateFramesAnim();
    }

    private GetResPrePath()
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

    protected GetResPathByColor():string
    {
        return this.GetResPrePath() + "_Idle1";
    }

    public PlayEliminateAnim()
    {
        this.PlayBoomEffect();
        this.PlayScaling();
    }
}