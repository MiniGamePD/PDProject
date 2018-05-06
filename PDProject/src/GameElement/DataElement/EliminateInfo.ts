class EliminateInfo {
	public constructor() {
		this.HasInfo = false;
		this.EliminatedElements = [];
		this.MoveElements = [];
		this.SpecialEliminatedElement = [];
	}

	// 是否有消除数据
	public HasInfo: boolean;

	// 消除元素列表
	public EliminatedElements: SceneElementBase[];

	// 特殊消除的元素
	public SpecialEliminatedElement: SceneElementBase[];

	// 消除后，需要移动的元素列表
	public MoveElements: EliminateMoveInfo[];

	// 重置
	public Reset() {
		this.HasInfo = false;
		this.EliminatedElements = [];
		this.MoveElements = [];
		this.SpecialEliminatedElement = [];
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