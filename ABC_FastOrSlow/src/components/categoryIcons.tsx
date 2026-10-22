import { Briefcase, Cube, FilmSlate, ForkKnife, GenderFemale, GenderMale, MapPin, PawPrint, Tag, type Icon } from '@phosphor-icons/react';
import type { CategoryId } from '../../shared/constants';

export const CATEGORY_ICON: Record<CategoryId, Icon> = {
  boy: GenderMale,
  girl: GenderFemale,
  animal: PawPrint,
  place: MapPin,
  food: ForkKnife,
  thing: Cube,
  brand: Tag,
  job: Briefcase,
  movie: FilmSlate,
};
