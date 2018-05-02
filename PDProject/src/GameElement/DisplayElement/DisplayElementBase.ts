class DisplayElementBase {
    public posx: number = 0;
    public posy: number = 0;
    public canDrop: boolean = true;
    public color: GameElementColor;
    public renderer: egret.Bitmap;
    public dirty: boolean;
    public hasAddToDisplayList: boolean;
    private resModule: IResModule;
    private bindedElements: DisplayElementBase[];

    public constructor() {
        this.bindedElements = [];
    }

    public MoveTo(posx: number, posy: number) {
        if (this.posx != posx
            || this.posy != posy) {
            this.posx = posx;
            this.posy = posy;
            this.dirty = true;
        }
    }

    protected RandomColor(): GameElementColor {
        let random = Math.random() * 2;
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

    protected GetTexture(path: string): egret.Texture {
        if (this.resModule == null) {
            this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        }
        return this.resModule.GetRes(path);
    }

    // 返回捆绑元素的列表
    public GetBindElements(): DisplayElementBase[] {
        return this.bindedElements;
    }

    // 和某个元素绑定（双向）
    public BindElement(element: DisplayElementBase): boolean {
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
    public UnbindElement(element: DisplayElementBase): boolean {
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

}

enum GameElementColor {
    red,
    blue,
    yellow,
}