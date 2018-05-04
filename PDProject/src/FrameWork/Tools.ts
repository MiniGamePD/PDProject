class Tools
{
	public static MoveScenePosX(posX: number, dir: Direction, step: number): number
	{
		var targetPosX = posX;
		switch (dir)
		{
			case Direction.Left:
				targetPosX -= step;
				break;
			case Direction.Right:
				targetPosX += step;
				break;
			default:
				break;
		}
		return targetPosX;
	}

	public static MoveScenePosY(posY: number, dir: Direction, step: number): number
	{
		var targetPosY = posY;
		switch (dir)
		{
			case Direction.Up:
				targetPosY -= step;
				break;
			case Direction.Down:
				targetPosY += step;
				break;
			default:
				break;
		}
		return targetPosY;
	}

	public static ZeroValue = 0.00001;
	public static IsZero(value: number)
	{
		return Math.abs(value) < Tools.ZeroValue;
	}

	public static MoveNumber(from: number, to: number, moveValue: number): number
	{
		if (Tools.IsZero(from - to))
		{
			return to;
		}
		else
		{
			var value = from;
			if (from < to)
			{
				value += moveValue;
			}
			else
			{
				value -= moveValue;
			}
			value = Tools.Clamp(value, from, to);
			return value
		}
	}

	public static Clamp(value: number, p1: number, p2: number): number
	{
		var result = value;
		if (p1 < p2)
		{
			result = value < p1 ? p1 : value;
			result = value > p2 ? p2 : value;
		}
		else if (p1 > p2)
		{
			result = value > p1 ? p1 : value;
			result = value < p2 ? p2 : value;
		}
		return result;
	}

	// 顺时针旋转
	public static RotateCW(center: number[], pos: number[]): number[]
	{
		if (center.length != 2 && pos.length != 2)
		{
			if (DEBUG)
			{
				console.assert(false, "Can not move element while elements not in scene!");
			}
		}
		var target: number[] = [];
		target.push(center[0] - (pos[1] - center[1]));
		target.push(center[1] + (pos[0] - center[0]));

		return target;
	}

	// 逆时针旋转
	public static RotateACW(center: number[], pos: number[]): number[]
	{
		if (center.length != 2 && pos.length != 2)
		{
			if (DEBUG)
			{
				console.assert(false, "Can not move element while elements not in scene!");
			}
		}
		var target: number[] = [];
		target.push(center[0] + (pos[1] - center[1]));
		target.push(center[1] - (pos[0] - center[0]));

		return target;
	}
}