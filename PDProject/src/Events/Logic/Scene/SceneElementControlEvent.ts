class SceneElementControlEvent extends egret.Event
{
    public static EventName:string = "SceneElementControlEvent";
    public controlType:SceneElementControlType;
    public controlTarget:ControlableElement;
    public moveDir:Direction;
    public moveStep:number;
    public displayElements:DisplayElementBase[];
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneElementControlEvent.EventName,bubbles,cancelable);           
    }
}
