class SceneElementControlFailedEvent extends egret.Event
{
    public static EventName:string = "SceneElementControlFailedEvent";
    public controlType:SceneElementControlType;
    public controlTarget:ControlableElement;
    public moveDir:Direction;
    public moveStep:number;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneElementControlFailedEvent.EventName,bubbles,cancelable);           
    }
}