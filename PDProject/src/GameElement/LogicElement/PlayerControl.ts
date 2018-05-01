class PlayerControl extends LogicElementBase
{
    public static readonly DropdownInterval:number = 1000;//每隔多久药丸下落一格    
    private dropdownTimer:number;
    public target:Pill;

    public Init():void
    {
        super.Init();
        GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(PillControlFailedEvent.EventName, this.OnPillControlFailed, this);
    }

    public Release():void
    {
        super.Release();
        GameMain.GetInstance().RemoveEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(PillControlFailedEvent.EventName, this.OnPillControlFailed, this);
    }

    private Reset():void
    {        
        this.target = new Pill();
        this.dropdownTimer = 0;
    }

    private OnInputEvent(event: InputEvent): void
	 {
		if(this.matchState == MatchState.PlayerControl)
		{
			var key = event.Key;
			if (key == InputKey.Left)
			{
                this.DispatchPillControlEvent(PillControlType.MoveLeft);
			}
			else if (key == InputKey.Right)
			{
                this.DispatchPillControlEvent(PillControlType.MoveRight);
			}
			else if (key == InputKey.Down)
			{
				
			}
			else if (key == InputKey.Rotate)
			{
                this.DispatchPillControlEvent(PillControlType.Rotation);
			}
		}
    }

    public Update(deltaTime:number)
    {
        this.TryDropdown(deltaTime);
    }

    private TryDropdown(deltaTime:number): void
    {
        if(this.matchState == MatchState.PlayerControl)
		{
            this.dropdownTimer += deltaTime;
            if(this.dropdownTimer >= PlayerControl.DropdownInterval)
            {
                //即使时间很长，超过两个MatchModule.PillDropdownInterval，也还是移动一格，否则卡了，就忽然间下降很多，体验不好
                this.dropdownTimer = 0;
                this.DispatchPillControlEvent(PillControlType.DropDown);                
            }
        }
    }

    protected OnPillControlFailed(event:PillControlFailedEvent)
    {
        if(this.matchState != MatchState.PlayerControl)
        {
             if(DEBUG)
            {
                console.error("PillRenderer DropDown Failed In " + this.matchState + ", Which Should Not Happen");
            }
            return;
        }        

        if(event.pillControlType == PillControlType.DropDown)
        {
            //下落到不能再下落了，就进入消除状态
            let event = new ChangeMatchStateEvent();
            event.matchState = MatchState.Eliminate;
            GameMain.GetInstance().DispatchEvent(event);
        }
        else if(event.pillControlType == PillControlType.Create)
        {
            //已经无法创建新的药丸，就进入死亡状态
            let event = new ChangeMatchStateEvent();
            event.matchState = MatchState.GameOver;
            GameMain.GetInstance().DispatchEvent(event);
        }
    }

    protected OnChangeMatchState()
    {
        if(this.matchState == MatchState.PlayerControl)
        {
            //切换到PlayerControl状态，创建一个pill
            this.Reset();
            this.DispatchPillControlEvent(PillControlType.Create);
        }
    }

    private DispatchPillControlEvent(pillControlType:PillControlType)
    {
        let event = new PillControlEvent();
        event.pillControlType = pillControlType;
        event.pill1 = this.target.pill1;
        event.pill2 = this.target.pill2;
        GameMain.GetInstance().DispatchEvent(event);        
    }
}

