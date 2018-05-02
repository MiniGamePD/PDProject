class PlayerControlFailedEvent extends egret.Event
{
    public static EventName:string = "PlayerControlFailedEvent";
    public controlType:ControlType;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(PlayerControlFailedEvent.EventName,bubbles,cancelable);           
    }
}