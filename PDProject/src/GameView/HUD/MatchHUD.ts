class MatchHUD extends egret.DisplayObjectContainer
{
    private readyGo:ReadyGoHUD;

    public Init()
    {
        this.readyGo = new ReadyGoHUD(this.width/2, this.height/4, 200, 200, -10);

        this.addChild(this.readyGo);

        GameMain.GetInstance().AddEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
    }

    public Release()
    {
        this.readyGo = null;

        GameMain.GetInstance().RemoveEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
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