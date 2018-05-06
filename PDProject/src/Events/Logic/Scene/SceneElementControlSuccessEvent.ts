class SceneElementControlSuccessEvent extends egret.Event
{
    public static EventName:string = "SceneElementControlSuccessEvent";
    public controlType:SceneElementControlType;
    public moveDir:Direction;
    public moveStep:number;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneElementControlSuccessEvent.EventName,bubbles,cancelable);           
    }
}