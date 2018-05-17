class ProgrameAnimationModule extends ModuleBase
{
    private animationArray:ProgrameAnimationBase[]

    public constructor()
    {
        super();
        this.animationArray = [];
        this.animationArray.push(new PATweenScale());
    }

    public Init():boolean
    {
        //GameMain.GetInstance().AddEventListener(RegisterProgrameAnimationEvent.EventName, this.On);
        return true
    }

	public Release():void
    {
        //GameMain.GetInstance().RemoveEventListener(RegisterProgrameAnimationEvent.EventName, this.On);
    }

    public SwitchForeOrBack(from: GameStateType, to: GameStateType):void
    {
        this.isForeground = true;
    }

    public Update(deltaTime: number):void
    {
        for(var i = 0; i < this.animationArray.length; ++i)
        {
            this.animationArray[i].UpdateAnimation(deltaTime);
        }
    }

    // private OnRegisterProgrameAnimation(event:RegisterProgrameAnimationEvent)
    // {
            //根据类型，将动画对象加入到对应的update列表里面处理
    // }
}