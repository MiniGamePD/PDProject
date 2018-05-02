class PlayerControl extends GameModuleComponentBase
{
    public static readonly DropdownInterval:number = 200;//每隔多久药丸下落一格    
    private dropdownTimer:number;
    public target:Pill;

    public Init():void
    {
        GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(PillControlFailedEvent.EventName, this.OnPillControlFailed, this);
    }

    public Release():void
    {
        GameMain.GetInstance().RemoveEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(PillControlFailedEvent.EventName, this.OnPillControlFailed, this);
    }

    public SetTarget(target:Pill)
    {
        this.target = target;
    }
    
    public Work()
    {
        super.Work();
        this.dropdownTimer = 0;
        this.DispatchPillControlEvent(PillControlType.Create);
    }

    public Sleep()
    {
        super.Sleep();
        this.target = null;
    } 

    private OnInputEvent(event: InputEvent): void
	 {
		if(this.target != null)
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
        if(this.isWorking && this.target != null)
		{
            this.TryDropdown(deltaTime);
        }
    }

    private TryDropdown(deltaTime:number): void
    {
        this.dropdownTimer += deltaTime;
        if(this.dropdownTimer >= PlayerControl.DropdownInterval)
        {
            //即使时间很长，超过两个MatchModule.PillDropdownInterval，也还是移动一格，否则卡了，就忽然间下降很多，体验不好
            this.dropdownTimer = 0;
            this.DispatchPillControlEvent(PillControlType.DropDown);                
        }
    }

    protected OnPillControlFailed(event:PillControlFailedEvent)
    {
        if(this.isWorking && this.target == null)
        {
             if(DEBUG)
            {
                console.error("PillRenderer DropDown Failed While Player Control Is Not Working");
            }
            return;
        }        

        if(event.pillControlType == PillControlType.DropDown)
        {
            //下落到不能再下落了，就进入消除状态        
            let event = new PlayerControlFinishEvent();            
            GameMain.GetInstance().DispatchEvent(event);
        }
        else if(event.pillControlType == PillControlType.Create)
        {
            //已经无法创建新的药丸，就进入死亡状态
            let event = new GameOverEvent();            
            GameMain.GetInstance().DispatchEvent(event);
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

