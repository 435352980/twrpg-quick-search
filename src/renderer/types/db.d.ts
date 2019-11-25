interface Limit {
  /**
   * 英雄ID
   */
  id: string;
  /**
   * 英雄名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 英雄图片
   */
  img: string;
}

interface DropFrom {
  /**
   * 关联掉落bossID
   */
  id: string;
  /**
   * boss名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * boss图片
   */
  img: string;
  /**
   * 掉率或描述
   */
  desc: string;
}

interface CreateFrom {
  /**
   * 关联生成物品ID
   */
  id: string;
  /**
   * 物品名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 物品图片
   */
  img: string;
  /**
   * 生成概率或描述
   */
  desc: string;
}

interface DropFrom {
  /**
   * 关联掉落bossID
   */
  id: string;
  /**
   * boss名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * boss图片
   */
  img: string;
  /**
   * 掉率或描述
   */
  desc: string;
}

interface ExclusiveHeroInfo {
  /**
   * 英雄ID
   */
  id: string;
  /**
   * 英雄名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 英雄图片
   */
  img: string;
  /**
   * 作用于哪个技能
   */
  on: string;
  /**
   * 专属说明
   */
  desc: string;
}

interface ExclusiveGoodInfo {
  /**
   * 物品ID
   */
  id: string;
  /**
   * 物品名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 物品图片
   */
  img: string;
  /**
   * 作用于哪个技能
   */
  on: string;
  /**
   * 专属说明
   */
  desc: string;
}

interface BuildFrom {
  /**
   * 物品ID
   */
  id: string;
  /**
   * 物品名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 物品图片
   */
  img: string;
  /**
   * 获取方式(掉落)
   */
  dropFrom?: DropFrom[];
  /**
   * 获取方式(生成)
   */
  createFrom?: CreateFrom[];
  /**
   * 合成所需数量
   */
  num: number;
  /**
   * 是否可选
   */
  choose?: boolean;

  /**
   * 是否需要在名称栏中显示料率
   */
  chanceOnName?: boolean;
}

interface MakeTo {
  /**
   * 进阶物品ID
   */
  id: string;
  /**
   * 进阶物品名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 图标(用于mapArchive.getImage提取图片)
   */
  icon: any;
  /**
   * 进阶物品图片
   */
  img: string;
}

interface Good {
  /**
   * 物品ID
   */
  id: string;
  /**
   * 物品名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 物品图片
   */
  img: string;
  /**
   * 物品描述
   */
  desc: string;
  /**
   * 物品所属类别集合
   */
  cat: string[];
  /**
   * 物品具体类别值
   * 1.武器2.头盔3.衣服4.饰品5.翅膀6.材料7.结晶8.徽章9.藏品10.任务11.召唤器12.书籍
   */
  goodType?: number;

  /**
   * 类别描述
   */
  goodTypeString?: string;

  /**
   * 品阶
   * 1.普通 2.魔力 3.罕见 4.极其罕见 5.天绝史诗 6.传奇至宝 7.神话传说 8.禁断圣物 9.冥灵传世
   */
  quality?: number;

  /**
   * 品阶描述
   */
  qualityString?: string;

  /**
   * 非必要物品标志
   */
  ignorable?: boolean;

  /**
   * 特效说明
   */
  effect?: string;

  /**
   * 英雄限定
   */
  limit?: Limit[];

  /**
   * 专属
   */
  exclusive?: ExclusiveHeroInfo[];

  /**
   * 获取方式(掉落)
   */
  dropFrom?: DropFrom[];

  /**
   * 获取方式(生成)
   */
  createFrom?: CreateFrom[];

  /**
   * 获取方式(合成)
   */
  buildFrom?: BuildFrom[];

  /**
   * 进阶信息
   */
  makeTo?: MakeTo[];

  /**
   * 阶段
   * 1.野外2.粉末3.小四4.尸骷法骨5.主龙6.白怨火
   */
  stage?: number;

  /**
   * 阶段说明(简)
   */
  stageShortDesc?: string;

