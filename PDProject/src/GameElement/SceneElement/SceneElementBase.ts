//在scene中占一个格子的元素，处理显示相关，和一些与消除相关逻辑，并转发gameplay的逻辑给到GameplayElement层
abstract class SceneElementBase
{
    public posx: number = 0;
    public posy: number = 0;
    public canDrop: boolean = true;
    public color: GameElementColor;
    public renderer: egret.Bitmap;
    public dirty: boolean;
    public hasAddToDisplayList: boolean;
    protected resModule: IResModule;
    private bindedElements: SceneElementBase[];
    protected owner:GameplayElementBase;
    public eliminateMinCount: number;
    public eliminateSound: string;
    protected elementType: SceneElementType;
    public accessory:egret.DisplayObjectContainer; //用来放一些除本体外的东西，比如护盾，血条

    public constructor(owner:GameplayElementBase) 
    {
        this.owner = owner;
        this.bindedElements = [];
    }

    public ElementType(): SceneElementType
    {
        return this.elementType;
    }

    public MoveTo(posx: number, posy: number) 
    {
        if (this.posx != posx
            || this.posy != posy) 
        {
            this.posx = posx;
            this.posy = posy;
            this.dirty = true;
        }
    }

    public Move(posx: number, posy: number) 
    {
        this.posx += posx;
        this.posy += posy;
        this.dirty = true;
    }

    protected RandomColor(): GameElementColor 
    {
        return GameElementColorGenerator.RandomColor();    
    }

    public RefreshTexture():void
    {
        let texture: egret.Texture;
        let path = this.GetResPathByColor();
        texture = this.GetTexture(path);
		this.renderer.texture = texture;
    }

    protected abstract GetResPathByColor():string;

    protected GetTexture(path: string): egret.Texture {
        if (this.resModule == null) {
            this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        }
        return this.resModule.GetRes(path);
    }

    // 返回捆绑元素的列表
    public GetBindElements(): SceneElementBase[] {
        return this.bindedElements;
    }

    // 和某个元素绑定（双向）
    public BindElement(element: SceneElementBase): boolean {
        if (element != null) {
            let index = this.bindedElements.indexOf(element);
            if (index < 0) {
                this.bindedElements.push(element);
                element.BindElement(this);
                return true;
            }
        }
        return false;
    }

    // 和某个元素解除绑定（双向）
    public UnbindElement(element: SceneElementBase): boolean {
        if (element != null) {
            let index = this.bindedElements.indexOf(element);
            if (index >= 0) {
                this.bindedElements.splice(index, 1)
                element.UnbindElement(this);
                return true;
            }
        }
        return false;
    }

    // 和所有元素绑定（双向）    
    public UnbindAllElement() {
        for (var index = this.bindedElements.length - 1; index >= 0; --index) {
            var element = this.bindedElements[index];
            if (element != null) {
                element.UnbindElement(this);
            }
        }
        this.bindedElements = [];
    }

    //处理一个scene element被消除之后的逻辑，返回true来让scene继续进入消除检测
    public OnEliminate():boolean
    {
        return this.owner.OnEliminate();
    }

    public BlockWidth():number
    {
        return this.owner.blockWidth;
    }

    public BlockHeight():number
    {
        return this.owner.blockHeight;
    }

    public IsOwnerAlive():boolean
    {
        return this.owner.IsAlive();
    }

    public HasShield():boolean
    {
        return this.owner.HasShield();
    } 
    
    public PlayEliminateAnim()
    {
        this.PlayParticalEff();
        this.PlayScaling();
    }

    protected PlayParticalEff()
    {
        var param = new PaPlayParticalParam;
        param.textureName = "Particle_Boom_Red";
        param.jsonName = "Particle_Boom";
        param.duration = 1000;
        param.emitDuration = 100;
        param.posX = Tools.ElementPosToGameStagePosX(this.posx);
        param.posY = Tools.ElementPosToGameStagePosY(this.posy);
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    protected PlayScaling()
    {
       var param = new PaScalingParam;
        param.displayObj = this.renderer;
        param.duration = 100;
        param.targetScaleX = 0;
        param.targetScaleY = 0;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    public MoveOneSide(dir: Direction)
    {
        var startX = Tools.ElementPosToGameStagePosX(this.posx);
        var startY = Tools.ElementPosToGameStagePosY(this.posy);
        var particleOffset = -100;
        var targetOffset = Math.max(GameMain.GetInstance().GetStageHeight(), 
                                    GameMain.GetInstance().GetStageWidth())

        var particalParam = new PaMoveParticalParam;
        particalParam.textureName = "huojian";
        particalParam.jsonName = "huojian";
		particalParam.duration = 1000;
		particalParam.flyDuration = 1000;
		particalParam.stayDuration = 0;
        particalParam.stratPosX = Tools.MoveScenePosX(startX, dir, particleOffset);
		particalParam.stratPosY = Tools.MoveScenePosY(startY, dir, particleOffset);
		particalParam.endPosX = Tools.MoveScenePosX(startX, dir, targetOffset + particleOffset);
		particalParam.endPosY = Tools.MoveScenePosY(startY, dir, targetOffset + particleOffset);
		particalParam.isMoveEmitter = true;
		var event = new PlayProgramAnimationEvent();
        event.param = particalParam;
        GameMain.GetInstance().DispatchEvent(event);

        var headPic = this.resModule.CreateBitmapByName("huojian1");
        headPic.anchorOffsetX = headPic.width / 2;
        headPic.anchorOffsetY = headPic.height / 2;
        headPic.x = startX;
        headPic.y = startY;
        GameMain.GetInstance().GetAdaptedStageContainer().addChild(headPic);
        var movingParam = new PaMovingParam;
        movingParam.displayObj = headPic;
        movingParam.duration = 1000;
        movingParam.targetPosX = Tools.MoveScenePosX(startX, dir, targetOffset);
        movingParam.targetPosY = Tools.MoveScenePosY(startY, dir, targetOffset);
        movingParam.needRotate = true;
        movingParam.needRemoveOnFinish = true;
        var event = new PlayProgramAnimationEvent();
        event.param = movingParam;
        GameMain.GetInstance().DispatchEvent(event);
    }

    public GetPreView():egret.Bitmap
    {
        var resPath = this.GetResPathByColor();
        if(resPath != null)
        {
            var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
            var preview = res.CreateBitmapByName(resPath);
            preview.width = Tools.MatchViewElementWidth;
            preview.height = Tools.MatchViewElementHeight;
            preview.anchorOffsetX = Tools.MatchViewElementWidth / 2;
            preview.anchorOffsetY = Tools.MatchViewElementHeight / 2;
            return preview;
        }
        return null;
    }
}

enum GameElementColor 
{
    red,
    blue,
    yellow,
    random,
}

class GameElementColorGenerator
{
    public static RandomColor(iDontWantThatDolor?:GameElementColor):GameElementColor
    {
        let result:GameElementColor = undefined;
        do
        {
            let random = Math.floor(Math.random() * 3);
            if (random == 0) 
            {
                result = GameElementColor.red;
            }
            else if (random == 1) 
            {
                result = GameElementColor.blue;
            }
            else 
            {
                result = GameElementColor.yellow;
            }
        }
        while(iDontWantThatDolor != undefined && result == iDontWantThatDolor)

        return result;
    }

    public PlayEliminateAnim()
    {
    }
}

enum SceneElementType
{
    None,
    Pill,
    Virus,
    Vitamins,
    ColunmEliminater,
    RowEliminater,
    CrossEliminater,
    PlaceHolder,
    Empty,
}