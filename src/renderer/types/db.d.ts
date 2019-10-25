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

  /**
   * GetUnitTypeDefaultActiveAbility
   */
  udaa?: string | number;

  /**
   * GetUnitTypeHeroAbilities
   */
  uhab?: string | number;

  /**
   * GetUnitTypeAbilities
   */
  uabi?: string | number;

  /**
   * GetUnitTypeAllowCustomTeamColor
   */
  utcc?: string | number;

  /**
   * GetUnitTypeBlendTime
   */
  uble?: string | number;

  /**
   * GetUnitTypeCastBackswing
   */
  ucbs?: string | number;

  /**
   * GetUnitTypeCastPoint
   */
  ucpt?: string | number;

  /**
   * GetUnitTypeRunSpeed
   */
  urun?: string | number;

  /**
   * GetUnitTypeWalkSpeed
   */
  uwal?: string | number;

  /**
   * GetUnitTypeButtonPositionX
   */
  ubpx?: string | number;

  /**
   * GetUnitTypeButtonPositionY
   */
  ubpy?: string | number;

  /**
   * GetUnitTypeDeathTime
   */
  udtm?: string | number;

  /**
   * GetUnitTypeElevationSamplePoints
   */
  uept?: string | number;

  /**
   * GetUnitTypeElevationSampleRadius
   */
  uerd?: string | number;

  /**
   * GetUnitTypeFogOfWarSampleRadius
   */
  ufrd?: string | number;

  /**
   * GetUnitTypeGroundTexture
   */
  uubs?: string | number;

  /**
   * GetUnitTypeHasWaterShadow
   */
  ushr?: string | number;

  /**
   * GetUnitTypeIcon
   */
  uico?: string | number;

  /**
   * GetUnitTypeScoreScreenIcon
   */
  ussi?: string | number;

  /**
   * GetUnitTypeMaxPitch
   */
  umxp?: string | number;

  /**
   * GetUnitTypeMaxRoll
   */
  umxr?: string | number;

  /**
   * GetUnitTypeModel
   */
  umdl?: string | number;

  /**
   * GetUnitTypeModelExtraVersions
   */
  uver?: string | number;

  /**
   * GetUnitTypeOcculderHeight
   */
  uocc?: string | number;

  /**
   * GetUnitTypeOrientationInterpolation
   */
  uori?: string | number;

  /**
   * GetUnitTypeSwimProjectileImpactZ
   */
  uisz?: string | number;

  /**
   * GetUnitTypeProjectileImpactZ
   */
  uimz?: string | number;

  /**
   * GetUnitTypeProjectileLaunchX
   */
  ulpx?: string | number;

  /**
   * GetUnitTypeSwimProjectileLaunchZ
   */
  ulsz?: string | number;

  /**
   * GetUnitTypeProjectileLaunchZ
   */
  ulpz?: string | number;

  /**
   * GetUnitTypePropulsionWindow
   */
  uprw?: string | number;

  /**
   * GetUnitTypeRequiredAnimationNames
   */
  uani?: string | number;

  /**
   * GetUnitTypeRequiredAnimationAttachments
   */
  uaap?: string | number;

  /**
   * GetUnitTypeRequiredAnimationLinkNames
   */
  ualp?: string | number;

  /**
   * GetUnitTypeRequiredBoneNames
   */
  ubpr?: string | number;

  /**
   * GetUnitTypeScaleProjectiles
   */
  uscb?: string | number;

  /**
   * GetUnitTypeScale
   */
  usca?: string | number;

  /**
   * GetUnitTypeSelectionZ
   */
  uslz?: string | number;

  /**
   * GetUnitTypeSelectionOnWater
   */
  usew?: string | number;

  /**
   * GetUnitTypeSelectionScale
   */
  ussc?: string | number;

  /**
   * GetUnitTypeShadowImage
   */
  ushu?: string | number;

  /**
   * GetUnitTypeShadowImageCenterX
   */
  ushx?: string | number;

  /**
   * GetUnitTypeShadowImageCenterY
   */
  ushy?: string | number;

  /**
   * GetUnitTypeShadowImageHeight
   */
  ushh?: string | number;

  /**
   * GetUnitTypeShadowImageWidth
   */
  ushw?: string | number;

  /**
   * GetUnitTypeShadowTexture
   */
  ushb?: string | number;

  /**
   * GetUnitTypeSpecialArt
   */
  uspa?: string | number;

  /**
   * GetUnitTypeTargetArt
   */
  utaa?: string | number;

  /**
   * GetUnitTypeTeamColor
   */
  utco?: string | number;

  /**
   * GetUnitTypeRedTint
   */
  uclr?: string | number;

  /**
   * GetUnitTypeGreenTint
   */
  uclg?: string | number;

  /**
   * GetUnitTypeBlueTint
   */
  uclb?: string | number;

  /**
   * GetUnitTypeUseExtendedLineOfSight
   */
  ulos?: string | number;

  /**
   * GetUnitTypeAcquisitionRange
   */
  uacq?: string | number;

  /**
   * GetUnitTypeArmorType
   */
  uarm?: string | number;

  /**
   * GetUnitTypeBackswingPoint1
   */
  ubs1?: string | number;

  /**
   * GetUnitTypeDamagePoint1
   */
  udp1?: string | number;

  /**
   * GetUnitTypeAreaOfEffectFull1
   */
  ua1f?: string | number;

  /**
   * GetUnitTypeAreaOfEffectMedium1
   */
  ua1h?: string | number;

  /**
   * GetUnitTypeAreaOfEffectSmall1
   */
  ua1q?: string | number;

  /**
   * GetUnitTypeAreaOfEffectTargets1
   */
  ua1p?: string | number;

  /**
   * GetUnitTypeAttackType1
   */
  ua1t?: string | number;

  /**
   * GetUnitTypeCooldown1
   */
  ua1c?: string | number;

  /**
   * GetUnitTypeDamageBase1
   */
  ua1b?: string | number;

  /**
   * GetUnitTypeDamageFactorMedium1
   */
  uhd1?: string | number;

  /**
   * GetUnitTypeDamageFactorSmall1
   */
  uqd1?: string | number;

  /**
   * GetUnitTypeDamageLossFactor1
   */
  udl1?: string | number;

  /**
   * GetUnitTypeDamageNumberOfDice1
   */
  ua1d?: string | number;

  /**
   * GetUnitTypeDamageSidesPerDie1
   */
  ua1s?: string | number;

  /**
   * GetUnitTypeDamageSpillDistance1
   */
  usd1?: string | number;

  /**
   * GetUnitTypeDamageSpillRadius1
   */
  usr1?: string | number;

  /**
   * GetUnitTypeDamageUpgradeAmount1
   */
  udu1?: string | number;

  /**
   * GetUnitTypeMaximumTargets1
   */
  utc1?: string | number;

  /**
   * GetUnitTypeProjectileArc1
   */
  uma1?: string | number;

  /**
   * GetUnitTypeProjectileArt1
   */
  ua1m?: string | number;

  /**
   * GetUnitTypeProjectileHoming1
   */
  umh1?: string | number;

  /**
   * GetUnitTypeProjectileSpeed1
   */
  ua1z?: string | number;

  /**
   * GetUnitTypeRange1
   */
  ua1r?: string | number;

  /**
   * GetUnitTypeRangeMotionBuffer1
   */
  urb1?: string | number;

  /**
   * GetUnitTypeShowUI1
   */
  uwu1?: string | number;

  /**
   * GetUnitTypeTargetsAllowed1
   */
  ua1g?: string | number;

  /**
   * GetUnitTypeWeaponSound1
   */
  ucs1?: string | number;

  /**
   * GetUnitTypeWeaponType1
   */
  ua1w?: string | number;

  /**
   * GetUnitTypeBackswingPoint2
   */
  ubs2?: string | number;

  /**
   * GetUnitTypeDamagePoint2
   */
  udp2?: string | number;

  /**
   * GetUnitTypeAreaOfEffectFull2
   */
  ua2f?: string | number;

  /**
   * GetUnitTypeAreaOfEffectMedium2
   */
  ua2h?: string | number;

  /**
   * GetUnitTypeAreaOfEffectSmall2
   */
  ua2q?: string | number;

  /**
   * GetUnitTypeAreaOfEffectTargets2
   */
  ua2p?: string | number;

  /**
   * GetUnitTypeAttackType2
   */

  ua2t?: string | number;

  /**
   * GetUnitTypeCooldown2
   */
  ua2c?: string | number;

  /**
   * GetUnitTypeDamageBase2
   */
  ua2b?: string | number;

  /**
   * GetUnitTypeDamageFactorMedium2
   */
  uhd2?: string | number;

  /**
   * GetUnitTypeDamageFactorSmall2
   */
  uqd2?: string | number;

  /**
   * GetUnitTypeDamageLossFactor2
   */
  udl2?: string | number;

  /**
   * GetUnitTypeDamageNumberOfDice2
   */
  ua2d?: string | number;

  /**
   * GetUnitTypeDamageSidesPerDie2
   */
  ua2s?: string | number;

  /**
   * GetUnitTypeDamageSpillDistance2
   */
  usd2?: string | number;

  /**
   * GetUnitTypeDamageSpillRadius2
   */
  usr2?: string | number;

  /**
   * GetUnitTypeDamageUpgradeAmount2
   */
  udu2?: string | number;

  /**
   * GetUnitTypeMaximumTargets2
   */
  utc2?: string | number;

  /**
   * GetUnitTypeProjectileArc2
   */
  uma2?: string | number;

  /**
   * GetUnitTypeProjectileArt2
   */
  ua2m?: string | number;

  /**
   * GetUnitTypeProjectileHoming2
   */
  umh2?: string | number;

  /**
   * GetUnitTypeProjectileSpeed2
   */
  ua2z?: string | number;

  /**
   * GetUnitTypeRange2
   */
  ua2r?: string | number;

  /**
   * GetUnitTypeRangeMotionBuffer2
   */
  urb2?: string | number;

  /**
   * GetUnitTypeShowUI2
   */
  uwu2?: string | number;

  /**
   * GetUnitTypeTargetsAllowed2
   */
  ua2g?: string | number;

  /**
   * GetUnitTypeWeaponSound2
   */
  ucs2?: string | number;

  /**
   * GetUnitTypeWeaponType2
   */
  ua2w?: string | number;

  /**
   * GetUnitTypeAttacksEnabled
   */
  uaen?: string | number;

  /**
   * GetUnitTypeDeathType
   */
  udea?: string | number;

  /**
   * GetUnitTypeDefenseBase
   */
  udef?: string | number;

  /**
   * GetUnitTypeDefenseType
   */
  udty?: string | number;

  /**
   * GetUnitTypeDefenseUpgradeBonus
   */
  udup?: string | number;

  /**
   * GetUnitTypeMinimumAttackRange
   */
  uamn?: string | number;

  /**
   * GetUnitTypeTargetedAs
   */
  utar?: string | number;

  /**
   * GetUnitTypeDropItemsOnDeath
   */
  udro?: string | number;

  /**
   * GetUnitTypeCategoryCampaign
   */
  ucam?: string | number;

  /**
   * GetUnitTypeCategorySpecial
   */
  uspe?: string | number;

  /**
   * GetUnitTypeDisplayAsNeutralHostile
   */
  uhos?: string | number;

  /**
   * GetUnitTypeHasTilesetSpecificData
   */
  utss?: string | number;

  /**
   * GetUnitTypePlaceableInEditor
   */
  uine?: string | number;

  /**
   * GetUnitTypeTilesets
   */
  util?: string | number;

  /**
   * GetUnitTypeUseClickHelper
   */
  uuch?: string | number;

  /**
   * GetUnitTypeGroupSeparationEnabled
   */
  urpo?: string | number;

  /**
   * GetUnitTypeGroupSeparationGroupNumber
   */
  urpg?: string | number;

  /**
   * GetUnitTypeGroupSeparationParameter
   */
  urpp?: string | number;

  /**
   * GetUnitTypeGroupSeparationPriority
   */
  urpr?: string | number;

  /**
   * GetUnitTypeFlyHeight
   */
  umvh?: string | number;

  /**
   * GetUnitTypeMinimumHeight
   */
  umvf?: string | number;

  /**
   * GetUnitTypeSpeedBase
   */
  umvs?: string | number;

  /**
   * GetUnitTypeSpeedMaximum
   */
  umas?: string | number;

  /**
   * GetUnitTypeSpeedMinimum
   */
  umis?: string | number;

  /**
   * GetUnitTypeTurnRate
   */
  umvr?: string | number;

  /**
   * GetUnitTypeMoveType
   */
  umvt?: string | number;

  /**
   * GetUnitTypeAIPlacementRadius
   */
  uabr?: string | number;

  /**
   * GetUnitTypeAIPlacementType
   */
  uabt?: string | number;

  /**
   * GetUnitTypeCollisionSize
   */
  ucol?: string | number;

  /**
   * GetUnitTypePathingMap
   */
  upat?: string | number;

  /**
   * GetUnitTypePlacementPreventedBy
   */
  upar?: string | number;

  /**
   * GetUnitTypePlacementRequires
   */
  upap?: string | number;

  /**
   * GetUnitTypePlacementRequiresWaterRadius
   */
  upaw?: string | number;

  /**
   * GetUnitTypeBuildSound
   */
  ubsl?: string | number;

  /**
   * GetUnitTypeSoundLoopFadeInRate
   */
  ulfi?: string | number;

  /**
   * GetUnitTypeSoundLoopFadeOutRate
   */
  ulfo?: string | number;

  /**
   * GetUnitTypeMoveSound
   */
  umsl?: string | number;

  /**
   * GetUnitTypeRandomSound
   */
  ursl?: string | number;

  /**
   * GetUnitTypeSoundSet
   */
  usnd?: string | number;

  /**
   * GetUnitTypeAgilityPerLevel
   */
  uagp?: string | number;

  /**
   * GetUnitTypeBuildTime
   */
  ubld?: string | number;

  /**
   * GetUnitTypeCanBeBuiltOn
   */
  uibo?: string | number;

  /**
   * GetUnitTypeCanBuildOn
   */
  ucbo?: string | number;

  /**
   * GetUnitTypeCanFlee
   */
  ufle?: string | number;

  /**
   * GetUnitTypeFoodCost
   */
  ufoo?: string | number;

  /**
   * GetUnitTypeFoodProduced
   */
  ufma?: string | number;

  /**
   * GetUnitTypeFormationRank
   */
  ufor?: string | number;

  /**
   * GetUnitTypeGoldBountyBase
   */
  ubba?: string | number;

  /**
   * GetUnitTypeGoldBountyNumberOfDice
   */
  ubdi?: string | number;

  /**
   * GetUnitTypeGoldBountySidesPerDie
   */
  ubsi?: string | number;

  /**
   * GetUnitTypeGoldCost
   */
  ugol?: string | number;

  /**
   * GetUnitTypeHideHeroDeathMessage
   */
  uhhd?: string | number;

  /**
   * GetUnitTypeHideHeroInterfaceIcon
   */
  uhhb?: string | number;

  /**
   * GetUnitTypeHideHeroMinimapDisplay
   */
  uhhm?: string | number;

  /**
   * GetUnitTypeHideMinimapDisplay
   */
  uhom?: string | number;

  /**
   * GetUnitTypeHitPointsMaximum
   */
  uhpm?: string | number;

  /**
   * GetUnitTypeHitPointsRegeneration
   */
  uhpr?: string | number;

  /**
   * GetUnitTypeHitPointsRegenerationType
   */
  uhrt?: string | number;

  /**
   * GetUnitTypeIntelligencePerLevel
   */
  uinp?: string | number;

  /**
   * GetUnitTypeIsABuilding
   */
  ubdg?: string | number;

  /**
   * GetUnitTypeLevel
   */
  ulev?: string | number;

  /**
   * GetUnitTypeLumberBountyBase
   */
  ulba?: string | number;

  /**
   * GetUnitTypeLumberBountyNumberOfDice
   */
  ulbd?: string | number;

  /**
   * GetUnitTypeLumberBountySidesPerDie
   */
  ulbs?: string | number;

  /**
   * GetUnitTypeLumberCost
   */
  ulum?: string | number;

  /**
   * GetUnitTypeManaInitialAmount
   */
  umpi?: string | number;

  /**
   * GetUnitTypeManaMaximum
   */
  umpm?: string | number;

  /**
   * GetUnitTypeManaRegeneration
   */
  umpr?: string | number;

  /**
   * GetUnitTypeShowNeutralBuildingIcon
   */
  unbm?: string | number;

  /**
   * GetUnitTypeValidAsRandomNeutralBuilding
   */
  unbr?: string | number;

  /**
   * GetUnitTypePointValue
   */
  upoi?: string | number;

  /**
   * GetUnitTypePrimaryAttribute
   */
  upra?: string | number;

  /**
   * GetUnitTypePriority
   */
  upri?: string | number;

  /**
   * GetUnitTypeRace
   */
  urac?: string | number;

  /**
   * GetUnitTypeRepairGoldCost
   */
  ugor?: string | number;

  /**
   * GetUnitTypeRepairLumberCost
   */
  ulur?: string | number;

  /**
   * GetUnitTypeRepairTime
   */
  urtm?: string | number;

  /**
   * GetUnitTypeSightRadiusDay
   */
  usid?: string | number;

  /**
   * GetUnitTypeSightRadiusNight
   */
  usin?: string | number;

  /**
   * GetUnitTypeSleeps
   */
  usle?: string | number;

  /**
   * GetUnitTypeStartingAgility
   */
  uagi?: string | number;

  /**
   * GetUnitTypeStartingIntelligence
   */
  uint?: string | number;

  /**
   * GetUnitTypeStartingStrength
   */
  ustr?: string | number;

  /**
   * GetUnitTypeStockMaximum
   */
  usma?: string | number;

  /**
   * GetUnitTypeStockReplenishInterval
   */
  usrg?: string | number;

  /**
   * GetUnitTypeStockStartDelay
   */
  usst?: string | number;

  /**
   * GetUnitTypeStrengthPerLevel
   */
  ustp?: string | number;

  /**
   * GetUnitTypeTransportedSize
   */
  ucar?: string | number;

  /**
   * GetUnitTypeUnitClassification
   */
  utyp?: string | number;

  /**
   * GetUnitTypeDependencyEquivalents
   */
  udep?: string | number;

  /**
   * GetUnitTypeHeroRevivalLocations
   */
  urva?: string | number;

  /**
   * GetUnitTypeItemsMade
   */
  umki?: string | number;

  /**
   * GetUnitTypeItemsSold
   */
  usei?: string | number;

  /**
   * GetUnitTypeRequirements
   */
  ureq?: string | number;

  /**
   * GetUnitTypeRequirementsLevels
   */
  urqa?: string | number;

  /**
   * GetUnitTypeRequirementsTier2
   */
  urq1?: string | number;

  /**
   * GetUnitTypeRequirementsTier3
   */
  urq2?: string | number;

  /**
   * GetUnitTypeRequirementsTier4
   */
  urq3?: string | number;

  /**
   * GetUnitTypeRequirementsTier5
   */
  urq4?: string | number;

  /**
   * GetUnitTypeRequirementsTier6
   */
  urq5?: string | number;
  /**
   * GetUnitTypeRequirementsTier7
   */
  urq6?: string | number;

  /**
   * GetUnitTypeRequirementsTier8
   */
  urq7?: string | number;

  /**
   * GetUnitTypeRequirementsTier9
   */
  urq8?: string | number;

  /**
   * GetUnitTypeRequirementsTiersUsed
   */
  urqc?: string | number;

  /**
   * GetUnitTypeStructuresBuilt
   */
  ubui?: string | number;

  /**
   * GetUnitTypeResearchesAvailable
   */
  ures?: string | number;

  /**
   * GetUnitTypeRevivesDeadHeroes
   */
  urev?: string | number;

  /**
   * GetUnitTypeUnitsSold
   */
  useu?: string | number;

  /**
   * GetUnitTypeUnitsTrained
   */
  utra?: string | number;

  /**
   * GetUnitTypeUpgradesTo
   */
  uupt?: string | number;

  /**
   * GetUnitTypeUpgradesUsed
   */
  upgr?: string | number;

  /**
   * GetUnitTypeDescription
   */
  ides?: string | number;

  /**
   * GetUnitTypeHotkey
   */
  uhot?: string | number;

  /**
   * GetUnitTypeName
   */
  unam?: string | number;

  /**
   * GetUnitTypeNameEditorSuffix
   */
  unsf?: string | number;

  /**
   * GetUnitTypeProperNames
   */
  upro?: string | number;

  /**
   * GetUnitTypeProperNamesUsed
   */
  upru?: string | number;

  /**
   * GetUnitTypeAwakenTooltip
   */
  uawt?: string | number;

  /**
   * GetUnitTypeTooltip
   */
  utip?: string | number;

  /**
   * GetUnitTypeUbertip
   */
  utub?: string | number;

  /**
   * GetUnitTypeReviveTooltip
   */
  utpr?: string | number;
}

interface Skill {
  /**
   * 技能名称
   */
  name: string;
  /**
   * 技能热键
   */
  hotKey: string;
  /**
   * 技能图片
   */
  img: string;
  /**
   * 技能说明
   */
  desc: string;

  /**
   * 技能关联召唤物ID
   */
  pets?: string[];
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
  skill: Skill[];
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
