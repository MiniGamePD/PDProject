class FeverItem extends egret.DisplayObjectContainer
{
    private feverProgress:ProgressBar;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var hpBarBgRect = new egret.Rectangle(0, 0, 50, 200);
        var dx = hpBarBgRect.width * 0.05;
        var dy = hpBarBgRect.height * 0.05;
        var hpBarFgRect = hpBarBgRect.clone();
        hpBarFgRect.inflate(-dx, -dy);

        this.feverProgress = new ProgressBar("pd_res_json.Pill_Bg", hpBarBgRect, "pd_res_json.Bottle2", hpBarFgRect);
        this.feverProgress.Adapt();
        this.addChild(this.feverProgress);
    }

    public Init()
    {

    }

    public Release()
    {

    }

    public Update(delta:number)
    {

    }
}