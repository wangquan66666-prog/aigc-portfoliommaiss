import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Camera, HeartHandshake, Mail, Menu, MessagesSquare, Network, Phone, Sparkles, X } from 'lucide-react'
import StrokeText from './StrokeText'
import AccordionGallery from './AccordionGallery'
import Stack from './Stack'
import MorphSlider from './MorphSlider'
import CircularGallery from './CircularGallery'
import LogoLoop from './LogoLoop'
import GridMotion from './GridMotion'
import StarBorder from './StarBorder'
import PixelTransition from './PixelTransition'
import PixelTrail from './PixelTrail'

const heroVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_044635_8daabe05-1a5c-491c-920f-4b0bd8f04812.mp4'

const gridMotionItems = [
  'assets/cover-poster.webp',
  'AIGC VIDEO',
  'assets/cover-illustration.webp',
  'TYPE STUDIES',
  'assets/cover-banner.webp',
  'assets/cover-splash.webp',
  'VISUAL STORY',
  'assets/film-cover-01.webp',
  'CHARACTER',
  'assets/cover-ip.webp',
  'assets/film-cover-02.webp',
  'BRAND SYSTEM',
  'assets/cover-vi.webp',
  'assets/film-cover-03.webp',
  'AI SHORT FILM',
  'assets/type-summer.webp',
  'assets/illustration-star-tower.webp',
  'MOTION DESIGN',
  'assets/film-cover-05.webp',
  'assets/banner-design-wave.png',
  'PROMPT TO FRAME',
  'assets/ip-bobo.webp',
  'assets/vi-nova-applications.webp',
  'DESIGN WITH AI',
  'assets/software-zajiaolaizhe.png',
  'assets/film-cover-08.webp',
  'WANG SHUO',
  'assets/poster-vivid-sun.webp',
]

const designWorks = [
  { title: '字体设计 / TYPE STUDIES', type: '字体设计', image: 'assets/cover-typography.png', size: 'typography' },
  { title: '插画设计 / ILLUSTRATION DESIGN', type: '概念插画', image: 'assets/cover-illustration.webp', size: 'concept' },
  { title: 'Banner 设计 / BANNER DESIGN', type: 'Banner 设计', image: 'assets/cover-banner.webp', size: 'banner' },
  { title: 'PING & EASY TRADE', type: '启动页设计', image: 'assets/cover-splash.webp', size: 'splash' },
  { title: 'IP 设计 / CHARACTER SYSTEMS', type: '角色设定与视觉规范', image: 'assets/cover-ip.webp', size: 'ip' },
  { title: 'VI 设计 / BRAND SYSTEMS', type: '品牌应用与视觉延展', image: 'assets/cover-vi.webp', size: 'vi' },
]

const designCarouselItems = [
  { id: 'poster', title: '海报设计 / POSTER DESIGN', subtitle: '海报系列 · 08 件作品', image: 'assets/cover-poster.webp' },
  ...designWorks.map((work) => ({ id: work.size, title: work.title, subtitle: work.type, image: work.image })),
]

const typographyWorks = [
  'assets/type-summer.webp',
  'assets/type-gothic.webp',
  'assets/type-atami.webp',
  'assets/type-sketch.webp',
  'assets/type-stellar.webp',
  'assets/type-ribbon.webp',
  'assets/type-sharp.webp',
  'assets/type-atami-alt.webp',
  'assets/cover-typography.png',
]

const ipWorks = [
  { image: 'assets/ip-bobo.webp', caption: '啵啵泡 / BOBO BUBBLE' },
  { image: 'assets/ip-tuotuo.webp', caption: '拖拖兽' },
  { image: 'assets/ip-blackout.webp', caption: '断电獾 / BLACKOUT' },
  { image: 'assets/ip-nova-material.webp', caption: 'NOVA AI / 材质系统' },
  { image: 'assets/ip-pupu.webp', caption: 'PUPU / 三视图' },
  { image: 'assets/ip-momo.webp', caption: 'MOMO PLANET' },
  { image: 'assets/ip-nova-core.webp', caption: 'NOVA 01 / 核心系统' },
  { image: 'assets/ip-mia.webp', caption: 'MIA / 色彩与材质' },
]

const viWorks = [
  { image: 'assets/vi-blackout-applications.webp', caption: 'BLACKOUT / 品牌应用' },
  { image: 'assets/vi-nova-applications.webp', caption: 'NOVA AI / 品牌应用' },
  { image: 'assets/vi-pupu-applications.webp', caption: 'PUPU / 品牌应用' },
  { image: 'assets/vi-bobo-applications.webp', caption: 'BOBO BUBBLE / 品牌应用' },
]

const illustrationWorks = [
  { image: 'assets/illustration-star-tower.webp', label: '星轨之塔' },
  { image: 'assets/illustration-crystal-library.webp', label: '冰晶藏书阁' },
  { image: 'assets/illustration-bear-apple.webp', label: '林间相遇' },
  { image: 'assets/illustration-vermilion-portrait.webp', label: '朱红肖像' },
  { image: 'assets/illustration-bear-rain.webp', label: '雨中漫步' },
  { image: 'assets/illustration-paper-cranes.webp', label: '云上纸鹤' },
  { image: 'assets/illustration-underwater-library.webp', label: '深海秘境' },
  { image: 'assets/illustration-bear-flowers.webp', label: '花间舞步' },
]

const splashWorks = [
  { image: 'assets/splash-ping.webp', label: '上 PING / 视频平台' },
  { image: 'assets/splash-easy-trade.webp', label: '物轻松 / 闲置交易' },
  { image: 'assets/splash-edu.webp', label: 'EDU / 教育平台' },
  { image: 'assets/splash-paipai.webp', label: '拍拍严选 / 二手商城' },
]

const bannerWorks = [
  { image: 'assets/banner-design-wave.png', label: '设计新浪潮 / DESIGN EXHIBITION' },
  { image: 'assets/banner-headphones.png', label: '沉浸聆听 / 无线降噪耳机' },
  { image: 'assets/banner-wandering.png', label: '流浪 / 话剧宣传' },
  { image: 'assets/banner-concert.png', label: '夏日音乐现场' },
]

const posterWorks = [
  { label: '校园寻宝', image: 'assets/poster-campus.webp' },
  { label: 'LOVE MYSELF', image: 'assets/poster-love-myself.webp' },
  { label: 'COOL! / 动势海报', image: 'assets/poster-cool.webp' },
  { label: '声浪音乐节', image: 'assets/poster-sound-wave.webp' },
  { label: '春日回响音乐节', image: 'assets/poster-echoes.webp' },
  { label: 'ASCEND / 时尚海报', image: 'assets/poster-ascend.webp' },
  { label: 'VIVID SUN', image: 'assets/poster-vivid-sun.webp' },
  { label: 'STATE SIDE', image: 'assets/poster-state-side.webp' },
]

