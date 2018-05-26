class ProgressBar extends egret.DisplayObjectContainer
{
    private background:egret.Bitmap;
    private foreground:egret.Bitmap;
    private progressValue:number;

    public constructor(bgPath:string, bgRange:egret.Rectangle, fgPath:string, fgRange:egret.Rectangle)
    {
        super();
        this.progressValue = 1;
        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.background = res.CreateBitmapByName(bgPath);
        this.foreground = res.CreateBitmapByName(fgPath);
        this.addChild(this.background);
        this.addChild(this.foreground);

        this.background.x = bgRange.x;
        this.background.y = bgRange.y;
        this.background.width = bgRange.width;
        this.background.height = bgRange.height;

        this.foreground.x = fgRange.x;
        this.foreground.y = fgRange.y;
        this.foreground.width = fgRange.width;
        this.foreground.height = fgRange.height;

        var fgMask = new egret.Rectangle(0,0,fgRange.width, fgRange.height);
        this.foreground.mask = fgMask;
    }

    public SetProgress(value:number)
    {
        this.progressValue = value;
        var fgMask = new egret.Rectangle(0,0,this.foreground.width * this.progressValue, this.foreground.height);
        this.foreground.mask = fgMask;
    } 

    public Adapt()
    {
        GameMain.GetInstance().AdapteDisplayObject(this.background);
        GameMain.GetInstance().AdapteDisplayObject(this.foreground);
    }
}