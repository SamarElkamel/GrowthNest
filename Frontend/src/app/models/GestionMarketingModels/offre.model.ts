import { TypeOffre } from './type-offre.model';

export interface Offre {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  typeOffre: TypeOffre;
}
