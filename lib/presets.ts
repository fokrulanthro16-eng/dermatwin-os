import { ClinicalPreset } from '@/types/dermatwin';

export const CLINICAL_PRESETS: ClinicalPreset[] = [
  {
    id: 'preset-elena',
    name: 'Elena Vance',
    age: 32,
    gender: 'Female',
    tagline: 'Erythematotelangiectatic Rosacea & Compromised Stratum Corneum',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1080&q=80',
    concern: 'Severe vascular redness, burning sensation, transepidermal water loss',
    expectedSkinType: 'Sensitive',
    description: 'Clinical profile exhibits extensive malar flushing, barrier depletion, and heightened neural sensitivity requiring strict elimination of acidic keratolytic agents and retinoids.'
  },
  {
    id: 'preset-marcus',
    name: 'Marcus Chen',
    age: 24,
    gender: 'Male',
    tagline: 'Moderate Papulopustular Acne & T-Zone Sebaceous Hyperactivity',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1080&q=80',
    concern: 'Inflammatory lesions, post-acne macules, hyperactive sebum secretion',
    expectedSkinType: 'Oily',
    description: 'Seborrhea in central facial zone with active microbial microcomedones and follicular congestion. Requires lipophilic follicular clearing and antimicrobial stabilization without stripping lipid bilayer.'
  },
  {
    id: 'preset-aria',
    name: 'Aria Sterling',
    age: 52,
    gender: 'Female',
    tagline: 'Glogau Type III Photoaging, Static Rhytids & Loss of Dermal Elasticity',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1080&q=80',
    concern: 'Periorbital crow\'s feet, deep glabellar furrows, dermal thinning, hyperpigmentation',
    expectedSkinType: 'Dry',
    description: 'Photo-damaged mature dermis displaying reduced glycosaminoglycan synthesis, solar lentigines, and infraorbital hollowing. Candidate for bio-active retinoid stimulation and dual-peptide matrix renewal.'
  },
  {
    id: 'preset-devon',
    name: 'Devon Lin',
    age: 29,
    gender: 'Non-binary',
    tagline: 'Periorbital Microcirculation Stasis, Tear Trough & Dull Radiance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
    fullImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1080&q=80',
    concern: 'Deep venous infraorbital shadows, volume deficit in tear troughs, uneven skin tone',
    expectedSkinType: 'Combination',
    description: 'Mild dehydration lines with vascular pooling beneath thin lower eyelid skin. Normal barrier function with regional moisture deficits in periorbital and malar apex areas.'
  }
];
