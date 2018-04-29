class MatchView extends GameView {
    private textField: egret.TextField;
    private mResMgr: IResMgr;
    private mStageWidth: number;
    private mStageHeight: number;

    public CreateView(): void {
        this.mResMgr = <IResMgr>GameMain.GetInstance().GetModule(ModuleType.RES_MGR);
        this.mStageWidth = GameMain.GetInstance().GetStageWidth();
        this.mStageHeight = GameMain.GetInstance().GetStageHeight();

        this.LoadBackGround();

        this.LoadPillForTest();
    }

    private LoadBackGround() {
        if (this.mResMgr != null) {
            let bg = this.mResMgr.CreateBitmapByName("pd_res_json.BackGround");
            this.addChild(bg);
            bg.width = this.mStageWidth;
            bg.height = this.mStageHeight;

            let bottle = this.mResMgr.CreateBitmapByName("pd_res_json.Bottle");
            this.addChild(bottle);
            bottle.width = this.mStageWidth;
            bottle.height = this.mStageHeight;
        }
    }

    private LoadPillForTest() {
        if (this.mResMgr != null) {
            let redPill = this.mResMgr.CreateBitmapByName("pd_res_json.Pill_Red");
            this.addChild(redPill);
            redPill.x = this.mStageWidth/2;
            redPill.y = this.mStageHeight/2;

            let bluePill = this.mResMgr.CreateBitmapByName("pd_res_json.Pill_Blue");
            this.addChild(bluePill);
            bluePill.x = this.mStageWidth/2;
            bluePill.y = this.mStageHeight/2 + 50;

            let yellowPill = this.mResMgr.CreateBitmapByName("pd_res_json.Pill_Yellow");
            this.addChild(yellowPill);
            yellowPill.x = this.mStageWidth/2;
            yellowPill.y = this.mStageHeight/2 + 100;
        }
    }
}