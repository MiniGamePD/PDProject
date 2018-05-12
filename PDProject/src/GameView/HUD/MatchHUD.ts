class MatchHUD extends egret.DisplayObjectContainer
{
    private readyGo:ReadyGoItem;
    private score:MatchScoreItem;

    public Init()
    {
        this.readyGo = new ReadyGoItem(this.width/2, this.height/4, 200, 200, -10);
        this.addChild(this.readyGo);

        this.score = new MatchScoreItem();
        this.score.Init();
        this.addChild(this.score);

        GameMain.GetInstance().AddEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
    }

    public Release()
    {
        this.readyGo = null;

        GameMain.GetInstance().RemoveEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
    }

    public Reset()
    {
        this.score.Reset();
    }

    public Update(deltaTime:number)
    {
        this.score.Update(deltaTime);
    }

    private OnHUDEvent(event:HUDEvent)
    {
        switch(event.eventType)
        {
            case HUDEventType.ShowReadyGo:
                this.ShowReadyGo();
                break;
            //Add More..
        }
    }

    private ShowReadyGo()
    {
        this.readyGo.Play();
    }
}