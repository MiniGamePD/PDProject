class PlayerControl extends GameModuleComponentBase
{
    public static readonly DropdownInterval:number = 200;//每隔多久药丸下落一格    
    private dropdownTimer:number;
    public target:ControlableElement;

    public Init():void
    {
        GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(SceneElementControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
    }

    public Release():void
    {
        GameMain.GetInstance().RemoveEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
    }

    public SetTarget(target:ControlableElement)
    {
        this.target = target;
    }
    
    public Work()
    {
        super.Work();
        this.dropdownTimer = 0;
        this.DispatchControlEvent(SceneElementControlType.Add);
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
                this.DispatchControlEvent(SceneElementControlType.Move, Direction.Left, 1);
			}
			else if (key == InputKey.Right)
			{
                this.DispatchControlEvent(SceneElementControlType.Move, Direction.Right, 1);
			}
			else if (key == InputKey.Down)
			{
				//加速下降
			}
			else if (key == InputKey.Rotate)
			{
                this.DispatchControlEvent(SceneElementControlType.Rotation);
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
            this.DispatchControlEvent(SceneElementControlType.Move, Direction.Down, 1);                
        }
    }

    protected OnPlayerControlFailed(event:SceneElementControlEvent)
    {
        if(this.isWorking && this.target == null)
        {
             if(DEBUG)
            {
                console.error("Control Failed While Player Control Is Not Working");
            }
            return;
        }        

        if(event.controlType == SceneElementControlType.Move && event.moveDir == Direction.Down)
        {
            //下落到不能再下落了，就进入消除状态        
            let event = new PlayerControlFinishEvent();            
            GameMain.GetInstance().DispatchEvent(event);
        }
        else if(event.controlType == SceneElementControlType.Add)
        {
            //已经无法创建新的元素了，就进入死亡状态
            let event = new GameOverEvent();            
            GameMain.GetInstance().DispatchEvent(event);
        }
    }

    private DispatchControlEvent(controlType:SceneElementControlType, moveDir?:Direction, moveStep?:number)
    {
        let event = new SceneElementControlEvent();
        event.controlType = controlType;
        event.moveDir = moveDir;
        event.moveStep = moveStep;
        event.targets = this.target.GetControledElements();
        GameMain.GetInstance().DispatchEvent(event);        
    }
}

