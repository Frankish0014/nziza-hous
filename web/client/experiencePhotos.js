/** Thematic Unsplash photos by venue kind — same art direction as the home “On the property” cards. */

export function experiencePhoto(id, w = 800, h = 520) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=85`;
}

export const EXPERIENCE_IMAGE = {
  gym: experiencePhoto('photo-1649888216899-047093431441'),
  apartment: experiencePhoto('photo-1522708323590-d24dbb6b0267'),
  coffee: experiencePhoto('photo-1554118811-1e0d58224f24'),
  sauna: experiencePhoto('photo-1540555700478-4be289fbecef'),
  massage: experiencePhoto('photo-1675159364445-80fa5e54314a'),
  lodge: experiencePhoto('photo-1478131143081-80f7f84ca84d'),
};

const FALLBACK = EXPERIENCE_IMAGE.apartment;

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
