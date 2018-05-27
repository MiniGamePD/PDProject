class ComboItem extends egret.DisplayObjectContainer
{
    private comboSprite:egret.Bitmap;
    private comboNumTenPlace:egret.Bitmap;
    private comboNumOnePlace:egret.Bitmap;
    private res:IResModule;
    private timer:egret.Timer;

    public constructor()
    {
        super();
        this.res = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);

        this.comboSprite = this.res.CreateBitmapByName("pd_res_json.lianxiao");
        this.comboSprite.anchorOffsetX = this.comboSprite.width / 2;
        this.comboSprite.anchorOffsetY = this.comboSprite.height / 2;
        this.comboSprite.x = GameMain.GetInstance().GetStageWidth() / 2 - 50;
        this.comboSprite.y = 250;
        GameMain.GetInstance().AdapteDisplayObject(this.comboSprite);
    }

    public Init()
    {
        GameMain.GetInstance().AddEventListener(EliminateEvent.EventName, this.OnEliminateHappen, this);
    }

    public Release()
    {
        GameMain.GetInstance().RemoveEventListener(EliminateEvent.EventName, this.OnEliminateHappen, this);
    }

    private OnEliminateHappen(event:EliminateEvent)
    {
        if(event.eliminateInfo.EliminateRound >= 1)
        {
            this.ShowCombo(event.eliminateInfo.EliminateRound);
        }
    }

    private ShowCombo(comboNum:number)
    {
        if(comboNum > 99)
        {
            comboNum = 99;
        }

        var tenPlace = comboNum / 10;
        var onePlace = comboNum % 10;

        this.comboNumTenPlace = this.res.CreateBitmapByName("pd_res_json.lianxiao" + tenPlace);
        this.comboNumTenPlace.anchorOffsetX = this.comboNumTenPlace.width / 2;
        this.comboNumTenPlace.anchorOffsetY = this.comboNumTenPlace.height / 2;
        this.comboNumTenPlace.x = GameMain.GetInstance().GetStageWidth() / 2 + 75;
        this.comboNumTenPlace.y = 250;
        GameMain.GetInstance().AdapteDisplayObject(this.comboNumTenPlace);

        this.comboNumOnePlace = this.res.CreateBitmapByName("pd_res_json.lianxiao" + onePlace);
        this.comboNumOnePlace.anchorOffsetX = this.comboNumOnePlace.width / 2;
        this.comboNumOnePlace.anchorOffsetY = this.comboNumOnePlace.height / 2;
        this.comboNumOnePlace.x = this.comboNumTenPlace.x + this.comboNumTenPlace.width;
        this.comboNumOnePlace.y = 250;
        GameMain.GetInstance().AdapteDisplayObject(this.comboNumTenPlace);

        this.addChild(this.comboSprite);
        this.addChild(this.comboNumTenPlace);
        this.addChild(this.comboNumOnePlace);

        if(this.timer != null)
        {
            this.timer.stop();
        }

        this.timer = new egret.Timer(1000, 1);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.HideCombo, this);
        this.timer.start();
    }

    private HideCombo()
    {
        this.removeChild(this.comboSprite);
        this.removeChild(this.comboNumTenPlace);
        this.removeChild(this.comboNumOnePlace);
        this.timer = null;
    }
}