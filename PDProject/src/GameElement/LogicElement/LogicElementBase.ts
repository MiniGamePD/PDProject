abstract class LogicElementBase extends egret.EventDispatcher
{
    protected lastMatchState:MatchState = MatchState.None;
    protected matchState:MatchState = MatchState.None;

    public Init():void
    {
        GameMain.GetInstance().AddEventListener(ChangeMatchStateEvent.EventName, this.ChangeMatchStateEventListener, this);        
    }

    public Release():void
    {
        GameMain.GetInstance().RemoveEventListener(ChangeMatchStateEvent.EventName, this.ChangeMatchStateEventListener, this);        
    }

    private ChangeMatchStateEventListener(event:ChangeMatchStateEvent)
    {
        this.lastMatchState = this.matchState;
        this.matchState = event.matchState;             
        this.OnChangeMatchState();
    }    

    protected abstract OnChangeMatchState();
}