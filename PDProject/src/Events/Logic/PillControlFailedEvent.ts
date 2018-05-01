class PillControlFailedEvent extends egret.Event
{
    public static EventName:string = "PillControlFailedEvent";
    public pillControlType:PillControlType;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(PillControlFailedEvent.EventName,bubbles,cancelable);           
    }
}