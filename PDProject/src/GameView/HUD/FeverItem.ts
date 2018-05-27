class FeverItem extends egret.DisplayObjectContainer
{
    private feverProgress:ProgressBar;
    private feverSprite:egret.Bitmap;
    private feverEnerge:number;
    private feverControl:FeverControl;
    private feverSpriteTimer:egret.Timer;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var feverEnergeBgRect = new egret.Rectangle(0, 0, 50, 200);
        var dx = feverEnergeBgRect.width * 0.05;
        var dy = feverEnergeBgRect.height * 0.05;
        var feverEnergeFgRect = feverEnergeBgRect.clone();
        feverEnergeFgRect.inflate(-dx, -dy);

        this.feverProgress = new ProgressBar("pd_res_json.Pill_Bg", feverEnergeBgRect, "pd_res_json.Bottle2", feverEnergeFgRect,
            ProgressBarDir.Vertical_U2D);
        this.feverProgress.x = feverEnergeBgRect.width / 2 + 20;
        this.feverProgress.y = feverEnergeBgRect.height / 2 + 20;
        this.feverProgress.anchorOffsetX = feverEnergeBgRect.width / 2;
        this.feverProgress.anchorOffsetY = feverEnergeBgRect.height / 2;
        this.feverProgress.rotation = 180;
        this.feverProgress.Adapt();
        this.addChild(this.feverProgress);

        this.feverEnerge = 0;
        this.feverProgress.SetProgress(0);

        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
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