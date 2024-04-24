const sprite = 'Sprite Ref';
const chest = 'Chest Ref';
const head = 'Head Ref';
const origin = 'Origin Ref';
const overhead = 'Overhead Ref';
const weapon = 'Weapon Ref';
// 位置映射
export const attachLocationMapping = {
  sprite,
  chest,
  head,
  origin,
  weapon,
  overhead,
  ['foot left']: 'Foot Left Ref',
  ['foot right']: 'Foot Right Ref',
  ['hand left']: 'Hand Left Ref',
  ['hand right']: 'Hand Right Ref',
};

// 翅膀装饰
export const attachWings = [
  { id: 'I0GQ', name: '海蚀翅膀', model: 'Effects\\YH7.mdx', location: chest },
  {
    id: 'I0EQ',
    name: '万圣节耀目翅膀',
    model: 'Effects\\Wings\\OrangeParticle\\zm-chib-j.mdx',
    location: chest,
  },
  { id: 'I0HG', name: '蓝天使翅膀', model: 'Effects\\Wings\\sgb4.mdx', location: sprite },
  { id: 'I0H7', name: '小魔王翅膀', model: 'Effects\\SGB4_Purple.mdx', location: sprite },
  { id: 'I0HH', name: '雪花翅膀', model: 'Effects\\Wings\\Wing_CH_YXDZCB.mdx', location: chest },
  // { id: 'I0IP', name: '绝望', model: 'Effects\\FlameStrikeTarget_Purple.mdx', location: origin },
];

// 头盔装饰
export const attachHelmets = [
  {
    id: 'I0IR',
    name: '荒古遗尘 众神之角',
    model: 'Effects\\LightningBoltMissile_Yellow.mdx',
    location: chest,
  },
  { id: 'I0C7', name: '永恒圣焱之冠', model: 'SanctusWing.mdx', location: chest },
];

// 饰品装饰
export const attachRings = [
  { id: 'I0LA', name: '蓝莲花光环', model: 'Effects\\Auras\\XD_GH01.mdx', location: origin },
  { id: 'I0LH', name: '幸运光环', model: 'Effects\\LibertyYellow.mdx', location: chest },
];
