//一些时间
const Time_AddNpcToSceneIntervalMax = 200; //ms
const Time_AddNpcToSceneIntervalMin = 70; //ms
const Time_AddNpcToSceneIntervalStep = 10; //ms
const Time_PlayEnemySinisterSmileTime = 500; //ms
const Time_FeverTime = 45000; //ms

//Boss技能
const skillBossMaxNum = 8;

//一些回合数
const TurnNum_BossSkillTurnNum = 3;
const TurnNum_CreateEnemyTurnNum = 8;
const TurnNum_CreateSkillBossTurnNum = 5;
const TurnNum_BossSkillTargetNum = 5;

//分辨率参数
const Screen_StanderScreenWidth = 640;
const Screen_StanderScreenHeight = 1136;

//消除相关
const EliminateRoundStartIndex = 1;
const Eliminate_NextCentainEliminateToolTurn = 10;

//分数相关
const Score_FeverTimeScale = 2; // FeverTime期间的分数倍率
const Score_EliminateRoundScale = [1, 2, 3, 4, 5]; // 连消的分数倍率
const Score_BaseScore = 20;