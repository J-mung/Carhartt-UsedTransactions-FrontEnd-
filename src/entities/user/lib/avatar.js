import Identicon from 'identicon.js';

const DEFAULT_IDENTICON_OPTIONS = {
  size: 64,
  format: 'svg',
};

const STRING_FALLBACKS = ['avatar', 'profileImage', 'profile_image', 'image'];

const isValidImageValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value !== 'string') return true;
  const trimmed = value.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'null') return false;
  return true;
};

const normalizeSeed = (seed) => {
  const base = seed || 'carhartt-user';
  const hex = Array.from(base)
    .map((char) => char.charCodeAt(0).toString(16))
    .join('');
  // identicon.js는 최소 15자 이상의 16진수 문자열을 기대
  return hex.padEnd(32, '0').slice(0, 32);
};

export const generateIdenticonDataUrl = (
  seed,
  options = DEFAULT_IDENTICON_OPTIONS
) => {
  const hexSeed = normalizeSeed(seed);
  const { size, format } = { ...DEFAULT_IDENTICON_OPTIONS, ...options };
  const identicon = new Identicon(hexSeed, { size, format }).toString();
  const mimeType = format === 'svg' ? 'svg+xml' : 'png';
  return `data:image/${mimeType};base64,${identicon}`;
};

export const makeUserAvatar = (user, options) => {
  if (!user) return user;

  const avatarKey = STRING_FALLBACKS.find(
    (key) => key in user && isValidImageValue(user[key])
  );

  if (avatarKey) {
    return {
      ...user,
      avatar: user[avatarKey],
    };
  }

  const seed = user.email || user.id || user.name;
  const avatar = generateIdenticonDataUrl(seed, options);

  return {
    ...user,
    avatar,
  };
};
