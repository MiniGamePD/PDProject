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

	public StartLoadResource(finishCallBack: Function): void
	{
		this.LoadResource(finishCallBack);
	}

	public async LoadResource(finishCallBack: Function)
	{
		try
		{
			await RES.loadConfig("resource/default.res.json", "resource/");
			await RES.loadGroup("preload", 0, null);
			await this.InitDragonBonesData();
			if (finishCallBack != null
				&& finishCallBack != undefined)
			{
				finishCallBack();
			}
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
	
	public InitDragonBonesData()
	{
		var dragonbonesData = RES.getRes("DB_Boom_Bomb_ske_json");
		var textureData = RES.getRes("DB_Boom_Bomb_tex_json");
		var texture = RES.getRes("DB_Boom_Bomb_tex_png");
		if (dragonbonesData != null
			&& textureData != null
			&& texture != null)
		{
			let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
			egretFactory.parseDragonBonesData(dragonbonesData);
			egretFactory.parseTextureAtlasData(textureData, texture);
		}
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
		if (texture != null	&& config != null)
		{
			var particleSys = new particle.GravityParticleSystem(texture, config);
			if (particleSys != null)
			{
				particleSys.emitterX = 0;
				particleSys.emitterY = 0;
			}
			return particleSys;
		}
		else if (DEBUG)
		{
			console.assert(false, "Can not add elements to scene after query rotate!");
		}
		return null;
	}

}