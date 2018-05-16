class NpcControlFinishEvent extends egret.Event
{
    public static EventName:string = "NpcControlFinishEvent";    
    public specialEliminateMethod:EliminateMethod;
    public bossSkillInfo:BossSkillInfo;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(NpcControlFinishEvent.EventName,bubbles,cancelable);           
    }
}