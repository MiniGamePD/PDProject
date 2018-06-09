class MatchViewDynamicBg
{
	private resModule: IResModule;
	private matchView: MatchView;
	private meteorList: egret.Bitmap[] = [];
	private meteorInterval: number;
	public constructor()
	{
	}

	public Init(resModule: IResModule, matchView: MatchView, )
	{
		this.resModule = resModule;
		this.matchView = matchView;

		this.CreateMeteor();
		this.PlayMeteorMove();
	}

	private CreateMeteor()
	{
		this.meteorList = [];
		for (var i = 0; i < 5; ++i)
		{
			var bitmap = this.resModule.CreateBitmapByName("liuxing");
			if (bitmap != null)
			{
				bitmap.anchorOffsetX = bitmap.width;
				this.matchView.addChildAt(bitmap, Tools.GetBackGroundDynamicLayer());
				this.meteorList.push(bitmap);
			}
		}
	}

	private PlayMeteorMove()
	{
		this.meteorInterval = 6000;
		for (var i = 0; i < this.meteorList.length; ++i)
		{
			var randPosY = (Math.random() - 0.5) * 300;
			var startPos = new egret.Point(GameMain.GetInstance().GetStageWidth() + 200, randPosY);
			this.meteorList[i].x = startPos.x;
			this.meteorList[i].y = startPos.y;
			var endPos = new egret.Point(-200,  randPosY + 500);
			var delayTime = Math.random() * 5000;

			var param = new PaAccMovingParam();
			param.displayObj = this.meteorList[i];
			param.startSpeed = 500;
			param.accelerate = 500;
			param.targetPos = endPos;
			param.needRotate = true;
			param.delayTime = 0;
			param.delayTime = delayTime;
			var event = new PlayProgramAnimationEvent();
			event.param = param;
			GameMain.GetInstance().DispatchEvent(event);
		}
	}

	public Update(deltaTime: number)
	{
		this.meteorInterval -= deltaTime;
		if (this.meteorInterval <= 0)
		{
			this.PlayMeteorMove();
		}
	}

	public Release()
	{

	}
}