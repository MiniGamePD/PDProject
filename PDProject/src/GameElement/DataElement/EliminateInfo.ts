class EliminateInfo {
	public constructor() {
		this.HasInfo = false;
		this.EliminateRound = 1;
		this.EliminatedElements = [];
		this.MoveElements = [];
		this.SpecialEliminatedElement = [];
		this.EliminatedPlaceHolderElement = [];
		this.EliminatedSuperVirus = [];
	}

	// 是否有消除数据
	public HasInfo: boolean;

	// 连续消除次数（从1开始）	
	public EliminateRound: number;

	// 消除元素列表
	public EliminatedElements: SceneElementBase[];

	// 特殊消除的元素
	public SpecialEliminatedElement: SceneElementBase[];

	// 触发了消除的PlaceHolder
	public EliminatedPlaceHolderElement: SceneElementBase[];

	// 消除后，需要移动的元素列表
	public MoveElements: EliminateMoveInfo[];

	// 有被消除的Boss
	public EliminatedSuperVirus: SuperVirus[];

	// 重置
	public Reset() {
		this.HasInfo = false;
		this.EliminateRound = 1;
		this.EliminatedElements = [];
		this.MoveElements = [];
		this.SpecialEliminatedElement = [];
		this.EliminatedPlaceHolderElement = [];
		this.EliminatedSuperVirus = [];
	}
}

// 消除后，需要移动的元素信息
class EliminateMoveInfo {
	public MoveElement: SceneElementBase;
	public StartPosX: number;
	public StartPosY: number;
	public EndPosX: number;
	public EndPosY: number;

	public constructor(element: SceneElementBase, startPosX: number, startPosY: number, endPosX: number, endPosY: number) {
		this.MoveElement = element;
		this.StartPosX = startPosX;
		this.StartPosY = startPosY;
		this.EndPosX = endPosX;
		this.EndPosY = endPosY
	}
}

// 消除方案
enum EliminateMethodType
{
	Normal = 0, //普通的三消方案
	SpecificColor, //特定颜色
	SpecificRegion, //特定区域
	SpecificRegionAndColor, //特定区域的特定颜色
}

// 要消除的元素类型
enum EliminateElementType
{
	Normal,	  		//普通的三消方案	
	PillOnly,		//只是药丸
	VirusOnly,		//只是病毒
	PillAndVirus,	//药丸和病毒
}

class EliminateMethod
{
	public methodType: EliminateMethodType; //消除方案

	public eliminateElementType: EliminateElementType; //要消除的元素类型

	public specificColor: GameElementColor; //特定颜色

	public specificRegion: number[]; //特定区域列表

	public Reset()
	{
		this.methodType = EliminateMethodType.Normal;
		this.eliminateElementType = EliminateElementType.Normal;
	}
}