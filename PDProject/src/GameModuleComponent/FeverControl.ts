class FeverControl extends GameModuleComponentBase
{
    private feverEnerge:number;
    private basicFeverStep:number = 2;

    public Init()
    {
        this.feverEnerge = 0;
        GameMain.GetInstance().AddEventListener(EliminateEvent.EventName, this.OnEliminateHappen, this);
    }

    public Release()
    {
        GameMain.GetInstance().RemoveEventListener(EliminateEvent.EventName, this.OnEliminateHappen, this);
    }

    private OnEliminateHappen(event:EliminateEvent)
    {
        this.feverEnerge += this.basicFeverStep * event.eliminateInfo.EliminateRound;
        if(this.feverEnerge > 100)
        {
            this.feverEnerge = 100;
        }
    }

    public Update(deltaTime:number)
    {

    }

    public GetFeverEnerge():number
    {
        return this.feverEnerge;
    }

    public AttachToHUD()
    {
        var event = new HUDEvent();
        event.eventType = HUDEventType.SetFeverControl;
        event.param = this;
        GameMain.GetInstance().DispatchEvent(event);
    }
}