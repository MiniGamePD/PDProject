class SkillMoveEffect {
	private startX: number;
	private startY: number;
	private endX: number;
	private endY: number;
	private duration: number;
	private runningTime: number;

	private matchView: MatchView;
	private shape: egret.Shape;

	public Init(fromX: number, fromY: number, toX: number, toY: number, duration: number, matchView: MatchView)
	{	
		this.matchView = matchView;
		this.startX = fromX;
		this.startY = fromY;
		this.endX = toX;
		this.endY = toY;
		this.duration = duration;
		this.runningTime = 0;
		this.InitShape();
	}

	private InitShape()
	{
		this.shape = new egret.Shape();
        this.shape.graphics.beginFill(0xff0000);
        this.shape.graphics.drawCircle(0, 0, 10);
        this.shape.graphics.endFill();
		this.shape.x = this.startX;
		this.shape.y = this.startY;
		this.matchView.BattleGroundAddChild(this.shape);
	}

	public Update(deltaTime: number)
	{
		this.runningTime += deltaTime;
		var rate = this.runningTime / this.duration;
		if (rate > 1) 
			rate = 1;
		this.shape.x = this.startX + (this.endX - this.startX) * rate;
		this.shape.y = this.startY + (this.endY - this.startY) * rate;
	}

	public IsFinish()
	{
		return this.runningTime >= this.duration;
	}

	public Release()
	{
		this.matchView.BattleGroundRemoveChild(this.shape);
	}

}