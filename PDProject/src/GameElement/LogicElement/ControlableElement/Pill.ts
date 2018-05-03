class Pill extends ControlableElement
{    
    public pill1:PillRenderer;
    public pill2:PillRenderer;
    public posx:number;
    public posy:number;
    public rotAngle:number; // 必须是0, 90，180，270中的一个值

    public constructor()
    {       
        super();         
        this.rotAngle = 0;             
        this.pill1 = new PillRenderer();
        this.pill2 = new PillRenderer();
        this.pill1.SetPillType(PillElementType.left);
        this.pill1.RefreshTexture();
        this.pill2.SetPillType(PillElementType.right);
        this.pill2.RefreshTexture();
        this.pill1.BindElement(this.pill2);        
        //坐标表示药丸左下角块的坐标, 初始坐标在瓶子正中间的最上方
        this.MoveTo(3,0);
    }

    public TryRotate():boolean
    {
        return false;
    }

    public GetRotateCenter(): number[]
    {
        return [this.pill1.posx, this.pill1.posy];
    }

    protected MoveTo(posx:number, posy:number):void
    {
        this.posx = posx;
        this.posy = posy;
        //TODO：根据旋转角度，来决定子pill的位置
        this.pill1.MoveTo(this.posx, this.posy);
        this.pill2.MoveTo(this.posx + 1, this.posy);
    }   

    protected FillTargets()
    {
        this.targets.push(this.pill1);
        this.targets.push(this.pill2);
    }
}

