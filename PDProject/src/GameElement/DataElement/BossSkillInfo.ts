class BossSkillInfo 
{
	public constructor() 
	{
		this.skillCaster = null;
		this.addHealthElement = [];
		this.elementTransList = [];
		this.elementChangeColorList = [];
	}

	// 释放技能的Boss
	public skillCaster: NpcElement;

	// 增加血量的元素
	public addHealthElement: SceneElementBase[];

	// 元素转换列表
	public elementTransList: ElementTransInfo[];

	// 元素换色列表
	public elementChangeColorList: ElementChangeColorInfo[];

	// 重置
	public Reset()
	{
		this.superVirus = null;
		this.addHealthElement = [];
		this.elementTransList = [];
		this.elementChangeColorList = [];
	}
}

// 元素转换信息
class ElementTransInfo
{
	public fromElement: SceneElementBase;
	public toElement: SceneElementBase;
}

// 元素换色信息
class ElementChangeColorInfo
{
	public element: SceneElementBase;
	public targetColor: GameElementColor;
}