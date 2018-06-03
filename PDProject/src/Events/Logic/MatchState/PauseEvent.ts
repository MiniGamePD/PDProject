class PauseEvent extends egret.Event
{
    public static EventName:string = "PauseEvent";
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(PauseEvent.EventName,bubbles,cancelable);           
    }
}