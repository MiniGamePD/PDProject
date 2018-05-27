class PlayerControl extends GameModuleComponentBase
{
    public static readonly DropdownInterval:number = 1000;//每隔多久药丸下落一格
    private dropdownTimer:number;
    public target:ControlableElement;
	private playSoundEvent: PlaySoundEvent;
    private controlableElementCreator: ControlableElementCreator;
    private creatorWorkParam:CreatorWorkParam;

    private startWorkTimer:egret.Timer;

    private nextControlableElementArray:ControlableElement[];

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super();
        this.creatorWorkParam = new CreatorWorkParam();
        this.controlableElementCreator = new ControlableElementCreator(gameplayElementFactory);
    }

    public Init():void
    {
        this.nextControlableElementArray = [];

        GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(SceneElementControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
        GameMain.GetInstance().AddEventListener(SceneElementControlSuccessEvent.EventName, this.OnPlayerControlSuccess, this);
    }

    public Release():void
    {
        this.nextControlableElementArray = null;

        GameMain.GetInstance().RemoveEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementControlSuccessEvent.EventName, this.OnPlayerControlSuccess, this);
    }

    public Work(param?:any):any
    {
        let controlWorkParam:GameplayControlWorkParam = param;
        
        if(controlWorkParam.turn == 1)
        {
            this.creatorWorkParam.paramIndex = ControlableElementCreateType.AllRandomPill;
            this.creatorWorkParam.createNum = 3;
            this.nextControlableElementArray = this.controlableElementCreator.CreateElement(this.creatorWorkParam);

            var hudEvent = new HUDEvent();
            hudEvent.eventType = HUDEventType.RefreshControlablePreview;
            hudEvent.param = this.nextControlableElementArray;
            GameMain.GetInstance().DispatchEvent(hudEvent);

            //等待ready go结束
            this.startWorkTimer = new egret.Timer(1500, 1);
            this.startWorkTimer.addEventListener(egret.TimerEvent.TIMER, this.PreviewDropDown, this);
            this.startWorkTimer.start();

            let event = new HUDEvent();
            event.eventType = HUDEventType.ShowReadyGo;
            GameMain.GetInstance().DispatchEvent(event);
        }
        else
        {
            this.creatorWorkParam.paramIndex = ControlableElementCreateType.Normal;
            this.creatorWorkParam.createNum = 1;
            var newElement = this.controlableElementCreator.CreateElement(this.creatorWorkParam);
		    this.nextControlableElementArray.push(newElement);

            this.PreviewDropDown();
        }
    }

    private PreviewDropDown()
    {
        var previewDropDownTimeInMS = 750;

        var event = new HUDEvent();
        event.param = previewDropDownTimeInMS;
        event.eventType = HUDEventType.PlayPreviewDropDownAnim;
        GameMain.GetInstance().DispatchEvent(event);

        //等待preview dropdown anim结束
        this.startWorkTimer = new egret.Timer(previewDropDownTimeInMS, 1);
        this.startWorkTimer.addEventListener(egret.TimerEvent.TIMER, this.ReallyStartWork, this);
        this.startWorkTimer.start();
    }

    private ReallyStartWork()
    {
        this.target = this.nextControlableElementArray.splice(0,1)[0];

        this.startWorkTimer = null;
        this.dropdownTimer = 0;
        this.DispatchControlEvent(SceneElementControlType.Add);
        super.Work();
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
				this.dropdownTimer += PlayerControl.DropdownInterval / 4;
			}
			else if (key == InputKey.Rotate)
			{
                this.DispatchControlEvent(SceneElementControlType.Rotation);
			}
		}
    }

    protected UpdateInternal(deltaTime:number)
    {
        if(this.target != null)
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

    protected OnPlayerControlSuccess(event:SceneElementControlSuccessEvent)
    {
        if (event != null)
        {
            if(event.controlType == SceneElementControlType.Rotation
                && this.target != null)
            {
                this.target.OnRotateACW();            
            }
            else if(event.controlType == SceneElementControlType.Add
                && event.playerControl)
            {
                var hudEvent = new HUDEvent();
                hudEvent.eventType = HUDEventType.RefreshControlablePreview;
                hudEvent.param = this.nextControlableElementArray;
                GameMain.GetInstance().DispatchEvent(hudEvent); 
            }
        }
    }

    protected OnPlayerControlFailed(event:SceneElementControlFailedEvent)
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
            this.PlaySound("OnDown_mp3");
            //下落到不能再下落了，就进入消除状态        
            let event = new PlayerControlFinishEvent();            
            GameMain.GetInstance().DispatchEvent(event);
        }
        else if(event.controlType == SceneElementControlType.Add && event.playerControl)
        {
            //已经无法创建新的元素了，就进入死亡状态
            let event = new GameOverEvent();            
            GameMain.GetInstance().DispatchEvent(event);
        }
    }

    private DispatchControlEvent(controlType:SceneElementControlType, moveDir?:Direction, moveStep?:number)
    {
        let event = new SceneElementControlEvent();
        event.sceneElements = this.target.GetSceneElements();
        event.controlType = controlType;
        event.moveDir = moveDir;
        event.moveStep = moveStep;
        event.playerControl = true;
        if (controlType == SceneElementControlType.Rotation)
        {
            event.rotateTargetPosList = this.target.GetRotateACWPosList();
        }
        GameMain.GetInstance().DispatchEvent(event);        
    }

    private PlaySound(sound: string)
	{
		if (this.playSoundEvent == null)
		{
			this.playSoundEvent = new PlaySoundEvent(sound, 1);
		}
		this.playSoundEvent.Key = sound;
        GameMain.GetInstance().DispatchEvent(this.playSoundEvent);
	}
}

