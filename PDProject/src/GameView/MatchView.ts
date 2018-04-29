class MatchView extends GameView {
    private textField: egret.TextField;
    private mResModule: IResModule;
    private mStageWidth: number;
    private mStageHeight: number;

    private mRedPill: egret.Bitmap;

    public CreateView(): void {
        this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.mStageWidth = GameMain.GetInstance().GetStageWidth();
        this.mStageHeight = GameMain.GetInstance().GetStageHeight();

        this.LoadBackGround();

        this.LoadPillForTest();
        GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
    }

    private LoadBackGround() {
        if (this.mResModule != null) {
            let bg = this.mResModule.CreateBitmapByName("pd_res_json.BackGround");
            this.addChild(bg);
            bg.width = this.mStageWidth;
            bg.height = this.mStageHeight;

            let bottle = this.mResModule.CreateBitmapByName("pd_res_json.Bottle");
            this.addChild(bottle);
            bottle.width = this.mStageWidth;
            bottle.height = this.mStageHeight;
        }
    }

    private LoadPillForTest() {
        if (this.mResModule != null) {
            this.mRedPill = this.mResModule.CreateBitmapByName("pd_res_json.Pill_Red");
            this.addChild(this.mRedPill);
            this.mRedPill.x = this.mStageWidth/2;
            this.mRedPill.y = this.mStageHeight/2;

            let bluePill = this.mResModule.CreateBitmapByName("pd_res_json.Pill_Blue");
            this.addChild(bluePill);
            bluePill.x = this.mStageWidth/2;
            bluePill.y = this.mStageHeight/2 + 50;

            let yellowPill = this.mResModule.CreateBitmapByName("pd_res_json.Pill_Yellow");
            this.addChild(yellowPill);
            yellowPill.x = this.mStageWidth/2;
            yellowPill.y = this.mStageHeight/2 + 100;
        }
    }

    private OnInputEvent(event: InputEvent): void{
        if (this.mRedPill != null){
            var key = event.Key;
            if (key == InputKey.Left){
                this.mRedPill.x -= 10;
            }
            else if (key == InputKey.Right){
                this.mRedPill.x += 10;
            }
            else if (key == InputKey.Up){
                this.mRedPill.y -= 20;
            }
            else if (key == InputKey.Down){
                this.mRedPill.y += 20;
            }
            else if (key == InputKey.Rotate){
                this.mRedPill.rotation += 90;
            }
        }
    }
}