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
var LobbyView = (function (_super) {
    __extends(LobbyView, _super);
    function LobbyView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LobbyView.prototype.CreateView = function () {
        var stageWidth = GameMain.GetInstance().GetStageWidth();
        var stageHeight = GameMain.GetInstance().GetStageHeight();
        this.textField = new egret.TextField();
        this.textField.x = 0;
        this.textField.y = stageHeight / 4;
        this.textField.width = stageWidth;
        this.textField.height = 100;
        this.textField.rotation = -5;
        this.textField.fontFamily = "Impact";
        this.textField.size *= 2;
        this.textField.textAlign = "center";
        this.textField.text = "Pocket Doctor";
        this.addChild(this.textField);
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(stageWidth / 2 - 100, stageHeight / 5 * 3, 200, 100);
        shape.graphics.endFill();
        this.addChild(shape);
        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickStartGame, this);
        var text = new egret.TextField();
        text.text = "start game";
        text.x = 0;
        text.y = stageHeight / 5 * 3;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.width = stageWidth;
        text.height = 100;
        this.addChild(text);
        // this.PlayBgm();
    };
    LobbyView.prototype.OnClickStartGame = function () {
        egret.log("OnClickStartGame");
        GameMain.GetInstance().SwitchGameState(GameStateType.Match);
    };
    LobbyView.prototype.PlayBgm = function () {
        // if (this.mSoundModule != null){
        //     this.mSoundModule.PlaySound("bgm_mp3", -1);
        // }
        var event = new PlaySoundEvent("bgm_mp3", -1);
        GameMain.GetInstance().DispatchEvent(event);
    };
    return LobbyView;
}(GameView));
__reflect(LobbyView.prototype, "LobbyView");
//# sourceMappingURL=LobbyView.js.map