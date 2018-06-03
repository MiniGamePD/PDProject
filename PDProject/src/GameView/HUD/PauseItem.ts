class PauseItem extends egret.DisplayObjectContainer
{
    private pauseIcon:egret.Bitmap;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);

        this.pauseIcon = res.CreateBitmapByName("pd_res_json.CrossEliminater");
        this.pauseIcon.anchorOffsetX = this.pauseIcon.width / 2;
        this.pauseIcon.anchorOffsetY = this.pauseIcon.height / 2;
        this.pauseIcon.x = 50;
        this.pauseIcon.y = 50;
        GameMain.GetInstance().AdapteDisplayObject(this.pauseIcon);

        this.addChild(this.pauseIcon);
    }

    public Init()
    {
        GameMain.GetInstance().RegisterInGameTouchableUI(this.pauseIcon);

        //设置显示对象可以相应触摸事件
        this.pauseIcon.touchEnabled = true;
        //注册事件
        this.pauseIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnPause, this);
    }

    public Release()
    {
        GameMain.GetInstance().UnregisterInGameTouchableUI(this.pauseIcon);

        this.pauseIcon.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnPause, this);
    }

    private OnPause()
    {
        var event = new PauseEvent();
        GameMain.GetInstance().DispatchEvent(event);
    }
}