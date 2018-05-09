class SceneElementAccessAnswerEvent extends egret.Event
{
    public static EventName:string = "SceneElementAccessAnswerEvent";
    public accessType:SceneElementAccessType;
    public queryElementBlocks:number[][];//返回查询结果所在的坐标位置
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SceneElementAccessAnswerEvent.EventName,bubbles,cancelable);           
    }
}
