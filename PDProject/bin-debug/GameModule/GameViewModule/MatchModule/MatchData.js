var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//MVC中的M
var MatchData = (function () {
    function MatchData() {
        this.sceneData = []; //左上角是00
        this.playerControlPill = new PlayerControlPill();
    }
    MatchData.prototype.Init = function () {
        for (var i = 0; i < MatchData.battleGroundColumns; ++i) {
            this.sceneData.push([]);
            for (var j = 0; j < MatchData.battleGroundRows; ++j) {
                this.sceneData[i].push(null);
            }
        }
    };
    MatchData.prototype.TryCreatePill = function () {
        this.playerControlPill.Reset(); //复用药丸实例
        var pill1 = this.playerControlPill.pill1;
        var pill2 = this.playerControlPill.pill2;
        //TODO：如果在sceneData中已经存在东西了，则GameOver
        this.sceneData[pill1.posx][pill1.posy] = pill1;
        this.sceneData[pill2.posx][pill2.posy] = pill2;
        return true;
    };
    MatchData.prototype.TryDropdownPill = function () {
        var result = true;
        var pill1 = this.playerControlPill.pill1;
        var pill2 = this.playerControlPill.pill2;
        if (pill1.posy > pill1.posy) {
            //pill1在底部
            var newPosx = pill1.posx;
            var newPosy = pill1.posy + 1;
            result = this.sceneData[newPosx][newPosy] == null && newPosy < MatchData.battleGroundRows;
            if (result) {
                this.sceneData[pill2.posx][pill2.posy] = null;
                pill2.MoveTo(pill1.posx, pill1.posy);
                pill1.MoveTo(newPosx, newPosy);
            }
        }
        else if (pill1.posy < pill2.posy) {
            //pill2在底部
            var newPosx = pill2.posx;
            var newPosy = pill2.posy + 1;
            result = this.sceneData[newPosx][newPosy] == null && newPosy < MatchData.battleGroundRows;
            if (result) {
                this.sceneData[pill1.posx][pill1.posy] = null;
                pill1.MoveTo(pill2.posx, pill2.posy);
                pill2.MoveTo(newPosx, newPosy);
            }
        }
        else {
            //药丸是横着的
            var newPosx1 = pill1.posx;
            var newPosy1 = pill1.posy + 1;
            var newPosx2 = pill2.posx;
            var newPosy2 = pill2.posy + 1;
            result = this.sceneData[newPosx1][newPosy1] == null && newPosy1 < MatchData.battleGroundRows
                && this.sceneData[newPosx2][newPosy2] == null && newPosy2 < MatchData.battleGroundRows;
            if (result) {
                this.MoveElement(pill1, newPosx1, newPosy1);
                this.MoveElement(pill2, newPosx2, newPosy2);
            }
            else {
                console.log("Try drop down 2 " + result);
            }
        }
        return result;
    };
    MatchData.prototype.MoveElement = function (element, newPosx, newPosy) {
        var gameElementInColumn = this.sceneData[element.posx];
        gameElementInColumn[element.posy] = null;
        gameElementInColumn = this.sceneData[newPosx];
        gameElementInColumn[newPosy] = element;
        element.MoveTo(newPosx, newPosy);
    };
    MatchData.battleGroundColumns = 8;
    MatchData.battleGroundRows = 16;
    return MatchData;
}());
__reflect(MatchData.prototype, "MatchData");
//# sourceMappingURL=MatchData.js.map