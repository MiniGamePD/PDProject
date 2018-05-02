class PlayerControlEvent extends egret.Event
{
    public static EventName:string = "PlayerControlEvent";
    public controlType:ControlType;
    public targets:DisplayElementBase[];
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(PlayerControlEvent.EventName,bubbles,cancelable);           
    }
}
