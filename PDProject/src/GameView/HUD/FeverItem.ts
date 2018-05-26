class FeverItem extends egret.DisplayObjectContainer
{
    private feverProgress:ProgressBar;
    private feverEnerge:number;
    private feverControl:FeverControl;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var feverEnergeBgRect = new egret.Rectangle(0, 0, 50, 200);
        var dx = feverEnergeBgRect.width * 0.05;
        var dy = feverEnergeBgRect.height * 0.05;
        var feverEnergeFgRect = feverEnergeBgRect.clone();
        feverEnergeFgRect.inflate(-dx, -dy);

        this.feverProgress = new ProgressBar("pd_res_json.Pill_Bg", feverEnergeBgRect, "pd_res_json.Bottle2", feverEnergeFgRect,
            ProgressBarDir.Vertical_U2D);
        this.feverProgress.x = feverEnergeBgRect.width / 2 + 20;
        this.feverProgress.y = feverEnergeBgRect.height / 2 + 20;
        this.feverProgress.anchorOffsetX = feverEnergeBgRect.width / 2;
        this.feverProgress.anchorOffsetY = feverEnergeBgRect.height / 2;
        this.feverProgress.rotation = 180;
        this.feverProgress.Adapt();
        this.addChild(this.feverProgress);

        this.feverEnerge = 0;
        this.feverProgress.SetProgress(0);
    }

    public Init()
    {
    }

    public Release()
    {
        this.feverControl = null;
    }

    public SetFeverControl(feverControl:FeverControl)
    {
        this.feverControl = feverControl;
    }

    public Update(delta:number)
    {
        if(this.feverControl != null)
        {
            if(this.feverEnerge != this.feverControl.GetFeverEnerge())
            {
                this.feverEnerge = this.feverControl.GetFeverEnerge();
                this.feverProgress.SetProgress(this.feverEnerge / 100);                   
            }
        }
    }
}