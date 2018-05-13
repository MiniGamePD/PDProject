//在scene中占一个格子的元素，处理显示相关，和一些与消除相关逻辑，并转发gameplay的逻辑给到GameplayElement层
class SceneElementBase
{
    public posx: number = 0;
    public posy: number = 0;
    public canDrop: boolean = true;
    public color: GameElementColor;
    public renderer: egret.Bitmap;
    public dirty: boolean;
    public hasAddToDisplayList: boolean;
    private resModule: IResModule;
    private bindedElements: SceneElementBase[];
    protected owner:GameplayElementBase;
    public eliminateMinCount: number;
    public eliminateSound: string;
    protected elementType: SceneElementType;

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

    protected RandomColor(): GameElementColor {
        let random = Math.random() * 3;
        if (random >= 0 && random < 1) {
            return GameElementColor.red;
        }
        else if (random >= 1 && random < 2) {
            return GameElementColor.blue;
        }
        else {
            return GameElementColor.yellow;
        }
    }

    public RefreshTexture():void
    {
    }

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
        return this.owner.OnOnEliminate();
    }

    public BlockWidth():number
    {
        return this.owner.blockWidth;
    }

    public BlockHeight():number
    {
        return this.owner.blockHeight;
    }
}

enum GameElementColor 
{
    red,
    blue,
    yellow,
    random,
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
    SuperVirus,
}