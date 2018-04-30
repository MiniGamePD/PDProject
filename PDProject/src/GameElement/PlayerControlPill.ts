class PlayerControlPill
{
    public pill1:Pill;
    public pill2:Pill;
    public posx:number;
    public posy:number;
    public rotAngle:number; // 必须是0, 90，180，270中的一个值

    public constructor()
    {      
        this.pill1 = new Pill();
        this.pill2 = new Pill();
    }

    public Reset():void
    {        
        this.rotAngle = 0;        
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
}

