class PlayerControlPill extends LogicElementBase
{
    public static readonly PillDropdownInterval:number = 1000;//每隔多久药丸下落一格

    public pill1:Pill;
    public pill2:Pill;
    public posx:number;
    public posy:number;
    public rotAngle:number; // 必须是0, 90，180，270中的一个值
    private pillDropdownTimer:number;

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
        this.rotAngle = 0;    
        this.pillDropdownTimer = 0;    
        this.pill1 = new Pill();
        this.pill2 = new Pill();
        this.pill1.ChangePillTexByColor();
        this.pill2.ChangePillTexByColor();     
        //坐标表示药丸左下角块的坐标, 初始坐标在瓶子正中间的最上方
        this.MoveTo(3,0);
    }

    public TryRotate():boolean
    {
        return false;
    }

    protected MoveTo(posx:number, posy:number):void
    {
        this.posx = posx;
        this.posy = posy;
        //TODO：根据旋转角度，来决定子pill的位置
        this.pill1.MoveTo(this.posx, this.posy);
        this.pill2.MoveTo(this.posx + 1, this.posy);
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
        this.UpdatePlayerControlState(deltaTime);
    }

    private UpdatePlayerControlState(deltaTime:number): void
    {
        if(this.matchState == MatchState.PlayerControl)
		{
            this.pillDropdownTimer += deltaTime;
            if(this.pillDropdownTimer >= PlayerControlPill.PillDropdownInterval)
            {
                //即使时间很长，超过两个MatchModule.PillDropdownInterval，也还是移动一格，否则卡了，就忽然间下降很多，体验不好
                this.pillDropdownTimer = 0;
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
                console.error("Pill DropDown Failed In " + this.matchState + ", Which Should Not Happen");
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
        event.pill1 = this.pill1;
        event.pill2 = this.pill2;
        GameMain.GetInstance().DispatchEvent(event);
    }
}

