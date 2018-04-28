var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ModuleMgr = (function () {
    function ModuleMgr() {
    }
    ModuleMgr.prototype.Init = function () {
        this.CreateModule();
        this.InitModule();
    };
    ModuleMgr.prototype.CreateModule = function () {
        this.mModuleList = [];
        this.mModuleList.push(new LobbyMgr);
        this.mModuleList.push(new MatchMgr);
        this.mModuleCount = this.mModuleList.length;
    };
    ModuleMgr.prototype.InitModule = function () {
        for (var i = 0; i < this.mModuleCount; ++i) {
            this.mModuleList[i].Init();
        }
    };
    ModuleMgr.prototype.Update = function (deltaTime) {
        for (var i = 0; i < this.mModuleCount; ++i) {
            this.mModuleList[i].Update(deltaTime);
        }
    };
    ModuleMgr.prototype.Release = function () {
        for (var i = 0; i < this.mModuleCount; ++i) {
            this.mModuleList[i].Release();
        }
    };
    ModuleMgr.prototype.GetModule = function (moduleType) {
        return this.mModuleList[moduleType];
    };
    ModuleMgr.prototype.OnGameStateChange = function (from, to) {
        for (var i = 0; i < this.mModuleCount; ++i) {
            this.mModuleList[i].OnGameStateChange(from, to);
        }
    };
    return ModuleMgr;
}());
__reflect(ModuleMgr.prototype, "ModuleMgr", ["IModuleMgr"]);
//# sourceMappingURL=ModuleMgr.js.map