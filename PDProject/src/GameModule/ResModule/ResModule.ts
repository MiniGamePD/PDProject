class ResModule extends ModuleBase implements IResModule
{

	public Init(): boolean
	{
		this.isForeground = true;
		// this.LoadResource();
		return true;
	}

	public Update(deltaTime: number): void
	{

	}

	public Release(): void
	{

	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
	{
		this.isForeground = true;
	}

	public StartLoadResource(): void
	{
		this.LoadResource();
	}

	public async LoadResource()
	{
		try
		{
			await RES.loadConfig("resource/default.res.json", "resource/");
			await RES.loadGroup("preload", 0, null);
			return true;
		}
		catch (e)
		{
			console.error(e);
			return false;
		}
	}

	public GetRes(key: string): any
	{
		return RES.getRes(key);
	}

	public CreateBitmapByName(key: string): egret.Bitmap
	{
		let result = new egret.Bitmap();
		let texture: egret.Texture = this.GetRes(key);
		result.texture = texture;
		return result;
	}

	public CreateParticleByKey(key: string): particle.GravityParticleSystem
	{
		var textureName = key + "_png";
        var jsonName = key;
        return this.CreateParticle(textureName, jsonName);
	}

	public CreateParticle(textureName: string, jsonName: string): particle.GravityParticleSystem
	{
		var texture = RES.getRes(textureName);
        var config = RES.getRes(jsonName + "_json");
        var particleSys = new particle.GravityParticleSystem(texture, config);
		return particleSys;
	}

}