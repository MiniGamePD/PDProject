class PillRenderer extends DisplayElementBase
{
    public mPillType: PillElementType;
    public constructor()
    {
        super();
        this.renderer = new egret.Bitmap();       
        this.color = this.RandomColor(); 
        this.canDrop = true;
    }

    public SetPillType(pillType: PillElementType){
        this.mPillType = pillType;
        this.RefreshTexture();
    }

    private RefreshTexture():void
    {
        let texture: egret.Texture;
        let path = "pd_res_json.Pill_";
        if (this.mPillType == PillElementType.Single){
            path += "Single_"
        }
        switch(this.color)
        {
            case GameElementColor.red:
                path += "Red";
                break;
            case GameElementColor.blue:
                path += "Blue";
                break;
            case GameElementColor.yellow:
                path += "Yellow";
                break;
            default:
                if(DEBUG)
                {
                    console.log("Unknow Color:" + this.color);
                }    
                break;
        }
        texture = this.GetTexture(path);
		this.renderer.texture = texture;
        if (this.mPillType == PillElementType.right){
            this.renderer.rotation = 180;
        }
    }

    // 删除捆绑元素后，重新计算药丸的类型
    public UnbindElement(element: DisplayElementBase): boolean{
        var result = super.UnbindElement(element);
        if (result
            && this.GetBindElements().length == 0){
                this.SetPillType(PillElementType.Single);
        }
        return result;
    }

    // 删除捆绑元素后，重新计算药丸的类型
    public UnbindAllElement(){
        super.UnbindAllElement();
        this.SetPillType(PillElementType.Single);
    }

}

enum PillElementType {
    left,   //左边
    right,  //右边
    Single, //独立
}