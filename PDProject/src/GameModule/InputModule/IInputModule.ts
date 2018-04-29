interface IInputModule extends IModule {
	GetKey(key: InputKey): boolean;
}

enum InputKey{
	Left = 0,
	Right = 1,
	Up = 2,
	Down = 3,
	Rotate = 4,
	Max = 5,
}

const INPUT_MOVE_EVENT_DIS_RATE: number = 0.1;