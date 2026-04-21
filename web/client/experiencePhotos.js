/** Venue imagery from web/public/images — keep aligned with frontend/src/lib/experiencePhotos.js */

export const COFFEE_THEMATIC_OBJECT_POSITION = 'center 48%';

export const EXPERIENCE_IMAGE = {
  gym: '/images/gym.jpeg',
  apartment: '/images/appartment.jpeg',
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&h=900&q=85',
  sauna: '/images/souna.jpeg',
  massage: '/images/massage.jpeg',
  lodge: '/images/lodge.jpeg',
};

const FALLBACK = EXPERIENCE_IMAGE.apartment;

export function getThematicImageObjectPosition(type) {
  const t = String(type || '').toLowerCase();
  if (t.includes('coffee')) return COFFEE_THEMATIC_OBJECT_POSITION;
  return undefined;
}

/**
 * Map API `service.type` (e.g. gym, coffee_shop, apartment) to the same thematic image as on the home page.
 */
export function getThematicExperienceImage(type) {
  const t = String(type || '').toLowerCase();
  if (t.includes('gym')) return EXPERIENCE_IMAGE.gym;
  if (t.includes('apartment') || t.includes('apt')) return EXPERIENCE_IMAGE.apartment;
  if (t.includes('coffee')) return EXPERIENCE_IMAGE.coffee;
  if (t.includes('sauna')) return EXPERIENCE_IMAGE.sauna;
  if (t.includes('massage')) return EXPERIENCE_IMAGE.massage;
  if (t.includes('lodge')) return EXPERIENCE_IMAGE.lodge;
  return FALLBACK;
}
