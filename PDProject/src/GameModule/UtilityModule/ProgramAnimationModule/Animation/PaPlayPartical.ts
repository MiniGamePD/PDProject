class PaPlayParticalParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.PlayPartical;

	public textureName: string; // 粒子贴图名字
	public jsonName: string;	// 粒子Json配置名字
	public duration: number; 	// 总时长
	public posX: number; 		// GameStage下的坐标X
	public posY: number; 		// GameStage下的坐标Y
}

class PaPlayPartical extends ProgramAnimationBase<PaPlayParticalParam>
{
	private particleSys: particle.GravityParticleSystem;
	protected OnInit()
	{
		var resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		if (resModule != null)
		{
			this.particleSys = resModule.CreateParticle(this.param.textureName, this.param.jsonName);
			this.particleSys.x = this.param.posX;
			this.particleSys.y = this.param.posY;
			GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.particleSys);
			this.particleSys.start();
		}
	}

	protected OnUpdate(deltaTime: number)
	{

	}

	protected OnRelease()
	{
		this.particleSys.stop();
		GameMain.GetInstance().GetAdaptedStageContainer().removeChild(this.particleSys);
		this.particleSys = null;
	}

	public IsFinish()
	{
		return this.runningTime >= this.param.duration;
	}

}