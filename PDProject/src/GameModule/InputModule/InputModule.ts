class InputModule extends ModuleBase implements IInputModule {

	private mLastTouchEvent: string;
	private mTouchBeginX: number;
	private mTouchBeginY: number;

	private mKeyState: boolean[];

	private mMoveEventMinDisX: number;
	private mMoveEventMinDisY: number;

	public Init(): boolean {
		this.isForeground = true;
		let stageWidth = GameMain.GetInstance().GetStageWidth();
		let stageHeight = GameMain.GetInstance().GetStageHeight();
		this.mMoveEventMinDisX = stageWidth * INPUT_MOVE_EVENT_DIS_RATE;
		this.mMoveEventMinDisY = stageHeight * INPUT_MOVE_EVENT_DIS_RATE;
		this.RegisterTouchEvent();
		this.InitKey();
		return true;
	}

	private InitKey(): void {
		this.mKeyState = [];
		for (var i = 0; i < InputKey.Max; ++i) {
			this.mKeyState.push(false);
		}
	}

	private ClearKey(): void {
		for (var i = 0; i < InputKey.Max; ++i) {
			this.mKeyState[i] = false;
		}
	}

	private InputKey(key: InputKey, stageX: number, stageY: number): void {
		if (!this.mKeyState[key]) {
			this.mKeyState[key] = true;
			// egret.log("InputKey " + key + " (" + stageX + "," + stageY + ")");
			//Event
			var event:InputEvent = new InputEvent(key, stageX, stageY);        
            GameMain.GetInstance().DispatchEvent(event);   
		}
	}

	private RegisterTouchEvent(): void {
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchBegin, this)
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchMove, this)
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchTap, this)
	}

	private UnRegisterTouchEvent(): void {
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchBegin, this)
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchMove, this)
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchTap, this)
	}

	private OnTouchBegin(evt: egret.TouchEvent): void {
		if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
			this.mTouchBeginX = evt.stageX;
			this.mTouchBeginY = evt.stageY;
			// egret.log("OnTouchBegin(" + evt.stageX + "," + evt.stageY + ")");
			this.mLastTouchEvent = egret.TouchEvent.TOUCH_BEGIN;			
		}
	}

	private OnTouchMove(evt: egret.TouchEvent): void {
		if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
			// egret.log("OnTouchMove(" + evt.stageX + "," + evt.stageY + ")");
			var hasInput = false;
			var deltaX = evt.stageX - this.mTouchBeginX;
			var deltaY = evt.stageY - this.mTouchBeginY;

			if (deltaX >= this.mMoveEventMinDisX){
				this.InputKey(InputKey.Right, evt.stageX, evt.stageY);
				hasInput = true;
			}

			if (deltaX <= -this.mMoveEventMinDisX){
				this.InputKey(InputKey.Left, evt.stageX, evt.stageY);
				hasInput = true;
			}

			if (deltaY >= this.mMoveEventMinDisY){
				this.InputKey(InputKey.Down, evt.stageX, evt.stageY);
				hasInput = true;
			}

			if (deltaY <= -this.mMoveEventMinDisY){
				this.InputKey(InputKey.Up, evt.stageX, evt.stageY);
				hasInput = true;
			}

			if (hasInput){
				this.mTouchBeginX = evt.stageX;
				this.mTouchBeginY = evt.stageY;
			}
			this.mLastTouchEvent = egret.TouchEvent.TOUCH_MOVE;			
		}
	}

	private OnTouchTap(evt: egret.TouchEvent): void {
		if (evt.type == egret.TouchEvent.TOUCH_TAP) {
			// egret.log("OnTouchTap(" + evt.stageX + "," + evt.stageY + ")");
			if (this.mLastTouchEvent == egret.TouchEvent.TOUCH_BEGIN){
				this.InputKey(InputKey.Rotate, evt.stageX, evt.stageY);
			}
			this.mLastTouchEvent = egret.TouchEvent.TOUCH_TAP;
		}
	}

	public Update(deltaTime: number): void {
		this.ClearKey();
	}

	public Release(): void {
		this.UnRegisterTouchEvent();
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void {
		this.isForeground = true;
	}

	public GetKey(key: InputKey): boolean {
		return this.mKeyState[key];
	}

	public LocalFunc(){
		// 本地修改
	}
}