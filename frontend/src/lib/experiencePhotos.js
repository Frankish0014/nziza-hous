/**
 * Venue imagery from `src/images/` — used on home “On the property” cards and service-card fallbacks.
 */

import apartmentPhoto from '../images/appartment.jpeg';
import gymPhoto from '../images/gym.jpeg';
import coffeeSalonPhoto from '../images/nziza salon.jpeg';
import saunaPhoto from '../images/entrance.jpeg';
import massagePhoto from '../images/bed.jpeg';
import lodgePhoto from '../images/lodge.jpeg';

/** Fine-tune focal point for the coffee/lounge hero crop on cards */
export const COFFEE_THEMATIC_OBJECT_POSITION = 'center 48%';

export const EXPERIENCE_IMAGE = {
  gym: gymPhoto,
  apartment: apartmentPhoto,
  coffee: coffeeSalonPhoto,
  sauna: saunaPhoto,
  massage: massagePhoto,
  lodge: lodgePhoto,
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
