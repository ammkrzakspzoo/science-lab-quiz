/**
 * Single entry point for the generated artwork.
 * Only the fixed contract names exist — never reference another image name.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'),
  sprite2: require('../../assets/sprite_2.png'),
  sprite3: require('../../assets/sprite_3.png'),
  sprite4: require('../../assets/sprite_4.png'),
  sprite5: require('../../assets/sprite_5.png'),
};

/** Subject illustrations, one sprite per subject. */
export const subjectSprite = {
  physics: assets.sprite1,
  chemistry: assets.sprite2,
  biology: assets.sprite3,
};

export type AssetSource = typeof assets.logo;
