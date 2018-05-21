class MatchView extends GameView
{
    private mResModule: IResModule;
    private mSoundModule: ISoundModule
    private mStageWidth: number;
    private mStageHeight: number;
    private mScene: Scene;
    private mBattleGround: egret.Sprite;
    private eliminatingAnim: EliminatingAnimation;
    private bossSkillAnim: BossSkillAnimation;

    private hud:MatchHUD;

    public CreateView(): void
    {
        this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.mSoundModule = <ISoundModule>GameMain.GetInstance().GetModule(ModuleType.SOUND);
        this.mStageWidth = GameMain.GetInstance().GetStageWidth();
        this.mStageHeight = GameMain.GetInstance().GetStageHeight();

        this.LoadBackGround();
        this.CreateHUD();

        // this.PlayBgm();
        this.bossSkillAnim = new BossSkillAnimation();
        this.bossSkillAnim.Init(this);

        this.eliminatingAnim = new EliminatingAnimation();
        this.eliminatingAnim.Init(this);
        
        GameMain.GetInstance().AddEventListener(SceneElementControlSuccessEvent.EventName, this.ProcessControlSuccess, this);
        GameMain.GetInstance().AddEventListener(ReplayGameEvent.EventName, this.OnReplayGame, this);
    }

    public ReleaseView(): void 
    {
        this.DeleteHUD();

        GameMain.GetInstance().RemoveEventListener(SceneElementControlSuccessEvent.EventName, this.ProcessControlSuccess, this);
        GameMain.GetInstance().RemoveEventListener(ReplayGameEvent.EventName, this.OnReplayGame, this);
    }

    private ResetView()
    {
        let bottle = this.mBattleGround.getChildAt(0);
        this.mBattleGround.removeChildren();
        this.mBattleGround.addChild(bottle);

        this.hud.Reset();   
    }

    public SetScene(scene: Scene)
    {
        this.mScene = scene;
    }

    public UpdateView(deltaTime: number): void
    {
        if (this.mScene.bossSkillInfo.hasInfo)
        {
            this.UpdateBossSkill(deltaTime);
        }
        else if (this.mScene.eliminateInfo.HasInfo)
        {
            this.UpdateEliminating(deltaTime);
        }
        else
        {
            this.RefreshScene();
        }

        this.hud.Update(deltaTime);
    }

    private ProcessControlSuccess(event: SceneElementControlSuccessEvent)
    {
        this.RefreshScene();
    }

    private UpdateBossSkill(deltaTime: number)
    {
        if (this.bossSkillAnim != null)
        {
            if (!this.bossSkillAnim.IsPlaying())
            {
                this.bossSkillAnim.Start(this.mScene.bossSkillInfo);
            }
            this.bossSkillAnim.Update(deltaTime);
        }
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

            //移除已经不用的DisplayObject
            var deadElementRenderArray:egret.DisplayObject[] = this.eliminatingAnim.GetDeadElementRenderArray();
            var count = deadElementRenderArray.length;
            if(count > 0)
            {
                for(var i = 0; i < count; ++i)
                {
                    var displayObj:egret.DisplayObject = deadElementRenderArray[i];
                    this.BattleGroundRemoveChild(displayObj);
                }

                this.eliminatingAnim.ClearGetDeadElementRenderArray();
            }
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
                        //renderer == null，应该是一个placeholder
                        if(element.renderer != null)
                        {
                            element.renderer.width = Tools.MatchViewElementWidth * element.BlockWidth();
                            element.renderer.height = Tools.MatchViewElementHeight * element.BlockHeight();
                            element.renderer.anchorOffsetX = Tools.MatchViewElementWidth / 2;
                            element.renderer.anchorOffsetY = Tools.MatchViewElementHeight / 2;
                            this.mBattleGround.addChild(element.renderer);
                        }
                        element.hasAddToDisplayList = true;
                        //console.log(element + " add to dis " + element.renderer.width + "," + element.renderer.height);
                    }

                    if (element.dirty)
                    {
                        //renderer == null，应该是一个placeholder
                        if(element.renderer != null)
                        {
                            element.renderer.x = Tools.GetMatchViewRenderPosX(element.posx);
                            element.renderer.y = Tools.GetMatchViewRenderPosY(element.posy);
                        }
                        element.dirty = false;
                        //console.log(element + " refresh " + element.renderer.x + "," + element.renderer.y);
                    }
                }
            }
        }
    }

    public BattleGroundAddChild(child: egret.DisplayObject)
    {
        this.mBattleGround.addChild(child);
    }

    public BattleGroundRemoveChild(child: egret.DisplayObject)
    {
        this.mBattleGround.removeChild(child);
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

    private LoadBackGround()
    {
        if (this.mResModule != null)
        {
            let bg = this.mResModule.CreateBitmapByName("pd_res_json.BackGround");
            this.addChild(bg);
            bg.width = this.mStageWidth;
            bg.height = this.mStageHeight;

            if(DEBUG)
            {
                console.log("stage is " + egret.Capabilities.boundingClientWidth + "x" + egret.Capabilities.boundingClientHeight);
            }

            this.mBattleGround = new egret.Sprite();
            //battle rect in stander resolution
            let battleRect = new egret.Rectangle(128, 294, 382, 722);
            battleRect.x = battleRect.x * this.mStageWidth / standerScreenWidth;
            battleRect.y = battleRect.y * this.mStageHeight / standerScreenHeight;
            battleRect.width = battleRect.width * this.mStageWidth / standerScreenWidth;
            battleRect.height = battleRect.height * this.mStageHeight / standerScreenHeight;

            this.mBattleGround.x = battleRect.x;
            this.mBattleGround.y = battleRect.y;

            if(DEBUG)
            {
                this.mBattleGround.graphics.beginFill(0xFF0000, 0.3);
                this.mBattleGround.graphics.drawRect(0, 0, battleRect.width, battleRect.height);
                this.mBattleGround.graphics.endFill();
            }

            this.addChild(this.mBattleGround);

            if(DEBUG)
                console.log(battleRect);

            Tools.MatchViewElementWidth = battleRect.width / Scene.Columns;
            Tools.MatchViewElementHeight = battleRect.height / Scene.Rows;
            Tools.MatchViewBattleGroundStartXCenter = Tools.MatchViewElementWidth / 2;
            Tools.MatchViewBattleGroundStartYCenter = Tools.MatchViewElementHeight / 2;
        }
    }

    private CreateHUD()
    {
        this.hud = new MatchHUD();
        this.hud.width = this.mStageWidth;
        this.hud.height = this.mStageHeight;
        this.hud.x = this.hud.y = 0;
        this.hud.Init();
        this.addChild(this.hud);
    }

    private DeleteHUD()
    {
        this.hud.Release();
        this.hud = null;
    }

    private PlayBgm()
    {
        // if (this.mSoundModule != null){
        //     this.mSoundModule.PlaySound("bgm_mp3", -1);
        // }
        var event: PlaySoundEvent = new PlaySoundEvent("bgm_mp3", -1);
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnReplayGame(event:ReplayGameEvent)
    {
        this.ResetView();
    }
}