class LobbyView extends  egret.DisplayObjectContainer implements IGameView
{
    private textField: egret.TextField;

    public CreateView(): void
    {
        let stageWidth = GameMain.GetInstance().GetStageWidth();
        let stageHeight = GameMain.GetInstance().GetStageHeight();
        
        this.textField = new egret.TextField();       
        this.textField.x = 0;
        console.log(this.textField.x);
        this.textField.y = stageHeight / 4;
        this.textField.width = stageWidth;
        this.textField.height = 100;
        this.textField.rotation = -5;
        this.textField.fontFamily = "Impact";
        this.textField.size *= 2;
        this.textField.textAlign = "center";
        this.textField.text = "Pocket Doctor";
        this.addChild(this.textField);

        var shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(stageWidth / 2 - 100, stageHeight / 5 * 3, 200, 100 );
        shape.graphics.endFill();        
        this.addChild( shape );

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener( egret.TouchEvent.TOUCH_TAP, this.OnClickStartGame, this );

        var text:egret.TextField = new  egret.TextField();
        text.text = "start game";
        text.x = 0;
        text.y = stageHeight / 5 * 3;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.width = stageWidth;
        text.height = 100;
        this.addChild(text);
    }

    public UpdateView(): void
    {
    }

    public ReleaseView(): void
    {

    }

    public GetDisplayObjectContainer():egret.DisplayObjectContainer
    {
        return this;
    }

    private OnClickStartGame(): void
    {
        egret.log("OnClickStartGame");
        //GameMain.GetInstance().SwitchGameState(GameStateType.Game);
    }
}