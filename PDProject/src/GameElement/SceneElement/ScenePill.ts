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

    protected GetResPathByColor():string
    {
        var resPath = "pd_res_json.Pill_";
        if (this.mPillType == PillElementType.Single)
        {
            resPath += "Single_"
        }
        switch (this.color)
        {
            case GameElementColor.red:
                resPath += "Red";
                break;
            case GameElementColor.blue:
                resPath += "Blue";
                break;
            case GameElementColor.yellow:
                resPath += "Yellow";
                break;
            default:
                if (DEBUG)
                {
                    console.log("Unknow Color:" + this.color);
                }
                break;
        }
        return resPath;
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
}

enum PillElementType
{
    left,   //左边
    right,  //右边
    up,     //上边
    down,   //下边
    Single, //独立
}