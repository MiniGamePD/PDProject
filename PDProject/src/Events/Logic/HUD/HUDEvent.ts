class HUDEvent extends egret.Event
{
    public static EventName:string = "HUDEvent";
    public eventType:HUDEventType;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(HUDEvent.EventName,bubbles,cancelable);           
    }
}

enum HUDEventType
{
    ShowReadyGo,
}