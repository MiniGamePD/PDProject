class LobbyView extends  egret.DisplayObjectContainer implements IGameView
 {
    private textField: egret.TextField;

    public CreateView(): void
    {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.textField.text = "Pocket Doctor";
    }

    public UpdateView(): void
    {
    }

    public ReleaseView(): void
    {

    }

    public GetDisplayObjectContainer():egret.DisplayObjectContainer
    {
        return this;
    }
}