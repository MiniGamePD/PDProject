class SceneElementAccessEvent extends egret.Event
{
    public static EventName:string = "SceneElementAccessEvent";
    public accessType:SceneElementAccessType;
    public startX:number;
    public startY:number;
    public endX:number;
    public endY:number;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneElementAccessEvent.EventName,bubbles,cancelable);      
        this.startX = 0;
        this.startY = 0;
        this.endX = Scene.Columns - 1;
        this.endY = Scene.Rows - 1;  
    }
}
