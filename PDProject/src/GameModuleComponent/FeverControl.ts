class FeverControl extends GameModuleComponentBase
{
    private feverEnerge:number;
    private feverProgressBar:ProgressBar;
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
    }

    public Update(deltaTime:number)
    {

    }
}