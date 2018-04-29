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
        this.mStageWidth = GameMain.GetInstance().GetStageWidth();
        this.mStageHeight = GameMain.GetInstance().GetStageHeight();
        this.LoadBackGround();
        this.LoadPillForTest();
        GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
    };
    MatchView.prototype.LoadBackGround = function () {
        if (this.mResModule != null) {
            var bg = this.mResModule.CreateBitmapByName("pd_res_json.BackGround");
            this.addChild(bg);
            bg.width = this.mStageWidth;
            bg.height = this.mStageHeight;
            var bottle = this.mResModule.CreateBitmapByName("pd_res_json.Bottle");
            this.addChild(bottle);
            bottle.width = this.mStageWidth;
            bottle.height = this.mStageHeight;
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
    return MatchView;
}(GameView));
__reflect(MatchView.prototype, "MatchView");
//# sourceMappingURL=MatchView.js.map