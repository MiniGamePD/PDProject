class PillControlEvent extends egret.Event
{
    public static EventName:string = "PillControlEvent";
    public pillControlType:PillControlType;
    public pill1:DisplayElementBase;
    public pill2:DisplayElementBase;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(PillControlEvent.EventName,bubbles,cancelable);           
    }
}

enum PillControlType
{
    Create,
    MoveLeft,
    MoveRight,
    DropDown,
    Rotation,
}
