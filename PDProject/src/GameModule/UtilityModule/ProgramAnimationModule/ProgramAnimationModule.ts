class ProgrameAnimationModule extends ModuleBase implements IProgramAnimationModule
{
    private animationList: IProgramAnimation[];

    public Init(): boolean
    {
        this.isForeground = true;
        this.animationList = [];
        GameMain.GetInstance().AddEventListener(PlayProgramAnimationEvent.EventName, this.OnPlayProgramAnimationEvent, this);
        return true;
    }

    public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
    {
        this.isForeground = true;
    }

    public Update(deltaTime: number): void
    {
        for (var i = 0; i < this.animationList.length; ++i)
        {
            if (this.animationList[i] != null)
            {
                this.animationList[i].Update(deltaTime);
                if (this.animationList[i].IsFinish())
                {
                    this.animationList[i].Release();
                    this.animationList.splice(i, 1);
                    --i;
                }
            }
        }
    }

    public Release(): void
    {
        GameMain.GetInstance().RemoveEventListener(PlayProgramAnimationEvent.EventName, this.OnPlayProgramAnimationEvent, this);
    }

    private CreateAnimation(param: ProgramAnimationParamBase)
    {
        var animation: IProgramAnimation = null;
        if (param != null)
        {
            switch (param.animType)
            {
                case ProgramAnimationType.Lightning:
                    animation = new PaLightning();
            }
        }

        if (animation != null)
        {
            var result = animation.Init(param);
            if (result)
            {
                this.animationList.push(animation);
            }
        }
    }

    private OnPlayProgramAnimationEvent(event: PlayProgramAnimationEvent)
    {
        if (event != null)
        {
            this.CreateAnimation(event.param);
        }
    }
}