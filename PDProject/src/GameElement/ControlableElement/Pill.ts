class Pill extends ControlableElement
{    
    public pill1:ScenePill;
    public pill2:ScenePill;
    public rotAngle:number; // 必须是0, 90，180，270中的一个值
    public rotatePosListTemp: number[];

    public constructor()
    {       
        super();         
        this.rotAngle = 0;             
        this.pill1 = new ScenePill();
        this.pill2 = new ScenePill();
        this.pill1.SetPillType(PillElementType.left);
        this.pill1.RefreshTexture();
        this.pill2.SetPillType(PillElementType.right);
        this.pill2.RefreshTexture();
        this.pill1.BindElement(this.pill2);        
        //坐标表示药丸左下角块的坐标, 初始坐标在瓶子正中间的最上方
        this.InitPos(3,0);
    }

    public OnRotateACW()
    {
        this.rotAngle += 90;
        if (this.rotAngle == 360)
        {
            this.rotAngle = 0;
        }

        if (this.rotAngle == 0)
        {
            this.pill1.SetPillType(PillElementType.left);
            this.pill2.SetPillType(PillElementType.right);
        }
        else if (this.rotAngle == 90)
        {
            this.pill1.SetPillType(PillElementType.down);
            this.pill2.SetPillType(PillElementType.up);
        }
        else if (this.rotAngle == 180)
        {
            this.pill1.SetPillType(PillElementType.right);
            this.pill2.SetPillType(PillElementType.left);
        }
        else if (this.rotAngle == 270)
        {
            this.pill1.SetPillType(PillElementType.up);
            this.pill2.SetPillType(PillElementType.down);
        }

        this.pill1.RefreshTexture();
        this.pill2.RefreshTexture();
    }
    
    public GetRotateACWPosList(): number[]
    {
        this.rotatePosListTemp = [];
        this.rotatePosListTemp.push(this.pill1.posx);
        this.rotatePosListTemp.push(this.pill1.posy);
        var pill2RotatePos = Tools.RotateACW(this.rotatePosListTemp, [this.pill2.posx, this.pill2.posy]);
        this.rotatePosListTemp.push(pill2RotatePos[0]);
        this.rotatePosListTemp.push(pill2RotatePos[1]);
        return this.rotatePosListTemp;
    }

    protected InitPos(posx:number, posy:number):void
    {
        this.posx = posx;
        this.posy = posy;
        this.pill1.MoveTo(this.posx, this.posy);
        this.pill2.MoveTo(this.posx + 1, this.posy);
    }   

    protected FillDisplayElementArray()
    {
        this.displayElements.push(this.pill1);
        this.displayElements.push(this.pill2);
    }
}

