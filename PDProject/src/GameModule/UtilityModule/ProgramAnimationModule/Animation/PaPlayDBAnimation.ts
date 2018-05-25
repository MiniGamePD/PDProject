class PaPlayDBAnimationParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.PlayPartical;

	public resName: string; // 粒子贴图名字
	public animationName: string; //动画名字
	public duration: number; 	// 总时长
	public posX: number; 		// 坐标X
	public posY: number; 		// 坐标Y
}

class PaPlayDBAnimation extends ProgramAnimationBase<PaPlayDBAnimationParam>
{
	private armatureDisplay: dragonBones.EgretArmatureDisplay;
	protected OnInit()
	{
		var resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		if (resModule != null)
		{
			var dragonbonesData = RES.getRes(this.param.resName + "_ske_json");
			var textureData = RES.getRes(this.param.resName + "_tex_json");
			var texture = RES.getRes(this.param.resName + "_tex_png");
			if (dragonbonesData != null
				&& textureData != null
				&& texture != null)
			{
				let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
				egretFactory.parseDragonBonesData(dragonbonesData);
				egretFactory.parseTextureAtlasData(textureData, texture);
				this.armatureDisplay = egretFactory.buildArmatureDisplay(this.param.animationName);
				GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.armatureDisplay);
				this.armatureDisplay.x = this.param.posX;
				this.armatureDisplay.y = this.param.posY;
				this.armatureDisplay.animation.play(this.param.animationName);
			}
		}
	}

	protected OnUpdate(deltaTime: number)
	{

	}

	protected OnRelease()
	{
		GameMain.GetInstance().GetAdaptedStageContainer().removeChild(this.armatureDisplay);
		this.armatureDisplay = null;
	}

	public IsFinish()
	{
		return this.runningTime >= this.param.duration;
	}

}