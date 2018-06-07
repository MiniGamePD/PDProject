class FeverItem extends egret.DisplayObjectContainer
{
    private feverProgress:ProgressBar;
    private feverSprite:egret.Bitmap;
    private feverEnerge:number;
    private feverControl:FeverControl;
    private feverSpriteTimer:egret.Timer;
    private feverStar:egret.Bitmap;
    private feverStarLight:egret.Bitmap;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        //星星的光
        this.feverStarLight = res.CreateBitmapByName("pd_res_json.FeverTime_Shinning");
        this.feverStarLight.x = 177;
        this.feverStarLight.y = 122;
        this.feverStarLight.anchorOffsetX = this.feverStarLight.width / 2;
        this.feverStarLight.anchorOffsetY = this.feverStarLight.height / 2;
        GameMain.GetInstance().AdapteDisplayObject(this.feverStarLight);
        this.addChild(this.feverStarLight);

        //进度条
        var feverEnergeBgRect = new egret.Rectangle(175,95,276,34);
        var feverEnergeFgRect = new egret.Rectangle(176,96,274,32);
    
        this.feverProgress = new ProgressBar("pd_res_json.FeverTime", feverEnergeBgRect, "pd_res_json.FeverTime_Color", feverEnergeFgRect,
            ProgressBarDir.Horizontal_L2R);
        this.feverProgress.x = feverEnergeBgRect.width / 2 + 20;
        this.feverProgress.y = feverEnergeBgRect.height / 2 + 20;
        this.feverProgress.anchorOffsetX = feverEnergeBgRect.width / 2;
        this.feverProgress.anchorOffsetY = feverEnergeBgRect.height / 2;
        this.feverProgress.Adapt();
        this.addChild(this.feverProgress);

        this.feverEnerge = 0;
        this.feverProgress.SetProgress(0.01);

        //星星
        this.feverStar = res.CreateBitmapByName("pd_res_json.FeverTime_xingxing");
        this.feverStar.x = 177;
        this.feverStar.y = 122;
        this.feverStar.anchorOffsetX = this.feverStar.width / 2;
        this.feverStar.anchorOffsetY = this.feverStar.height / 2;
        GameMain.GetInstance().AdapteDisplayObject(this.feverStar);
        this.addChild(this.feverStar);

        //fever time的美术字
        this.feverSprite = res.CreateBitmapByName("pd_res_json.fever");
        this.feverSprite.anchorOffsetX = this.feverSprite.width / 2;
        this.feverSprite.anchorOffsetY = this.feverSprite.height / 2;
        this.feverSprite.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.feverSprite.y = 400;
        GameMain.GetInstance().AdapteDisplayObject(this.feverSprite);
    }

    public Init()
    {
    }

    public Release()
    {
        this.feverControl = null;
    }

    public SetFeverControl(feverControl:FeverControl)
    {
        this.feverControl = feverControl;
    }

    public ShowFeverSprite()
    {
        this.feverSprite.scaleX = 0;
        this.feverSprite.scaleY = 0;
        this.addChild(this.feverSprite);

        var param = new PaScalingParam;
        param.displayObj = this.feverSprite;
        param.duration = 500;
        param.targetScaleX = 1;
        param.targetScaleY = 1;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);

        this.feverSpriteTimer = new egret.Timer(1500, 1);
        this.feverSpriteTimer.addEventListener(egret.TimerEvent.TIMER, this.HideFeverSprite, this);
        this.feverSpriteTimer.start();
    }

    private HideFeverSprite()
    {
        this.removeChild(this.feverSprite);
        this.feverSpriteTimer = null;
    }

    public Update(delta:number)
    {
        if(this.feverControl != null)
        {
            if(this.feverEnerge != this.feverControl.GetFeverEnerge())
            {
                this.feverEnerge = this.feverControl.GetFeverEnerge();
                this.feverProgress.SetProgress(this.feverEnerge / 100);                   
            }
        }
    }
}