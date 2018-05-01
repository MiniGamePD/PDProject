class DisplayElementBase
{
    public posx:number = 0;
    public posy:number = 0;
    public color:GameElementColor;
    public renderer:egret.Bitmap;
    public dirty:boolean;
    public hasAddToDisplayList:boolean;
    private resModule:IResModule;

    public MoveTo(posx:number, posy:number)
    {
        this.posx = posx;
        this.posy = posy;
        this.dirty = true;
    }

    protected RandomColor():GameElementColor
    {
        let random = Math.random()*3; 
        if(random >= 0 && random < 1)
        {
            return GameElementColor.red;
        }
        else if(random >= 1 && random < 2)
        {
            return GameElementColor.blue;
        }
        else 
        {
            return GameElementColor.yellow;
        }
    }      

    protected GetTexture(path:string):egret.Texture
    {
        if(this.resModule == null)
        {
            this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        }
        return this.resModule.GetRes(path);
    }
}

enum GameElementColor
{
    red,
    blue,
    yellow,
}