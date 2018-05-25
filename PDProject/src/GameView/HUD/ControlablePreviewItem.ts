class ControlablePreviewItem extends egret.DisplayObjectContainer
{
    private preview1:egret.DisplayObjectContainer;
    private preview2:egret.DisplayObjectContainer;

    private dropTargetY:number;
    private next1Y:number;
    private next2Y:number;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.dropTargetY = Tools.ElementPosToGameStagePosY(-1);
        this.next1Y = Tools.ElementPosToGameStagePosY(-3);
        this.next2Y = Tools.ElementPosToGameStagePosY(-4);

        this.preview1 = new egret.DisplayObjectContainer();
        this.preview2 = new egret.DisplayObjectContainer();
        this.preview1.x = this.preview2.x = Tools.ElementPosToGameStagePosX(4);
        this.preview1.y = this.next1Y;
        this.preview2.y = this.next2Y;
        this.addChild(this.preview1);
        this.addChild(this.preview2);

        //var res = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        // var pill1 = res.CreateBitmapByName("pd_res_json.Virus_Red");
        // pill1.y = this.dropTargetY;
        // var pill2 = res.CreateBitmapByName("pd_res_json.Virus_Blue");
        // pill2.y = this.next1Y;
        // var pill3 = res.CreateBitmapByName("pd_res_json.Virus_Yellow");
        // this.nextPill3.y = this.next2Y;
        // this.preview1.x = this.preview2.x = this.nextPill3.x = Tools.ElementPosToGameStagePosX(4);
        // this.preview1.width = this.preview2.width = this.nextPill3.width = Tools.MatchViewElementWidth;
        // this.preview1.height = this.preview2.height = this.nextPill3.height = Tools.MatchViewElementHeight;
        // this.preview1.anchorOffsetX = this.preview2.anchorOffsetX = this.nextPill3.anchorOffsetX = Tools.MatchViewElementWidth / 2;
        // this.preview1.anchorOffsetY = this.preview2.anchorOffsetY = this.nextPill3.anchorOffsetY = Tools.MatchViewElementHeight / 2;
        // this.addChild(this.preview1);
        // this.addChild(this.preview2);
        // this.addChild(this.nextPill3);
    }

    public Play()
    {
        
    }

    public Update(deltaTime:number)
    {

    }

    public RefreshControlablePreview(nextControlableElementArray:ControlableElement[])
    {
        this.preview1.removeChildren();
        this.preview1.addChild(nextControlableElementArray[0].GetPreViewContainer());
        this.preview2.removeChildren();
        this.preview2.addChild(nextControlableElementArray[1].GetPreViewContainer());
    }
}