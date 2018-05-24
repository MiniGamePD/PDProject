class MatchHUD extends egret.DisplayObjectContainer
{
    private readyGo:ReadyGoItem;
    private score:MatchScoreItem;
    private gameover:GameOverItem;
    private controlablePreview:ControlablePreviewItem;

    public Init()
    {
        this.readyGo = new ReadyGoItem(this.width/2, this.height/4, 200, 200, -10);
        this.addChild(this.readyGo);

        this.score = new MatchScoreItem();
        this.score.Init();
        this.addChild(this.score);

        this.controlablePreview = new ControlablePreviewItem(0, 0, this.width, this.height);
        this.addChild(this.controlablePreview);

        this.gameover = new GameOverItem(this.width, this.height);
        this.addChild(this.gameover);

        GameMain.GetInstance().AddEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
        GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);
    }

    public Release()
    {
        this.readyGo = null;

        GameMain.GetInstance().RemoveEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
        GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOver, this);
    }

    public Reset()
    {
        this.score.Reset();
        this.gameover.Hide();
    }

    public Update(deltaTime:number)
    {
        this.score.Update(deltaTime);
        this.controlablePreview.Update(deltaTime);
    }

    private OnGameOver(event:GameOverEvent)
    {
        this.gameover.Show();
    }

    private OnHUDEvent(event:HUDEvent)
    {
        switch(event.eventType)
        {
            case HUDEventType.ShowReadyGo:
                this.ShowReadyGo();
                break;
            case HUDEventType.ChangeScore:
                this.ChangeScore(event.param);
                break;
            case HUDEventType.ChangeStep:
                this.ChangeStep(event.param);
                break;
            case HUDEventType.RefreshControlablePreview:
                this.RefreshControlablePreview(event.param);
                break;
            //Add More..
        }
    }

    private ShowReadyGo()
    {
        this.readyGo.Play();
    }

    private ChangeScore(param:any)
    {
        let score:number = <number>param;
        this.score.SetScore(score);
    }

    private ChangeStep(param:any)
    {
        let step:number = <number>param;
        this.score.SetStep(step);
    }

    private RefreshControlablePreview(param:any)
    {
        var nextControlableElementArray:ControlableElement[] = <ControlableElement[]>param;
        this.controlablePreview.RefreshControlablePreview(nextControlableElementArray);
    }
}