class LoadingView extends GameView
{
    private textField: egret.TextField;
	private loadingText: egret.TextField;

    public CreateView(): void
    {
        this.InitBackGround();
    }

	private InitBackGround()
	{
		let stageWidth = GameMain.GetInstance().GetStageWidth();
        let stageHeight = GameMain.GetInstance().GetStageHeight();

        this.textField = new egret.TextField();
        this.textField.x = 0;
        this.textField.y = stageHeight / 4;
        this.textField.width = stageWidth;
        this.textField.height = 100;
        this.textField.rotation = -5;
        this.textField.fontFamily = "Impact";
        this.textField.size *= 2;
        this.textField.textAlign = "center";
        this.textField.text = "Pocket Doctor";
        this.addChild(this.textField);

        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(stageWidth / 2 - 100, stageHeight / 5 * 3, 200, 100);
        shape.graphics.endFill();
        this.addChild(shape);

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickStartGame, this);

        this.loadingText = new egret.TextField();
        this.loadingText.text = "Loading...";
        this.loadingText.x = 0;
        this.loadingText.y = stageHeight / 5 * 3;
        this.loadingText.textAlign = egret.HorizontalAlign.CENTER;
        this.loadingText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.loadingText.width = stageWidth;
        this.loadingText.height = 100;
        this.addChild(this.loadingText);
	}

	private SetProgress(rate: number)
	{
		this.loadingText.text = "Loading... " + rate.toPrecision();
	}

    private OnClickStartGame(): void
    {
        egret.log("OnClickStartGame");
		// this.OnLoadingComplete();
    }
}