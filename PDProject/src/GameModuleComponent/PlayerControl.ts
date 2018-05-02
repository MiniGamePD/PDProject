class PlayerControl extends GameModuleComponentBase
{
    public static readonly DropdownInterval:number = 200;//每隔多久药丸下落一格    
    private dropdownTimer:number;
    public target:ControlableElement;

    public Init():void
    {
        GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(PlayerControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
    }

    public Release():void
    {
        GameMain.GetInstance().RemoveEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().RemoveEventListener(PlayerControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
    }

    public SetTarget(target:ControlableElement)
    {
        this.target = target;
    }
    
    public Work()
    {
        super.Work();
        this.dropdownTimer = 0;
        this.DispatchControlEvent(ControlType.Create);
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
                this.DispatchControlEvent(ControlType.MoveLeft);
			}
			else if (key == InputKey.Right)
			{
                this.DispatchControlEvent(ControlType.MoveRight);
			}
			else if (key == InputKey.Down)
			{
				
			}
			else if (key == InputKey.Rotate)
			{
                this.DispatchControlEvent(ControlType.Rotation);
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
            this.DispatchControlEvent(ControlType.DropDown);                
        }
    }

    protected OnPlayerControlFailed(event:PlayerControlFailedEvent)
    {
        if(this.isWorking && this.target == null)
        {
             if(DEBUG)
            {
                console.error("Player Control Failed While Player Control Is Not Working");
            }
            return;
        }        

        if(event.controlType == ControlType.DropDown)
        {
            //下落到不能再下落了，就进入消除状态        
            let event = new PlayerControlFinishEvent();            
            GameMain.GetInstance().DispatchEvent(event);
        }
        else if(event.controlType == ControlType.Create)
        {
            //已经无法创建新的元素了，就进入死亡状态
            let event = new GameOverEvent();            
            GameMain.GetInstance().DispatchEvent(event);
        }
    }

    private DispatchControlEvent(controlType:ControlType)
    {
        let event = new PlayerControlEvent();
        event.controlType = controlType;
        event.targets = this.target.GetControledElements();
        GameMain.GetInstance().DispatchEvent(event);        
    }
}

enum ControlType
{
    Create,
    MoveLeft,
    MoveRight,
    DropDown,
    Rotation,
}

