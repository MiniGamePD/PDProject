class ReadyGoItem extends egret.DisplayObjectContainer
{
    private ready:egret.TextField;
    private go:egret.TextField;
    private timer:egret.Timer;

    public constructor(x:number, y:number, width:number, height:number, rot:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.anchorOffsetX = width/2;
        this.anchorOffsetY = height/2;
        this.rotation = rot;

        this.ready = new egret.TextField();
        this.go = new egret.TextField();
        this.ready.x = this.ready.y = this.go.x = this.go.y = 0;
        this.ready.text = "Ready ~";
        this.go.text = "Go !";
        this.ready.fontFamily = this.go.fontFamily = "Impact";
        this.ready.size = this.go.size = 60;
        this.ready.textColor = this.go.textColor = 0xFF8D00;
        this.ready.width = this.go.width = width;
        this.ready.height = this.go.height = height;
        this.ready.textAlign = this.go.textAlign = egret.HorizontalAlign.CENTER;
        this.ready.verticalAlign = this.go.verticalAlign = egret.VerticalAlign.MIDDLE;
        GameMain.GetInstance().AdaptTextField(this.ready);
        GameMain.GetInstance().AdaptTextField(this.go);
    }

    public Play()
    {
        this.removeChildren();
        this.addChild(this.ready);

        this.timer = new egret.Timer(1000, 1);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.OnReadyDone, this);
        this.timer.start();
        
        let soundEvent = new PlaySoundEvent("Ready_mp3", 1);
        GameMain.GetInstance().DispatchEvent(soundEvent);
    }

    private OnReadyDone(event:egret.TimerEvent)
    {
        this.removeChildren();
        this.addChild(this.go);

        let soundEvent = new PlaySoundEvent("Go_mp3", 1);
        GameMain.GetInstance().DispatchEvent(soundEvent);

        this.timer = new egret.Timer(500, 1);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.OnGoDone, this);
        this.timer.start();
    }

    private OnGoDone(event:egret.TimerEvent)
    {
        this.removeChildren();
        this.timer = null;
    }
}