class SyncFramesAnim
{
	private bitmap: egret.Bitmap;
	private textureSeq: egret.Texture[];
	private interval: number;
	private oneRoundTime: number;
	public constructor()
	{
	}

	public Init(bitmap: egret.Bitmap, textSeq: string[], interval: number)
	{
		this.bitmap = bitmap;
		this.textureSeq = [];
		this.interval = interval;
		var resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		if (resModule != null)
		{
			for (var i = 0; i < textSeq.length; ++i)
			{
				var texture =  resModule.GetRes(textSeq[i]);
				if (texture != null)
				{
					this.textureSeq.push(texture);
				}
			}
		}

		this.oneRoundTime = interval * this.textureSeq.length;

		this.Update();
	}

	public Update()
	{
		if (this.bitmap != undefined
			&& this.bitmap != null 
			&& this.oneRoundTime > 0)
		{
			var time = egret.getTimer();
        	var curRoundTime = time % this.oneRoundTime;
			var index = Math.floor(curRoundTime / this.interval);
			if (index < this.textureSeq.length
				&& this.textureSeq[index] != null)
			{
				this.bitmap.texture = this.textureSeq[index];
			}
		}
	}

	public Release()
	{
		this.bitmap = null;
		this.textureSeq = [];
		this.interval = 0;
		this.oneRoundTime = 0;
	}
}