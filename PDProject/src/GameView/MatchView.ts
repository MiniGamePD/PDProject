class MatchView extends GameView
{
    private textField: egret.TextField;

    public CreateView(): void
    {
        let stageWidth = GameMain.GetInstance().GetStageWidth();
        let stageHeight = GameMain.GetInstance().GetStageHeight();        

        var shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0xFF0088);
        shape.graphics.drawRect(0, 0, stageWidth, stageHeight);
        shape.graphics.endFill();        
        this.addChild( shape );      
    }
}