  /**
   * 阶段说明
   */
  stageDesc?: string;
  /**
   * 攻击
   */
  atk?: number;
  /**
   * 防御
   */
  def?: number;
  /**
   * 力量
   */
  str?: number;
  /**
   * 敏捷
   */
  agi?: number;
  /**
   * 智力
   */
  int?: number;
  /**
   * 攻速
   */
  atkSpeed?: number;
  /**
   * 血量
   */
  hp?: number;
  /**
   * 蓝量
   */
  mp?: number;
  /**
   * 回血
   */
  hpInc?: number;
  /**
   * 回蓝
   */
  mpInc?: number;
  /**
   * 等级
   */
  level?: number;

  /**
   * 获得经验增加
   */
  expInc?: number;
  /**
   * 魔抗增加
   */
  magicDefInc?: number;
  /**
   * 持续伤害增加
   */
  stillDamageInc?: number;
  /**
   * 主属性增加
   */
  mainAttrInc?: number;
  /**
   * 所受伤害减少
   */
  sufferDamageDec?: number;
  /**
   * 治疗量增加
   */
  sufferCureInc?: number;
  /**
   * 技能伤害增加
   */
  abilityDamageInc?: number;
  /**
   * 冰/水属性伤害增加
   */
  iceDamageInc?: number;
  /**
   * 火属性伤害增加
   */
  fireDamageInc?: number;
  /**
   * 恢复量增加
   */
  hpRegenInc?: number;
  /**
   * 自然属性增加
   */
  natureAttrInc?: number;
  /**
   * 闪避概率增加
   */
  missInc?: number;
  /**
   * 攻击伤害增加
   */
  atkDamageInc?: number;
  /**
   * 致命一击倍率增加
   */
  punchAsChanceInc?: number;
  /**
   * 复活时间减少
   */
  resurrectionTimeDec?: number;
  /**
   * 致命一击概率增加
   */
  punchChanceInc?: number;
  /**
   * 风属性增加
   */
  windAttrInc?: number;
}

interface BossDrop {
  /**
   * 掉落项ID
   */
  id: string;
  /**
   * 掉落项名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 掉落项图片
   */
  img: string;
  /**
   * 掉落概率/说明
   */
  desc: string;
}

interface BossRelationGood {
  /**
   * 关联物品ID
   */
  id: string;
  /**
   * 关联物品名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 关联物品图片
   */
  img: string;
}

interface Unit {
  /**
   * bossId
   */
  id: string;

  /**
   * boss名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;

  /**
   * 图片
   */
  img: string;

  /**
   * 阶段
   */
  stage?: number;

  /**
   * 阶段说明(简)
   */
  stageShortDesc?: string;

  /**
   * 阶段说明
   */
  stageDesc?: string;

  /**
   * 掉落信息
   */
  drop?: BossDrop[];

  /**
   * 关联物品信息
   */
  relation?: BossRelationGood[];
}

interface Skill {
  /**
   * 技能ID
   */
  id: string;
  /**
   * 技能名称
   */
  name: string;
  /**
   * 展示名称
   */
  displayName: string;
  /**
   * 技能图片
   */
  img: string;
  /**
   * 技能说明
   */
  desc: string;

  // /**
  //  * 技能关联召唤物ID
  //  */
  // pets?: string[];

  // /**
  //  * 技能热键
  //  */
  // hotKey: string;
}

/**
 * 皮肤信息
 */
interface SkinInfo {
  /**
   * 皮肤礼盒ID
   */
  id: string;
  /**
   * 皮肤礼盒名称
   */
  name: string;
  /**
   * 皮肤模型名称
   */
  model: string;
}

interface Hero {
  /**
   * 英雄ID
   */
  id: string;
  /**
   * 英雄名称
   */
  name: string;
  /**
   * 英雄别名(面板)
   */
  subName: string;
  /**
   * 英雄主属性
   */
  attr: string;
  /**
   * 英雄图片
   */
  img: string;
  /**
   * 英雄介绍
   */
  desc: string;
  /**
   * 英雄技能
   */
  skills: Skill[];
  /**
   * 专属
   */
  exclusive?: ExclusiveGoodInfo[];
  /**
   * 类别 英雄/召唤物
   */
  type: 'hero' | 'pet';
  skins?: {
    /**
     * 愚人节活动皮肤集合
     */
    april: SkinInfo[];
    /**
     * 夏日活动皮肤集合
     */
    summer: SkinInfo[];
    /**
     * 万圣节活动皮肤集合
     */
    halloween: SkinInfo[];
    /**
     * 新年活动皮肤集合
     */
    newYear: SkinInfo[];
  };
}
