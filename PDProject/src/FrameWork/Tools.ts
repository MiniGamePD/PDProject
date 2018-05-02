class Tools {
	public static MoveScenePosX(posX: number, dir: Direction, step: number): number{
		var targetPosX = posX;
		switch (dir){
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

	public static MoveScenePosY(posY: number, dir: Direction, step: number): number{
		var targetPosY = posY;
		switch (dir){
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
}