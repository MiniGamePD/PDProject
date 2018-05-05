class MatchView extends GameView
{
    private mResModule: IResModule;
    private mSoundModule: ISoundModule
    private mStageWidth: number;
    private mStageHeight: number;
    private mScene: Scene;
    private mBattleGroundStartXCenter: number; //00号元素的中心点坐标x
    private mBattleGroundStartYCenter: number; //00号元素的中心点坐标y
    private mElementWidth: number;
    private mElementHeight: number;
    private mBattleGround: egret.Sprite;
    private mRedPill: egret.Bitmap;
    private eliminatingAnim: EliminatingAnimation;

    private scoreItem: MatchScoreItem;

    public CreateView(): void
    {
        this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.mSoundModule = <ISoundModule>GameMain.GetInstance().GetModule(ModuleType.SOUND);
        this.mStageWidth = GameMain.GetInstance().GetStageWidth();
        this.mStageHeight = GameMain.GetInstance().GetStageHeight();

        this.LoadBackGround();

        this.scoreItem = new MatchScoreItem();
        this.scoreItem.Init();
        this.addChild(this.scoreItem);

        this.PlayBgm();

        this.eliminatingAnim = new EliminatingAnimation();
        this.eliminatingAnim.Init(this);
        
        GameMain.GetInstance().AddEventListener(SceneElementControlSuccessEvent.EventName, this.ProcessControlSuccess, this);


        //this.LoadPillForTest();
        //GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
    }

    public SetScene(scene: Scene)
    {
        this.mScene = scene;
    }

    public UpdateView(deltaTime: number): void
    {
        if (this.mScene.eliminateInfo.HasInfo)
        {
            this.UpdateEliminating(deltaTime);
        }
        else
        {
            this.RefreshScene();
        }

        this.scoreItem.Update(deltaTime);
    }

    private ProcessControlSuccess(event: SceneElementControlSuccessEvent)
    {
        this.RefreshScene();
    }

    private UpdateEliminating(deltaTime: number)
    {
        if (this.eliminatingAnim != null)
        {
            if (!this.eliminatingAnim.IsPlaying())
            {
                this.eliminatingAnim.Start(this.mScene.eliminateInfo);
            }
            this.eliminatingAnim.Update(deltaTime);
        }
    }

    private EliminatLightning(deltaTime: number)
    {

    }

    private RefreshScene()
    {
        for (var i = 0; i < Scene.Columns; ++i)
        {
            for (var j = 0; j < Scene.Rows; ++j)
            {
                let element = this.mScene.sceneData[i][j];
                if (element != null)
                {
                    if (!element.hasAddToDisplayList)
                    {
                        element.renderer.width = this.mElementWidth;
                        element.renderer.height = this.mElementHeight;
                        element.renderer.anchorOffsetX = this.mElementWidth / 2;
                        element.renderer.anchorOffsetY = this.mElementHeight / 2;
                        this.mBattleGround.addChild(element.renderer);
                        element.hasAddToDisplayList = true;
                        //console.log(element + " add to dis " + element.renderer.width + "," + element.renderer.height);
                    }

                    if (element.dirty)
                    {
                        element.renderer.x = this.GetRenderPosX(element.posx);
                        element.renderer.y = this.GetRenderPosY(element.posy);
                        element.dirty = false;
                        //console.log(element + " refresh " + element.renderer.x + "," + element.renderer.y);
                    }
                }
            }
        }
    }

    public RefreshTextrue(): void
    {
        for (var i = 0; i < Scene.Columns; ++i)
        {
            for (var j = 0; j < Scene.Rows; ++j)
            {
                let element = this.mScene.sceneData[i][j];
                if (element != null && element.dirty)
                {
                    element.RefreshTexture();
                }
            }
        }
    }

    public GetRenderPosX(posx: number): number
    {
        return this.mBattleGroundStartXCenter + this.mElementWidth * posx;
    }

    public GetRenderPosY(posy: number): number
    {
        return this.mBattleGroundStartYCenter + this.mElementHeight * posy;
    }

    private LoadBackGround()
    {
        if (this.mResModule != null)
        {
            let bg = this.mResModule.CreateBitmapByName("pd_res_json.BackGround");
            this.addChild(bg);
            bg.width = this.mStageWidth;
            bg.height = this.mStageHeight;

            let bottle = this.mResModule.CreateBitmapByName("pd_res_json.Bottle");

            bottle.x = 0;
            bottle.y = 0;
            //bottle.anchorOffsetX += bottle.width / 2;
            //bottle.anchorOffsetY += bottle.height / 2;

            //bottle.width = this.mStageWidth;
            //bottle.height = this.mStageHeight;

            this.mBattleGround = new egret.Sprite();
            let battleRect = new egret.Rectangle(50, 170, bottle.width - 100, bottle.height - 188);
            this.mBattleGround.x = this.mStageWidth / 2 - battleRect.width / 2 - 25;
            this.mBattleGround.y = this.mStageHeight / 2 - battleRect.height / 2 - 99;
            this.mBattleGround.graphics.beginFill(0xFF0000, 0.3);
            this.mBattleGround.graphics.drawRect(battleRect.x, battleRect.y, battleRect.width, battleRect.height);
            this.mBattleGround.graphics.endFill();

            this.mBattleGround.graphics.beginFill(0x0000FF, 0.3);
            this.mBattleGround.graphics.drawRect(bottle.x, bottle.y, bottle.width, bottle.height);
            this.mBattleGround.graphics.endFill();

            this.addChild(this.mBattleGround);

            this.mBattleGround.addChild(bottle);

            console.log(battleRect);

            this.mElementWidth = battleRect.width / Scene.Columns;
            this.mElementHeight = battleRect.height / Scene.Rows;
            this.mBattleGroundStartXCenter = battleRect.x + this.mElementWidth / 2;
            this.mBattleGroundStartYCenter = battleRect.y + this.mElementHeight / 2;
        }
    }

    private LoadPillForTest()
    {
        if (this.mResModule != null)
        {
            this.mRedPill = this.mResModule.CreateBitmapByName("pd_res_json.Pill_Red");
            this.addChild(this.mRedPill);
            this.mRedPill.x = this.mStageWidth / 2;
            this.mRedPill.y = this.mStageHeight / 2;

            let bluePill = this.mResModule.CreateBitmapByName("pd_res_json.Pill_Blue");
            this.addChild(bluePill);
            bluePill.x = this.mStageWidth / 2;
            bluePill.y = this.mStageHeight / 2 + 50;

            let yellowPill = this.mResModule.CreateBitmapByName("pd_res_json.Pill_Yellow");
            this.addChild(yellowPill);
            yellowPill.x = this.mStageWidth / 2;
            yellowPill.y = this.mStageHeight / 2 + 100;
        }
    }

    private OnInputEvent(event: InputEvent): void
    {
        if (this.mRedPill != null)
        {
            var key = event.Key;
            if (key == InputKey.Left)
            {
                this.mRedPill.x -= 10;
            }
            else if (key == InputKey.Right)
            {
                this.mRedPill.x += 10;
            }
            else if (key == InputKey.Up)
            {
                this.mRedPill.y -= 20;
            }
            else if (key == InputKey.Down)
            {
                this.mRedPill.y += 20;
            }
            else if (key == InputKey.Rotate)
            {
                this.mRedPill.rotation += 90;
            }
        }
    }

    private PlayBgm()
    {
        // if (this.mSoundModule != null){
        //     this.mSoundModule.PlaySound("bgm_mp3", -1);
        // }
        var event: PlaySoundEvent = new PlaySoundEvent("bgm_mp3", -1);
        GameMain.GetInstance().DispatchEvent(event);
    }
}