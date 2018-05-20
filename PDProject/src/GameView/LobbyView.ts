class LobbyView extends GameView
{
    private mResModule: IResModule;
    private mStageWidth: number;
    private mStageHeight: number;
    private textField: egret.TextField;
    private particleSys: particle.GravityParticleSystem;

    public CreateView(): void
    {
        this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.mStageWidth = GameMain.GetInstance().GetStageWidth();
        this.mStageHeight = GameMain.GetInstance().GetStageHeight();

        this.LoadBackGround();
        this.PlayBgm();
    }

    private LoadBackGround()
    {
        let bg = this.mResModule.CreateBitmapByName("pd_res_json.BackGround");
        this.addChild(bg);
        bg.width = this.mStageWidth;
        bg.height = this.mStageHeight;

        this.textField = new egret.TextField();
        this.textField.x = 0;
        this.textField.y = this.mStageHeight / 4;
        this.textField.width = this.mStageWidth;
        this.textField.height = 100;
        this.textField.rotation = -5;
        this.textField.fontFamily = "Impact";
        this.textField.size *= 2;
        this.textField.textAlign = "center";
        this.textField.text = "Pocket Doctor";
        this.addChild(this.textField);


        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(this.mStageWidth / 2 - 100, this.mStageHeight / 5 * 3, 200, 100);
        shape.graphics.endFill();
        this.addChild(shape);

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickStartGame, this);

        var text: egret.TextField = new egret.TextField();
        text.text = "start game";
        text.x = 0;
        text.y = this.mStageHeight / 5 * 3;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.width = this.mStageWidth;
        text.height = 100;
        this.addChild(text);

        this.PlayParticle();
    }

    private OnClickStartGame(): void
    {
        egret.log("OnClickStartGame");
        GameMain.GetInstance().SwitchGameState(GameStateType.Match);
    }

    private PlayParticle()
    {
        // var texture = RES.getRes("Virus_Red");
        // var config = RES.getRes("newParticle_json");
        // this.particleSys = this.mResModule.CreateParticleByKey("newParticle");
        this.particleSys = this.mResModule.CreateParticle("Virus_Red", "newParticle");
        this.addChild(this.particleSys);
        this.particleSys.x = 100;
        this.particleSys.y = this.mStageHeight / 2;
        this.particleSys.emitterX = 0;
        this.particleSys.emitterY = 0;
        // this.particleSys.rotation = 180
        this.particleSys.start();
    }

    public UpdateView(deltaTime: number): void
    { 
        if (this.particleSys != null)
        {
            this.particleSys.emitterX += deltaTime * 0.1;
        }
    }

    private PlayBgm()
    {
        var event: PlaySoundEvent = new PlaySoundEvent("bgm_mp3", -1);
        GameMain.GetInstance().DispatchEvent(event);
    }
}