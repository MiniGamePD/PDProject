class ScenePill extends SceneElementBase
{
    public mPillType: PillElementType;
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();
        this.color = this.RandomColor();
        this.canDrop = true;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.Pill;
    }

    public SetPillType(pillType: PillElementType)
    {
        this.mPillType = pillType;
        this.dirty = true;
    }

    public RefreshTexture(): void
    {
        super.RefreshTexture();
        let texture: egret.Texture;
        let path = "pd_res_json.Pill_";
        if (this.mPillType == PillElementType.Single)
        {
            path += "Single_"
        }
        switch (this.color)
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
                if (DEBUG)
                {
                    console.log("Unknow Color:" + this.color);
                }
                break;
        }
        texture = this.GetTexture(path);
        this.renderer.texture = texture;

        var textureRotate = 0;
        var scaleX = 1;
        switch (this.mPillType)
        {
            case PillElementType.left:
                {
                    textureRotate = 0;
                    scaleX = 1;
                    break;
                }
            case PillElementType.right:
                {
                    textureRotate = 0;
                    scaleX = -1;
                    break;
                }
            case PillElementType.up:
                {
                    textureRotate = 90;
                    scaleX = 1;
                    break;
                }
            case PillElementType.down:
                {
                    textureRotate = 90;
                    scaleX = -1;
                    break;
                }
        }
        this.renderer.rotation = textureRotate;
        this.renderer.scaleX = scaleX;
    }

    // 删除捆绑元素后，重新计算药丸的类型
    public UnbindElement(element: SceneElementBase): boolean
    {
        var result = super.UnbindElement(element);
        if (result
            && this.GetBindElements().length == 0)
        {
            this.SetPillType(PillElementType.Single);
        }
        return result;
    }

    // 删除捆绑元素后，重新计算药丸的类型
    public UnbindAllElement()
    {
        super.UnbindAllElement();
        this.SetPillType(PillElementType.Single);
    }

    public PlayEliminateAnim()
    {
        var param = new PaPlayParticalParam;
        param.textureName = "Particle_Boom_Red";
        param.jsonName = "Particle_Boom";
        param.duration = 100;
        param.posX = Tools.ElementPosToGameStagePosX(this.posx);
        param.posY = Tools.ElementPosToGameStagePosX(this.posy);
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }
}

enum PillElementType
{
    left,   //左边
    right,  //右边
    up,     //上边
    down,   //下边
    Single, //独立
}