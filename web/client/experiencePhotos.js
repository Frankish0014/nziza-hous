/** Thematic Unsplash photos by venue kind — same art direction as the home “On the property” cards. */

export function experiencePhoto(id, w = 800, h = 520) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=85`;
}

export const COFFEE_THEMATIC_OBJECT_POSITION = 'center 72%';

export const EXPERIENCE_IMAGE = {
  gym: experiencePhoto('photo-1603503364272-6e28e046b37a', 960, 960),
  apartment: '/images/appartment.jpeg',
  coffee: experiencePhoto('photo-1509042239860-f550ce710b93', 1200, 900),
  sauna: experiencePhoto('photo-1540555700478-4be289fbecef'),
  massage: experiencePhoto('photo-1675159364445-80fa5e54314a'),
  lodge: experiencePhoto('photo-1478131143081-80f7f84ca84d'),
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
