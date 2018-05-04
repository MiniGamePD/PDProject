class SceneElementControlEvent extends egret.Event
{
    public static EventName:string = "SceneElementControlEvent";
    public controlType:SceneElementControlType;
    public moveDir:Direction;
    public moveStep:number;
    public controlTarget:ControlableElement;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneElementControlEvent.EventName,bubbles,cancelable);           
    }
}
