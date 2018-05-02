var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var MatchView = (function (_super) {
    __extends(MatchView, _super);
    function MatchView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatchView.prototype.CreateView = function () {
        this.mResModule = GameMain.GetInstance().GetModule(ModuleType.RES);
        this.mSoundModule = GameMain.GetInstance().GetModule(ModuleType.SOUND);
        this.mStageWidth = GameMain.GetInstance().GetStageWidth();
        this.mStageHeight = GameMain.GetInstance().GetStageHeight();
        this.LoadBackGround();
        this.PlayBgm();
        this.eliminatingAnim = new EliminatingAnimation();
        this.eliminatingAnim.Init(this);
        //this.LoadPillForTest();
        //GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
    };
    MatchView.prototype.SetScene = function (scene) {
        this.mScene = scene;
    };
    MatchView.prototype.UpdateView = function (deltaTime) {
        if (this.mScene.eliminateInfo.HasInfo) {
            this.UpdateEliminating(deltaTime);
        }
        else {
            this.RefreshScene();
        }
    };
    MatchView.prototype.UpdateEliminating = function (deltaTime) {
        if (this.eliminatingAnim != null) {
            if (!this.eliminatingAnim.IsPlaying()) {
                this.eliminatingAnim.Start(this.mScene.eliminateInfo);
            }
            this.eliminatingAnim.Update(deltaTime);
        }
    };
    MatchView.prototype.EliminatLightning = function (deltaTime) {
    };
    MatchView.prototype.RefreshScene = function () {
        for (var i = 0; i < Scene.Columns; ++i) {
            for (var j = 0; j < Scene.Rows; ++j) {
                var element = this.mScene.sceneData[i][j];
                if (element != null) {
                    if (!element.hasAddToDisplayList) {
                        element.renderer.width = this.mElementWidth;
                        element.renderer.height = this.mElementHeight;
                        element.renderer.anchorOffsetX = this.mElementWidth / 2;
                        element.renderer.anchorOffsetY = this.mElementHeight / 2;
                        this.mBattleGround.addChild(element.renderer);
                        element.hasAddToDisplayList = true;
                        //console.log(element + " add to dis " + element.renderer.width + "," + element.renderer.height);
                    }
                    if (element.dirty) {
                        element.renderer.x = this.GetRenderPosX(element.posx);
                        element.renderer.y = this.GetRenderPosY(element.posy);
                        element.dirty = false;
                        //console.log(element + " refresh " + element.renderer.x + "," + element.renderer.y);
                    }
                }
            }
        }
    };
    MatchView.prototype.GetRenderPosX = function (posx) {
        return this.mBattleGroundStartXCenter + this.mElementWidth * posx;
    };
    MatchView.prototype.GetRenderPosY = function (posy) {
        return this.mBattleGroundStartYCenter + this.mElementHeight * posy;
    };
    MatchView.prototype.LoadBackGround = function () {
        if (this.mResModule != null) {
            var bg = this.mResModule.CreateBitmapByName("pd_res_json.BackGround");
            this.addChild(bg);
            bg.width = this.mStageWidth;
            bg.height = this.mStageHeight;
            var bottle = this.mResModule.CreateBitmapByName("pd_res_json.Bottle");
            bottle.x = 0;
            bottle.y = 0;
            //bottle.anchorOffsetX += bottle.width / 2;
            //bottle.anchorOffsetY += bottle.height / 2;
            //bottle.width = this.mStageWidth;
            //bottle.height = this.mStageHeight;
            this.mBattleGround = new egret.Sprite();
            var battleRect = new egret.Rectangle(50, 170, bottle.width - 100, bottle.height - 188);
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
    };
    MatchView.prototype.LoadPillForTest = function () {
        if (this.mResModule != null) {
            this.mRedPill = this.mResModule.CreateBitmapByName("pd_res_json.Pill_Red");
            this.addChild(this.mRedPill);
            this.mRedPill.x = this.mStageWidth / 2;
            this.mRedPill.y = this.mStageHeight / 2;
            var bluePill = this.mResModule.CreateBitmapByName("pd_res_json.Pill_Blue");
            this.addChild(bluePill);
            bluePill.x = this.mStageWidth / 2;
            bluePill.y = this.mStageHeight / 2 + 50;
            var yellowPill = this.mResModule.CreateBitmapByName("pd_res_json.Pill_Yellow");
            this.addChild(yellowPill);
            yellowPill.x = this.mStageWidth / 2;
            yellowPill.y = this.mStageHeight / 2 + 100;
        }
    };
    MatchView.prototype.OnInputEvent = function (event) {
        if (this.mRedPill != null) {
            var key = event.Key;
            if (key == InputKey.Left) {
                this.mRedPill.x -= 10;
            }
            else if (key == InputKey.Right) {
                this.mRedPill.x += 10;
            }
            else if (key == InputKey.Up) {
                this.mRedPill.y -= 20;
            }
            else if (key == InputKey.Down) {
                this.mRedPill.y += 20;
            }
            else if (key == InputKey.Rotate) {
                this.mRedPill.rotation += 90;
            }
        }
    };
    MatchView.prototype.PlayBgm = function () {
        // if (this.mSoundModule != null){
        //     this.mSoundModule.PlaySound("bgm_mp3", -1);
        // }
        var event = new PlaySoundEvent("bgm_mp3", -1);
        GameMain.GetInstance().DispatchEvent(event);
    };
    return MatchView;
}(GameView));
__reflect(MatchView.prototype, "MatchView");
//# sourceMappingURL=MatchView.js.map