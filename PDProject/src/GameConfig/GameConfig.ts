//一些时间
const Time_AddNpcToSceneIntervalMax = 200; //ms
const Time_AddNpcToSceneIntervalMin = 70; //ms
const Time_AddNpcToSceneIntervalStep = 10; //ms
const Time_PlayEnemySinisterSmileTime = 500; //ms
const Time_FeverTime = 45000; //ms

//Boss技能
const skillBossMaxNum = 8;

//分辨率参数
const Screen_StanderScreenWidth = 640;
const Screen_StanderScreenHeight = 1136;

//消除相关
const EliminateRoundInMoveUp = 0; // 生成小怪时，上移的消除事件。Round的值
const EliminateRoundStartIndex = 1;
const Eliminate_NextCentainEliminateToolTurn = 10;
const Eliminate_Delay_One_Step = 70; // 每距离一个格子的消除延迟
const Eliminate_Delay_One_Step_CrossEliminater = 55; //  每距离一个格子的消除延迟(特殊消除)
const Eliminate_Delay_One_Step_Boom = 70; //  每距离一个格子的消除延迟(炸弹)

//分数相关
const Score_FeverTimeScale = 2; // FeverTime期间的分数倍率
const Score_EliminateRoundScale = [1, 2, 3, 4, 5]; // 连消的分数倍率
const Score_BaseScore = 20;

//游戏流程相关
const Procedure_ReviveEliminateLine = 5;
const Procedure_InitCreateEnemyLine = 6;
const TurnNum_BossSkillTurnNum = 3;
const TurnNum_CreateEnemyTurnNum = 15;
const TurnNum_CreateSkillBossTurnNum = 5;
const TurnNum_BossSkillTargetNum = 5;

// 动画相关
const Frame_Anim_SceneBoom = ["Boom1", "Boom2"];
const Frame_Anim_SceneBoom_Effect = ["BoomEffect1", "BoomEffect2", "BoomEffect3", "BoomEffect4", "BoomEffect5", 
                                    "BoomEffect6", "BoomEffect7", "BoomEffect8", "BoomEffect9", "BoomEffect10"];

const Frame_Anim_CrossEliminater = ["Cross_huojian1", "Cross_huojian2"];
const Frame_Anim_CrossEliminater_Diretion = ["Cross_zhixiang1", "Cross_zhixiang2", "Cross_zhixiang3"];
const Frame_Anim_CrossEliminater_fashe = ["Cross_fashe1", "Cross_fashe2", "Cross_fashe3", "Cross_fashe4",
                                         "Cross_fashe5", "Cross_fashe6", "Cross_fashe7", "Cross_fashe8", "Cross_fashe9"];
const Frame_Anim_CrossEliminater_tuowei = ["tuowei1", "tuowei2", "tuowei3", "tuowei4", "tuowei5", "tuowei6",
                                             "tuowei7", "tuowei8", "tuowei9", "tuowei10", "tuowei11", "tuowei12"];
const Frame_Anim_Virus_Red_Idle = ["Virus_Red_Idle1", "Virus_Red_Idle1", "Virus_Red_Idle1", "Virus_Red_Idle4", "Virus_Red_Idle5", "Virus_Red_Idle6",
                                             "Virus_Red_Idle6", "Virus_Red_Idle6", "Virus_Red_Idle9", "Virus_Red_Idle10"];
const Frame_Anim_Virus_Blue_Idle = ["Virus_Blue_Idle1", "Virus_Blue_Idle1", "Virus_Blue_Idle1", "Virus_Blue_Idle4", "Virus_Blue_Idle5", "Virus_Blue_Idle6",
                                             "Virus_Blue_Idle6", "Virus_Blue_Idle6", "Virus_Blue_Idle9", "Virus_Blue_Idle10"];
const Frame_Anim_Virus_Yellow_Idle = ["Virus_Yellow_Idle1", "Virus_Yellow_Idle1", "Virus_Yellow_Idle1", "Virus_Yellow_Idle4", "Virus_Yellow_Idle5", "Virus_Yellow_Idle6",
                                             "Virus_Yellow_Idle6", "Virus_Yellow_Idle6", "Virus_Yellow_Idle9", "Virus_Yellow_Idle10"];

const Frame_Anim_Pill_Land_Effect = ["LuoDi_00000", "LuoDi_00001", "LuoDi_00002", "LuoDi_00003", 
                                "LuoDi_00004", "LuoDi_00005", "LuoDi_00006", "LuoDi_00007", "LuoDi_00008", "LuoDi_00009", "LuoDi_00010"];
                                             