const filmEpisodes = [
  {
    title: 'EPISODE 01',
    subtitle: '冷面王爷爱上我',
    image: 'assets/film-cover-01.webp',
    link: 'https://www.bilibili.com/video/BV1L1hM6YEiG/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '8 件素材 · 角色 / 道具 / 场景',
    materials: [
      { image: 'assets/drama-prince-prop-pouch.webp', caption: '道具·锦缎荷包', captionEn: 'PROP · SILK POUCH' },
      { image: 'assets/drama-prince-female-expressions.webp', caption: '女主·表情九宫格', captionEn: 'FEMALE LEAD · 9 EMOTIONS' },
      { image: 'assets/drama-prince-male-portrait.webp', caption: '男主·白衣全身', captionEn: 'MALE LEAD · WHITE ROBE' },
      { image: 'assets/drama-prince-male-3view.webp', caption: '男主·三视图', captionEn: 'MALE LEAD · 3-VIEW' },
      { image: 'assets/drama-prince-male-expressions.webp', caption: '男主·表情九宫格', captionEn: 'MALE LEAD · 9 EMOTIONS' },
      { image: 'assets/drama-prince-female-costume-3view.webp', caption: '女主·粉衣三视图', captionEn: 'FEMALE LEAD · 3-VIEW' },
      { image: 'assets/drama-prince-scene-bedroom.webp', caption: '场景·月下闺房 · 主视角', captionEn: 'SCENE · BEDROOM · PRIMARY' },
      { image: 'assets/drama-prince-scene-corridor.webp', caption: '场景·回廊', captionEn: 'SCENE · CORRIDOR' },
    ],
  },
  {
    title: 'EPISODE 02',
    subtitle: '时空邮局',
    image: 'assets/film-cover-02.webp',
    link: 'https://www.bilibili.com/video/BV1qH826zEek/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '13 件素材 · 角色 / 道具 / 场景',
    materials: [
      { image: 'assets/drama-postal-character-girl.webp', caption: '角色·红衣女孩', captionEn: 'CHARACTER · GIRL' },
      { image: 'assets/drama-postal-character-deer-postman.webp', caption: '角色·鹿邮差', captionEn: 'CHARACTER · DEER POSTMAN' },
      { image: 'assets/drama-postal-character-woman-purple.webp', caption: '角色·紫裙女人', captionEn: 'CHARACTER · WOMAN' },
      { image: 'assets/drama-postal-prop-pocket-watch.webp', caption: '道具·怀表三视图', captionEn: 'PROP · POCKET WATCH' },
      { image: 'assets/drama-postal-prop-tin-box.webp', caption: '道具·金属盒', captionEn: 'PROP · TIN BOX' },
      { image: 'assets/drama-postal-prop-airmail-envelope.webp', caption: '道具·航空信封', captionEn: 'PROP · AIRMAIL ENVELOPE' },
      { image: 'assets/drama-postal-prop-staircase.webp', caption: '场景·楼梯', captionEn: 'SCENE · STAIRCASE' },
      { image: 'assets/drama-postal-scene-street.webp', caption: '场景·城市街道', captionEn: 'SCENE · CITY STREET' },
      { image: 'assets/drama-postal-scene-hallway-4view.webp', caption: '场景·楼道四视角', captionEn: 'SCENE · HALLWAY · 4 VIEWS' },
      { image: 'assets/drama-postal-scene-corridor-clock.webp', caption: '场景·欧式走廊', captionEn: 'SCENE · CORRIDOR' },
      { image: 'assets/drama-postal-scene-dessert-shop.webp', caption: '场景·甜品店四视角', captionEn: 'SCENE · DESSERT SHOP' },
      { image: 'assets/drama-postal-scene-town-square.webp', caption: '场景·小镇广场', captionEn: 'SCENE · TOWN SQUARE' },
      { image: 'assets/drama-postal-scene-postal-hall.webp', caption: '场景·邮局大厅', captionEn: 'SCENE · POSTAL HALL' },
    ],
  },
  {
    title: 'EPISODE 03',
    subtitle: '命运金币',
    image: 'assets/film-cover-03.webp',
    link: 'https://www.bilibili.com/video/BV1qH826zEhL/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '7 件素材 · 角色 / 道具 / 场景',
    materials: [
      { image: 'assets/drama-coin-character-boy.webp', caption: '角色·少年', captionEn: 'CHARACTER · BOY' },
      { image: 'assets/drama-coin-character-elder.webp', caption: '角色·白胡子老人', captionEn: 'CHARACTER · ELDER' },
      { image: 'assets/drama-coin-character-woman-purple.webp', caption: '角色·紫裙女人', captionEn: 'CHARACTER · WOMAN' },
      { image: 'assets/drama-coin-character-stone-golem.webp', caption: '角色·石头巨人', captionEn: 'CHARACTER · STONE GOLEM' },
      { image: 'assets/drama-coin-prop-medallion.webp', caption: '道具·命运金币三视图', captionEn: 'PROP · COIN · 3-VIEW' },
      { image: 'assets/drama-coin-scene-snowy-village.webp', caption: '场景·雪夜村庄四视角', captionEn: 'SCENE · SNOWY VILLAGE' },
      { image: 'assets/drama-coin-scene-fireplace.webp', caption: '场景·壁炉', captionEn: 'SCENE · FIREPLACE' },
    ],
  },
  {
    title: 'EPISODE 04',
    subtitle: '逆天权谋',
    image: 'assets/film-cover-04.webp',
    link: 'https://v.douyin.com/o4GFmg6OVlc/',
    materialsLabel: '5 件素材 · 角色 / 场景',
    materials: [
      { image: 'assets/drama-power-character-emperor-black.webp', caption: '角色·黑金龙袍帝王', captionEn: 'CHARACTER · EMPEROR' },
      { image: 'assets/drama-power-character-empress-gold.webp', caption: '角色·金黄凤袍皇后', captionEn: 'CHARACTER · EMPRESS' },
      { image: 'assets/drama-power-character-young-master.webp', caption: '角色·白衣少主', captionEn: 'CHARACTER · YOUNG MASTER' },
      { image: 'assets/drama-power-character-maids-4costumes.webp', caption: '角色·侍女四套造型', captionEn: 'CHARACTER · MAIDS · 4 COSTUMES' },
      { image: 'assets/drama-power-scene-throne-hall.webp', caption: '场景·宫殿大殿五视角', captionEn: 'SCENE · THRONE HALL · 5 VIEWS' },
    ],
  },
  {
    title: 'EPISODE 05',
    subtitle: '蛇发少女的神殿之谜',
    image: 'assets/film-cover-05.webp',
    link: 'https://www.bilibili.com/video/BV17n826gEqa/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '5 件素材 · 角色 / 场景',
    materials: [
      { image: 'assets/drama-medusa-character-medusa.webp', caption: '角色·蛇发美杜莎', captionEn: 'CHARACTER · MEDUSA' },
      { image: 'assets/drama-medusa-character-princess.webp', caption: '角色·白裙公主', captionEn: 'CHARACTER · PRINCESS' },
      { image: 'assets/drama-medusa-character-athena.webp', caption: '角色·女战神雅典娜', captionEn: 'CHARACTER · ATHENA' },
      { image: 'assets/drama-medusa-character-poseidon.webp', caption: '角色·海神波塞冬', captionEn: 'CHARACTER · POSEIDON' },
      { image: 'assets/drama-medusa-scene-temple.webp', caption: '场景·希腊神殿四视角', captionEn: 'SCENE · GREEK TEMPLE · 4 VIEWS' },
    ],
  },
  {
    title: 'EPISODE 06',
    subtitle: '夏风来信',
    image: 'assets/film-cover-06.webp',
    link: 'https://www.bilibili.com/video/BV1Ho8q69Ehg/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '4 件素材 · 角色 / 道具 / 场景 / 风格',
    materials: [
      { image: 'assets/drama-summer-scene-rapeseed-field.webp', caption: '场景·油菜花田', captionEn: 'SCENE · RAPESEED FIELD' },
      { image: 'assets/drama-summer-prop-white-hat.webp', caption: '道具·白色草帽', captionEn: 'PROP · WHITE STRAW HAT' },
      { image: 'assets/drama-summer-character-girl-3view.webp', caption: '角色·白裙女孩', captionEn: 'CHARACTER · GIRL · 3-VIEW' },
      { image: 'assets/drama-summer-moodboard-iwai.webp', caption: '风格·岩井俊二 Moodboard', captionEn: 'STYLE · IWAI MOODBOARD' },
    ],
  },
  {
    title: 'EPISODE 07',
    subtitle: '霓虹裂界',
    image: 'assets/film-cover-07.webp',
    link: 'https://www.bilibili.com/video/BV1HM8y66ERi/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '8 件素材 · 界面 / 场景 / 角色',
    materials: [
      { image: 'assets/drama-neon-ui-start.webp', caption: 'UI·开始界面', captionEn: 'UI · START SCREEN' },
      { image: 'assets/drama-neon-ui-character-select.webp', caption: 'UI·角色选择 / 技能', captionEn: 'UI · CHARACTER & SKILLS' },
      { image: 'assets/drama-neon-ui-loading.webp', caption: 'UI·加载界面', captionEn: 'UI · LOADING' },
      { image: 'assets/drama-neon-ui-npc-dialogue.webp', caption: 'UI·NPC 对话', captionEn: 'UI · NPC DIALOGUE' },
      { image: 'assets/drama-neon-ui-battle-confrontation.webp', caption: 'UI·战斗对峙首帧 HUD', captionEn: 'UI · BATTLE · OPENING HUD' },
      { image: 'assets/drama-neon-ui-battle-result.webp', caption: 'UI·战斗结算尾帧 HUD', captionEn: 'UI · BATTLE · RESULT HUD' },
      { image: 'assets/drama-neon-scene-tracking-run.webp', caption: '场景·追踪奔跑', captionEn: 'SCENE · CHASE / RUN' },
      { image: 'assets/drama-neon-character-boss-crow.webp', caption: '角色·Boss 铁鸦四视图', captionEn: 'CHARACTER · BOSS IRON CROW' },
    ],
  },
  {
    title: 'EPISODE 08',
    subtitle: '破界',
    image: 'assets/film-cover-08.webp',
    link: 'https://www.bilibili.com/video/BV1pM8y66ELw/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '12 件素材 · 场景 / 角色 / 道具 / 设定',
    materials: [
      { image: 'assets/drama-pojie-01.webp', caption: '场景·血染村庄', captionEn: 'SCENE · BLOOD VILLAGE' },
      { image: 'assets/drama-pojie-02.webp', caption: '概念·太初之瞳', captionEn: 'CONCEPT · PRIMORDIAL EYE' },
      { image: 'assets/drama-pojie-03.webp', caption: '场景·宁静庭院', captionEn: 'SCENE · QUIET COURTYARD' },
      { image: 'assets/drama-pojie-04.webp', caption: '角色·羽民三视图', captionEn: 'CHARACTER · FEATHERED ONE · 3-VIEW' },
      { image: 'assets/drama-pojie-05.webp', caption: '场景·天穹', captionEn: 'SCENE · SKY' },
      { image: 'assets/drama-pojie-06.webp', caption: '场景·神树·昼', captionEn: 'SCENE · SACRED TREE · DAY' },
      { image: 'assets/drama-pojie-07.webp', caption: '场景·神树·俯瞰', captionEn: 'SCENE · SACRED TREE · OVERHEAD' },
      { image: 'assets/drama-pojie-08.webp', caption: '场景·神树·血夜', captionEn: 'SCENE · SACRED TREE · BLOOD MOON' },
      { image: 'assets/drama-pojie-09.webp', caption: '角色·逆命少年三视图', captionEn: 'CHARACTER · THE BOY · 3-VIEW' },
      { image: 'assets/drama-pojie-10.webp', caption: '概念·设定说明', captionEn: 'CONCEPT · DESIGN DOC' },
      { image: 'assets/drama-pojie-11.webp', caption: '道具·斜挎包', captionEn: 'PROP · SATCHEL' },
      { image: 'assets/drama-pojie-12.webp', caption: '概念·天裂', captionEn: 'CONCEPT · SKY RIFT' },
    ],
  },
  {
    title: 'EPISODE 09',
    subtitle: '掌心小相机',
    image: 'assets/film-cover-09.webp',
    link: 'https://www.bilibili.com/video/BV1qb8z6DEKv/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '5 件素材 · 场景 / 角色 / 道具',
    materials: [
      { image: 'assets/drama-palm-01.webp', caption: '场景·桌子四视角', captionEn: 'SCENE · TABLE · 4 VIEWS' },
      { image: 'assets/drama-palm-02.webp', caption: '道具·掌心相机主视图', captionEn: 'PROP · PALM CAMERA · FRONT' },
      { image: 'assets/drama-palm-03.webp', caption: '角色·模特头部+三视图', captionEn: 'CHARACTER · MODEL · HEAD + 3-VIEW' },
      { image: 'assets/drama-palm-04.webp', caption: '场景·桌子主视图', captionEn: 'SCENE · TABLE · MAIN' },
      { image: 'assets/drama-palm-05.webp', caption: '道具·掌心相机三视图', captionEn: 'PROP · PALM CAMERA · 3-VIEW' },
    ],
  },
  {
    title: 'EPISODE 10',
    subtitle: '日记',
    image: 'assets/film-cover-10.webp',
    link: 'https://www.bilibili.com/video/BV1Jw8B6nEpY/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '6 件素材 · 场景 / 角色 / 道具',
    materials: [
      { image: 'assets/drama-diary-01.webp', caption: '场景·圆桌凳子组合', captionEn: 'SCENE · TABLE & STOOLS' },
      { image: 'assets/drama-diary-02.webp', caption: '场景·中式餐厅俯视', captionEn: 'SCENE · CHINESE RESTAURANT · OVERHEAD' },
      { image: 'assets/drama-diary-03.webp', caption: '场景·中式餐厅四视角', captionEn: 'SCENE · CHINESE RESTAURANT · 4 VIEWS' },
      { image: 'assets/drama-diary-04.webp', caption: '角色·拟人狐狸头部+三视图 A', captionEn: 'CHARACTER · FOX · HEAD + 3-VIEW A' },
      { image: 'assets/drama-diary-05.webp', caption: '角色·拟人狐狸头部+三视图 B', captionEn: 'CHARACTER · FOX · HEAD + 3-VIEW B' },
      { image: 'assets/drama-diary-06.webp', caption: '道具·透明玻璃杯六视角', captionEn: 'PROP · GLASS · 6 VIEWS' },
    ],
  },
  {
    title: 'EPISODE 11',
    subtitle: '今日吃啥？',
    image: 'assets/film-cover-11.webp',
    link: 'https://www.bilibili.com/video/BV1rM8y66Eoz/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '18 件素材 · 角色 / 道具 / 场景',
    materials: [
      { image: 'assets/drama-food-prop-fried-chicken-1.webp', caption: '道具·韩式炸鸡六视角 A', captionEn: 'PROP · FRIED CHICKEN · 6 VIEWS A' },
      { image: 'assets/drama-food-prop-fried-chicken-2.webp', caption: '道具·韩式炸鸡六视角 B', captionEn: 'PROP · FRIED CHICKEN · 6 VIEWS B' },
      { image: 'assets/drama-food-prop-ufo-ship-1.webp', caption: '道具·UFO 飞船五视图 A', captionEn: 'PROP · UFO SHIP · 5 VIEWS A' },
      { image: 'assets/drama-food-prop-ufo-ship-2.webp', caption: '道具·UFO 飞船五视图 B', captionEn: 'PROP · UFO SHIP · 5 VIEWS B' },
      { image: 'assets/drama-food-prop-neon-sign.webp', caption: '道具·UFO 霓虹灯牌', captionEn: 'PROP · NEON UFO SIGN' },
      { image: 'assets/drama-food-prop-chair-white.webp', caption: '道具·白色餐椅', captionEn: 'PROP · WHITE CHAIR' },
      { image: 'assets/drama-food-character-girl-head.webp', caption: '角色·粉帽女头部特写', captionEn: 'CHARACTER · GIRL · HEAD' },
      { image: 'assets/drama-food-character-girl-3view.webp', caption: '角色·粉帽女三视图', captionEn: 'CHARACTER · GIRL · 3-VIEW' },
      { image: 'assets/drama-food-character-girl-expressions.webp', caption: '角色·粉帽女九宫格表情', captionEn: 'CHARACTER · GIRL · 9 EMOTIONS' },
      { image: 'assets/drama-food-character-girl-fullbody.webp', caption: '角色·粉帽女全身', captionEn: 'CHARACTER · GIRL · FULL BODY' },
      { image: 'assets/drama-food-scene-restaurant-wide-1.webp', caption: '场景·UFO 餐厅内景 · 全景 A', captionEn: 'SCENE · RESTAURANT · WIDE A' },
      { image: 'assets/drama-food-scene-restaurant-wide-2.webp', caption: '场景·UFO 餐厅内景 · 全景 B', captionEn: 'SCENE · RESTAURANT · WIDE B' },
      { image: 'assets/drama-food-scene-restaurant-wide-3.webp', caption: '场景·UFO 餐厅内景 · 全景 C', captionEn: 'SCENE · RESTAURANT · WIDE C' },
      { image: 'assets/drama-food-scene-booth-1.webp', caption: '场景·UFO 餐厅 · 卡座 A', captionEn: 'SCENE · RESTAURANT · BOOTH A' },
      { image: 'assets/drama-food-scene-booth-2.webp', caption: '场景·UFO 餐厅 · 卡座 B', captionEn: 'SCENE · RESTAURANT · BOOTH B' },
      { image: 'assets/drama-food-scene-booth-3.webp', caption: '场景·UFO 餐厅 · 卡座 C', captionEn: 'SCENE · RESTAURANT · BOOTH C' },
      { image: 'assets/drama-food-scene-sofa-1.webp', caption: '场景·UFO 餐厅 · 沙发卡座 A', captionEn: 'SCENE · RESTAURANT · SOFA A' },
      { image: 'assets/drama-food-scene-sofa-2.webp', caption: '场景·UFO 餐厅 · 沙发卡座 B', captionEn: 'SCENE · RESTAURANT · SOFA B' },
    ],
  },
  {
    title: 'EPISODE 12',
    subtitle: '上下晃动试试',
    image: 'assets/film-cover-12.webp',
    link: 'https://www.bilibili.com/video/BV1HM8y66EaU/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '2 件素材 · 角色 / 场景',
    materials: [
      { image: 'assets/drama-shake-01.webp', caption: '角色·橘猫三视图', captionEn: 'CHARACTER · GINGER CAT · 3-VIEW' },
      { image: 'assets/drama-shake-02.webp', caption: '场景·紫罗兰房间四视角', captionEn: 'SCENE · VIOLET ROOM · 4 VIEWS' },
    ],
  },
  {
    title: 'EPISODE 13',
    subtitle: '一秒换装',
    image: 'assets/film-cover-13.webp',
    link: 'https://www.bilibili.com/video/BV1HM8y66ERb/?share_source=copy_web&vd_source=c3a6ecc6ae45b2ecd10d763c570ee75f',
    materialsLabel: '12 件素材 · 角色 / 场景 / 道具',
    materials: [
      { image: 'assets/drama-outfit-01.webp', caption: '角色·白衬衫三视图', captionEn: 'CHARACTER · WHITE SHIRT · 3-VIEW' },
      { image: 'assets/drama-outfit-02.webp', caption: '角色·完整造型全身', captionEn: 'CHARACTER · FULL OUTFIT · FULL BODY' },
      { image: 'assets/drama-outfit-03.webp', caption: '角色·马甲套装三视图', captionEn: 'CHARACTER · VEST SET · 3-VIEW' },
      { image: 'assets/drama-outfit-04.webp', caption: '角色·针织背心三视图', captionEn: 'CHARACTER · KNIT VEST · 3-VIEW' },
      { image: 'assets/drama-outfit-05.webp', caption: '角色·内搭三视图', captionEn: 'CHARACTER · INNERWEAR · 3-VIEW' },
      { image: 'assets/drama-outfit-06.webp', caption: '场景·空房间背景墙', captionEn: 'SCENE · BLANK ROOM' },
      { image: 'assets/drama-outfit-07.webp', caption: '道具·衬衣单品', captionEn: 'PROP · SHIRT' },
      { image: 'assets/drama-outfit-08.webp', caption: '道具·心形吊坠', captionEn: 'PROP · HEART PENDANT' },
      { image: 'assets/drama-outfit-09.webp', caption: '道具·阔腿裤单品', captionEn: 'PROP · WIDE-LEG PANTS' },
      { image: 'assets/drama-outfit-10.webp', caption: '道具·挎包单品', captionEn: 'PROP · CROSSBODY BAG' },
      { image: 'assets/drama-outfit-11.webp', caption: '道具·针织马甲单品', captionEn: 'PROP · KNIT VEST' },
      { image: 'assets/drama-outfit-12.webp', caption: '道具·厚底鞋单品', captionEn: 'PROP · CHUNKY SNEAKERS' },
    ],
  },
]

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [activeDesignCategory, setActiveDesignCategory] = useState<string | null>(null)
  const [posterGalleryOpen, setPosterGalleryOpen] = useState(false)
  const [illustrationGalleryOpen, setIllustrationGalleryOpen] = useState(false)
  const [bannerGalleryOpen, setBannerGalleryOpen] = useState(false)
  const [splashGalleryOpen, setSplashGalleryOpen] = useState(false)
  const [resumeView, setResumeView] = useState<'profile' | 'history'>('profile')
  const resumeProfileHeadingRef = useRef<HTMLHeadingElement>(null)
  const resumeHistoryHeadingRef = useRef<HTMLHeadingElement>(null)
  const designShowcaseRef = useRef<HTMLDivElement>(null)
  const resumeViewMounted = useRef(false)

  useEffect(() => {
    if (!resumeViewMounted.current) {
      resumeViewMounted.current = true
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const heading = resumeView === 'history' ? resumeHistoryHeadingRef.current : resumeProfileHeadingRef.current
      heading?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [resumeView])

  useEffect(() => {
    if (!activeDesignCategory) return

    const frame = window.requestAnimationFrame(() => {
      designShowcaseRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [activeDesignCategory])

  const closeMenu = () => setMenuOpen(false)
  const activeDesign = designCarouselItems.find((item) => item.id === activeDesignCategory)

  return (
    <main className="overflow-x-hidden bg-ink text-paper">
      <div className="site-pixel-trail">
        <PixelTrail
          gridSize={18}
          trailSize={0.018}
          maxAge={200}
          interpolate={4.6}
          color="#a6f231"
          gooeyFilter={{ id: 'custom-goo-filter', strength: 2 }}
        />
      </div>
      <div className="site-grid-motion">
        <GridMotion items={gridMotionItems} />
      </div>
      <section id="home" className="hero relative min-h-[100dvh] overflow-hidden">
        <video
          className={`hero-video ${videoReady ? 'is-ready' : ''}`}
          autoPlay loop muted playsInline preload="metadata"
          onCanPlay={() => setVideoReady(true)}
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-scrim" />

        <header className="relative z-20 mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#home" className="brand" aria-label="返回首页">AIGC / PORTFOLIO</a>
          <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="主导航">
            <a href="#about">个人简历</a>
            <a href="#design">精选设计</a>
            <a href="#films">精选短剧</a>
            <a href="#app">软件作品</a>
          </nav>
          <a href="#contact" className="hidden items-center gap-2 text-sm md:flex">联系我 <ArrowDownRight size={16} strokeWidth={1.5} /></a>
          <button className="icon-button md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? '关闭菜单' : '打开菜单'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </header>

        {menuOpen && (
          <nav className="mobile-menu" aria-label="移动端导航">
            <a href="#about" onClick={closeMenu}>个人简历</a>
            <a href="#design" onClick={closeMenu}>精选设计</a>
            <a href="#films" onClick={closeMenu}>精选短剧</a>
            <a href="#app" onClick={closeMenu}>软件作品</a>
          </nav>
        )}

        <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] max-w-[1400px] items-end px-5 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16">
          <div className="hero-copy max-w-5xl">
            <p className="hero-eyebrow">AI 视觉设计与叙事创作</p>
            <h1 className="effect-heading">
              <span className="sr-only">AIGC个人作品集</span>
              <StrokeText
                text={'AIGC\n个人作品集'}
                strokeColor="#ffffff"
                fillColor="#ffffff"
                strokeWidth={1.1}
                drawDuration={3.4}
                fillDelay={1.9}
                stagger={0.1}
                ease="power2.out"
                trigger="mount"
                fillMode="fade"
                fontSize={162}
                fontWeight={900}
                letterSpacing={12}
                align="left"
                gradientColors={['#ffffff', '#ffffff', '#ffffff']}
                fontFamily={'"Arial Black", "Microsoft YaHei", "Noto Sans SC", sans-serif'}
              />
            </h1>
            <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <a href="#design" className="primary-button">查看作品 <ArrowRight size={18} strokeWidth={1.5} /></a>
              <p className="max-w-sm text-sm leading-6 text-paper/70">用生成式工具完成从视觉概念、动态设计到短剧叙事的完整表达。</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="resume-section">
        <div className="section-shell resume-layout">
          <Reveal className={`resume-interactive ${resumeView === 'history' ? 'is-history' : ''}`}>
            <div className="resume-view resume-overview" aria-hidden={resumeView !== 'profile'}>
              <p className="resume-label">个人简历</p>
              <div className="resume-overview-grid">
                <figure className="resume-portrait">
                  <img src="assets/resume-portrait-new.png" alt="王硕个人照片" loading="lazy" />
                </figure>

                <div className="resume-profile-copy">
                  <div className="resume-identity">
                    <h2 ref={resumeProfileHeadingRef} tabIndex={-1}>王硕</h2>
                    <p className="resume-role">AIGC 创意师 / AI 视觉内容</p>
                  </div>

                  <p className="resume-summary">环境设计专业背景，擅长把设计思维、画面构成与生成式工具结合，完成从创意策划到后期成片的完整内容生产。</p>

                  <div className="resume-target">
                    <span>目标方向</span>
                    <p>AIGC 创意师、AI 美学专员及相关岗位</p>
                  </div>

                  <div className="resume-tools">
                    <div><span>AI 创作</span><p>GPT / Claude / 即梦 / 豆包 / LibTV</p></div>
                    <div><span>视觉后期</span><p>Photoshop / Illustrator / 剪映 / PowerPoint</p></div>
                  </div>

                  <div className="resume-details">
                    <div>
                      <span>教育背景</span>
                      <h4>环境设计专业</h4>
                      <p>郑州工商学院 · 艺术学院 / 本科</p>
                    </div>
                    <div>
                      <span>竞赛荣誉</span>
                      <h4>河南省文化创意大赛银奖</h4>
                      <p>2025 / “国青杯”三等奖 2024</p>
                    </div>
                  </div>

                  <StarBorder
                    as="button"
                    type="button"
                    className="resume-view-button"
                    color="white"
                    speed="5s"
                    onClick={() => setResumeView('history')}
                    aria-controls="resume-history-view"
                    tabIndex={resumeView === 'profile' ? 0 : -1}
                  >
                    查看工作经历 <ArrowRight size={18} strokeWidth={1.5} />
                  </StarBorder>
                </div>
              </div>
            </div>

            <div id="resume-history-view" className="resume-view resume-history" aria-hidden={resumeView !== 'history'}>
              <div className="resume-history-topbar">
                <button
                  type="button"
                  className="resume-back-button"
                  onClick={() => setResumeView('profile')}
                  tabIndex={resumeView === 'history' ? 0 : -1}
                >
                  <ArrowLeft size={18} strokeWidth={1.5} /> 返回个人档案
                </button>
                <p>个人简历 / 职业履历</p>
              </div>

              <div className="resume-history-heading">
                <p>职业履历</p>
                <h3 ref={resumeHistoryHeadingRef} tabIndex={-1}>工作经历</h3>
              </div>
              <div className="resume-jobs">
                <article className="resume-job">
                  <time>2025.07 - 2026.08</time>
                  <div>
                    <h4>北京国王互娱文化有限公司</h4>
                    <p className="resume-job-role">AI 视频生成</p>
                    <p>参与 AI 短剧、视频与小说内容生产，负责脚本创作、Prompt 优化、风格调校和系列化内容制作。</p>
                  </div>
                </article>
                <article className="resume-job">
                  <time>2024.10 - 2025.06</time>
                  <div>
                    <h4>奥睿森文化传播有限公司</h4>
                    <p className="resume-job-role">广告制作</p>
                    <p>完成商业海报、新媒体配图和活动物料设计，结合 AIGC 进行创意发散、素材生成与视觉精修。</p>
                  </div>
                </article>
              </div>

              <div className="resume-history-footer">
                <span>求职方向</span>
                <p>AIGC 创意师 / AI 美学专员</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="design" className="design-section bg-[#171815] py-24 text-paper md:py-36">
        <div className="section-shell design-content">
          <Reveal>
            <h2 className="section-title">精选设计</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-paper/55">从平面、字体与概念插画，到 IP、VI 和启动页设计，每一件作品都从明确的视觉命题出发。</p>
          </Reveal>

          <Reveal className="design-carousel-wrap" delay={80}>
            <LogoLoop
              logos={designCarouselItems}
              speed={54}
              direction="left"
              logoHeight={460}
              gap={16}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#171815"
              ariaLabel="精选设计分类循环展示"
              selectedId={activeDesignCategory}
              onItemClick={(item) => setActiveDesignCategory((current) => current === item.id ? null : item.id)}
            />
          </Reveal>

          {activeDesign && (
            <div ref={designShowcaseRef} className="design-showcase-anchor">
              <Reveal className="design-showcase-panel" key={activeDesign.id}>
                <div className="design-showcase-heading">
                  <div>
                    <span>{String(designCarouselItems.findIndex((item) => item.id === activeDesign.id) + 1).padStart(2, '0')} / 07</span>
                    <h3>{activeDesign.title}</h3>
                    <p>{activeDesign.subtitle}</p>
                  </div>
                  <button type="button" onClick={() => setActiveDesignCategory(null)} aria-label="收起设计系列">
                    收起 <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <div className={`design-showcase-body is-${activeDesign.id}`}>
                  {activeDesign.id === 'poster' && (
                    <AccordionGallery items={posterWorks} defaultIndex={2} expandRatio={0.52} trigger="hover" />
                  )}
                  {activeDesign.id === 'typography' && (
                    <div className="design-showcase-stack">
                      <Stack
                        randomRotation={true}
                        sensitivity={180}
                        sendToBackOnClick={true}
                        cards={typographyWorks.map((src, cardIndex) => (
                          <img key={src} src={src} alt={`字体设计作品 ${cardIndex + 1}`} draggable="false" loading="lazy" />
                        ))}
                      />
                    </div>
                  )}
                  {activeDesign.id === 'concept' && (
                    <AccordionGallery
                      items={illustrationWorks}
                      defaultIndex={2}
                      expandRatio={0.52}
                      trigger="hover"
                      ariaLabel="插画设计作品切换"
                      imageAltSuffix="插画作品"
                    />
                  )}
                  {activeDesign.id === 'banner' && (
                    <AccordionGallery
                      items={bannerWorks}
                      defaultIndex={2}
                      expandRatio={0.52}
                      trigger="hover"
                      ariaLabel="Banner 设计作品切换"
                      imageAltSuffix="Banner 设计"
                    />
                  )}
                  {activeDesign.id === 'splash' && (
                    <AccordionGallery
                      items={splashWorks}
                      defaultIndex={2}
                      expandRatio={0.52}
                      trigger="hover"
                      ariaLabel="启动页设计作品切换"
                      imageAltSuffix="启动页设计"
                    />
                  )}
                  {activeDesign.id === 'ip' && (
                    <MorphSlider items={ipWorks} transition="melt" intensity={0.55} aberration={0.35} drift={0.4} autoplay />
                  )}
                  {activeDesign.id === 'vi' && (
                    <MorphSlider items={viWorks} transition="melt" intensity={0.55} aberration={0.35} drift={0.4} autoplay />
                  )}
                </div>
              </Reveal>
            </div>
          )}

          <div className="legacy-design-layout" aria-hidden="true">

          <Reveal className="poster-series" delay={80}>
            <button
              type="button"
              className="poster-lead"
              onClick={() => setPosterGalleryOpen((open) => !open)}
              aria-expanded={posterGalleryOpen}
              aria-controls="poster-accordion-gallery"
            >
              <span className="work-image-wrap"><img src="assets/cover-poster.webp" alt="海报设计封面" loading="lazy" /></span>
              <span className="project-caption poster-lead-caption">
                <span className="project-index">01</span>
                <span className="project-copy"><strong>海报设计 / POSTER DESIGN</strong><small>海报系列 · 08 件作品</small></span>
                <span className="project-action">{posterGalleryOpen ? '收起海报系列' : '点击展开海报系列'} <ArrowDownRight size={19} strokeWidth={1.5} /></span>
              </span>
            </button>

            <div id="poster-accordion-gallery" className={`poster-accordion-shell ${posterGalleryOpen ? 'is-open' : ''}`} aria-hidden={!posterGalleryOpen}>
              <div className="poster-accordion-inner">
                <AccordionGallery items={posterWorks} defaultIndex={2} expandRatio={0.52} trigger="hover" />
              </div>
            </div>
          </Reveal>

          <div className="design-grid mt-14 md:mt-20">
            {designWorks.map((work, index) => (
              <Reveal key={work.title} className={`work-item ${work.size}`} delay={index * 70}>
                <figure>
                  {work.size === 'concept' ? (
                    <div className="illustration-project">
                      <button
                        type="button"
                        className="illustration-lead"
                        onClick={() => setIllustrationGalleryOpen((open) => !open)}
                        aria-expanded={illustrationGalleryOpen}
                        aria-controls="illustration-accordion-gallery"
                      >
                        <span className="work-image-wrap"><img src={work.image} alt="插画设计作品展示" loading="lazy" /></span>
                        <span className="project-caption illustration-lead-caption">
                          <span className="project-index">{String(index + 2).padStart(2, '0')}</span>
                          <span className="project-copy"><strong>{work.title}</strong><small>{work.type}</small></span>
                          <span className="project-action">{illustrationGalleryOpen ? '收起插画系列' : '点击展开插画系列'} <ArrowDownRight size={20} strokeWidth={1.5} /></span>
                        </span>
                      </button>

                      <div
                        id="illustration-accordion-gallery"
                        className={`poster-accordion-shell illustration-accordion-shell ${illustrationGalleryOpen ? 'is-open' : ''}`}
                        aria-hidden={!illustrationGalleryOpen}
                      >
                        <div className="poster-accordion-inner illustration-gallery-stage">
                          <AccordionGallery
                            items={illustrationWorks}
                            defaultIndex={2}
                            expandRatio={0.52}
                            trigger="hover"
                            ariaLabel="插画设计作品切换"
                            imageAltSuffix="插画作品"
                          />
                        </div>
                      </div>
                    </div>
                  ) : work.size === 'typography' ? (
                    <div className="typography-stack-stage">
                      <Stack
                        randomRotation={true}
                        sensitivity={180}
                        sendToBackOnClick={true}
                        cards={typographyWorks.map((src, cardIndex) => (
                          <img key={src} src={src} alt={`字体设计作品 ${cardIndex + 1}`} draggable="false" loading="lazy" />
                        ))}
                      />
                    </div>
                  ) : work.size === 'banner' ? (
                    <div className="banner-project">
                      <button
                        type="button"
                        className="illustration-lead banner-lead"
                        onClick={() => setBannerGalleryOpen((open) => !open)}
                        aria-expanded={bannerGalleryOpen}
                        aria-controls="banner-accordion-gallery"
                      >
                        <span className="work-image-wrap"><img src={work.image} alt="Banner 设计封面" loading="lazy" /></span>
                        <span className="project-caption illustration-lead-caption">
                          <span className="project-index">{String(index + 2).padStart(2, '0')}</span>
                          <span className="project-copy"><strong>{work.title}</strong><small>{work.type}</small></span>
                          <span className="project-action">{bannerGalleryOpen ? '收起 Banner 系列' : '点击展开 Banner 系列'} <ArrowDownRight size={20} strokeWidth={1.5} /></span>
                        </span>
                      </button>

                      <div
                        id="banner-accordion-gallery"
                        className={`poster-accordion-shell illustration-accordion-shell ${bannerGalleryOpen ? 'is-open' : ''}`}
                        aria-hidden={!bannerGalleryOpen}
                      >
                        <div className="poster-accordion-inner banner-gallery-stage">
                          <AccordionGallery
                            items={bannerWorks}
                            defaultIndex={2}
                            expandRatio={0.52}
                            trigger="hover"
                            ariaLabel="Banner 设计作品切换"
                            imageAltSuffix="Banner 设计"
                          />
                        </div>
                      </div>
                    </div>
                  ) : work.size === 'splash' ? (
                    <div className="splash-project">
                      <button
                        type="button"
                        className="illustration-lead splash-lead"
                        onClick={() => setSplashGalleryOpen((open) => !open)}
                        aria-expanded={splashGalleryOpen}
                        aria-controls="splash-accordion-gallery"
                      >
                        <span className="work-image-wrap"><img src={work.image} alt="PING 与 EASY TRADE 启动页设计展示" loading="lazy" /></span>
                        <span className="project-caption illustration-lead-caption">
                          <span className="project-index">{String(index + 2).padStart(2, '0')}</span>
                          <span className="project-copy"><strong>{work.title}</strong><small>{work.type}</small></span>
                          <span className="project-action">{splashGalleryOpen ? '收起启动页系列' : '点击展开启动页系列'} <ArrowDownRight size={20} strokeWidth={1.5} /></span>
                        </span>
                      </button>

                      <div
                        id="splash-accordion-gallery"
                        className={`poster-accordion-shell illustration-accordion-shell ${splashGalleryOpen ? 'is-open' : ''}`}
                        aria-hidden={!splashGalleryOpen}
                      >
                        <div className="poster-accordion-inner splash-gallery-stage">
                          <AccordionGallery
                            items={splashWorks}
                            defaultIndex={2}
                            expandRatio={0.52}
                            trigger="hover"
                            ariaLabel="启动页设计作品切换"
                            imageAltSuffix="启动页设计"
                          />
                        </div>
                      </div>
                    </div>
                  ) : work.size === 'ip' ? (
                    <MorphSlider
                      items={ipWorks}
                      transition="melt"
                      intensity={0.55}
                      aberration={0.35}
                      drift={0.4}
                      autoplay
                    />
                  ) : work.size === 'vi' ? (
                    <MorphSlider
                      items={viWorks}
                      transition="melt"
                      intensity={0.55}
                      aberration={0.35}
                      drift={0.4}
                      autoplay
                    />
                  ) : (
                    <div className="work-image-wrap"><img src={work.image} alt={work.title} loading="lazy" /></div>
                  )}
                  {work.size !== 'concept' && work.size !== 'banner' && work.size !== 'splash' && (
                    <figcaption className="project-caption">
                      <span className="project-index">{String(index + 2).padStart(2, '0')}</span>
                      <span className="project-copy"><strong>{work.title}</strong><small>{work.type}</small></span>
                      <span className="project-action is-icon"><ArrowDownRight size={20} strokeWidth={1.5} /></span>
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section id="films" className="py-24 md:py-36">
        <div className="section-shell">
          <Reveal className="film-gallery-heading">
            <div>
              <p>{filmEpisodes.length} EPISODES · AIGC SHORT DRAMA</p>
              <h2 className="section-title">精选AI视频</h2>
            </div>
            <span>滚轮、拖拽或方向键浏览</span>
          </Reveal>
          <Reveal className="circular-gallery-shell" delay={80}>
            <CircularGallery
              items={filmEpisodes}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.02}
              fontUrl="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
              font="700 30px Orbitron, sans-serif"
            />
          </Reveal>
        </div>
      </section>

      <section id="app" className="software-section py-24 md:py-36">
        <div className="section-shell">
          <Reveal className="film-gallery-heading">
            <div>
              <p>SOFTWARE / AI PRODUCT</p>
              <h2 className="section-title">软件作品</h2>
            </div>
            <span>独立开发的 AI 应用</span>
          </Reveal>

          <Reveal className="software-card" delay={80}>
            <div className="software-card-hero">
              <div className="software-card-meta">
                <span className="software-category">AI 家庭关系助手</span>
                <h3 className="software-name">咋叫来着</h3>
                <p className="software-tagline">叫对每一位重要的人</p>
                <p className="software-desc">复杂亲属关系，一句话找到正确称呼。让科技理解中国家庭里的每一种亲切。</p>
              </div>
              <a
                className="software-preview"
                href="https://wangquan66666-prog.github.io/zajiaolaizhe/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="在新窗口查看咋叫来着软件官网"
              >
                <img src="assets/software-zajiaolaizhe.png" alt="咋叫来着软件官网首页预览" loading="lazy" />
                <span>查看完整官网 <ArrowUpRight size={17} strokeWidth={1.8} /></span>
              </a>
            </div>

            <ul className="software-features">
              <li>
                <Sparkles size={20} strokeWidth={1.5} />
                <strong>AI 称呼计算</strong>
                <small>自然语言输入，瞬间给出正式与日常称呼</small>
              </li>
              <li>
                <Network size={20} strokeWidth={1.5} />
                <strong>家庭关系树</strong>
                <small>把复杂家庭网络变成一张清晰的图</small>
              </li>
              <li>
                <Camera size={20} strokeWidth={1.5} />
                <strong>AI 照片识别</strong>
                <small>从家庭合照中认识亲人</small>
              </li>
              <li>
                <HeartHandshake size={20} strokeWidth={1.5} />
                <strong>见家长模式</strong>
                <small>提前了解称呼与初次见面礼仪</small>
              </li>
            </ul>

            <div className="software-card-footer">
              <p className="software-notes">无需注册 / 本地数据存储 / 免费体验</p>
              <a
                className="software-cta"
                href="https://wangquan66666-prog.github.io/zajiaolaizhe/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="访问咋叫来着软件官网"
              >
                访问软件官网 <ArrowUpRight size={18} strokeWidth={1.8} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer id="contact" className="contact-section border-t border-paper/15">
        <div className="section-shell contact-shell">
          <div className="contact-heading">
            <p>有新的创意想法？</p>
            <h2>保持联系</h2>
          </div>

          <div className="contact-pixel-grid">
            <PixelTransition
              firstContent={<div className="contact-icon-face"><Mail size={48} strokeWidth={1.25} /><span className="sr-only">邮箱</span></div>}
              secondContent={<div className="contact-detail-face"><span>EMAIL</span><a href="mailto:2912266865@qq.com">2912266865@qq.com</a></div>}
              gridSize={12}
              pixelColor="#ffffff"
              once={false}
              animationStepDuration={0.4}
              ariaLabel="查看邮箱联系方式"
            />
            <PixelTransition
              firstContent={<div className="contact-icon-face"><MessagesSquare size={50} strokeWidth={1.25} /><span className="sr-only">微信</span></div>}
              secondContent={<div className="contact-detail-face"><span>WECHAT</span><strong>18303858279</strong></div>}
              gridSize={12}
              pixelColor="#ffffff"
              once={false}
              animationStepDuration={0.4}
              ariaLabel="查看微信联系方式"
            />
            <PixelTransition
              firstContent={<div className="contact-icon-face"><span className="contact-qq-icon">Q</span><span className="sr-only">QQ</span></div>}
              secondContent={<div className="contact-detail-face"><span>QQ</span><strong>2912266865</strong></div>}
              gridSize={12}
              pixelColor="#ffffff"
              once={false}
              animationStepDuration={0.4}
              ariaLabel="查看 QQ 联系方式"
            />
            <PixelTransition
              firstContent={<div className="contact-icon-face"><Phone size={47} strokeWidth={1.25} /><span className="sr-only">电话</span></div>}
              secondContent={<div className="contact-detail-face"><span>PHONE</span><a href="tel:18303858279">18303858279</a></div>}
              gridSize={12}
              pixelColor="#ffffff"
              once={false}
              animationStepDuration={0.4}
              ariaLabel="查看电话联系方式"
            />
          </div>

          <div className="contact-footer-line">
            <p>悬停或点击卡片查看联系方式</p>
            <p>© 2026 AIGC个人作品集</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
