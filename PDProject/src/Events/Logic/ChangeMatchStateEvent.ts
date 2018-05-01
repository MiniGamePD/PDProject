class ChangeMatchStateEvent extends egret.Event
{
    public static EventName:string = "ChangeMatchStateEvent";
    public matchState:MatchState;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(ChangeMatchStateEvent.EventName,bubbles,cancelable);           
    }
}

enum MatchState
{
    None,    
	Init, //预先生成一些细菌
    PlayerControl, //该状态下玩家可控制药丸旋转、下落
    Eliminate, //消除阶段，计算刚才玩家的操作是否产生消除，以及处理消除的各种效果
    GameOver //拜拜了
}