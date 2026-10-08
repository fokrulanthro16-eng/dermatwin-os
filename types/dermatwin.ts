export type BiometricAction =
  | 'acne'
  | 'dark_circle_v2'
  | 'droopy_lower_eyelid'
  | 'droopy_upper_eyelid'
  | 'eye_bag'
  | 'firmness'
  | 'moisture'
  | 'oiliness'
  | 'pore'
  | 'radiance'
  | 'redness'
  | 'age_spot'
  | 'texture'
  | 'wrinkle'
  | 'skin_type'
  | 'tear_trough';

export type MetricCategory = 'barrier' | 'aging' | 'tone' | 'periorbital';
export type SeverityLevel = 'optimal' | 'mild' | 'moderate' | 'severe';

export interface OverlayCoordinate {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  radius?: number;
  width?: number;
  height?: number;
  label?: string;
  severity?: SeverityLevel;
  type: BiometricAction;
}

export interface BiometricMetricDetail {
  id: BiometricAction;
  name: string;
  category: MetricCategory;
  score: number; // 0-100 normalized index (higher is better for positive metrics, or normalized health rating)
  rawScore?: number;
  severity: SeverityLevel;
  benchmark: number; // reference healthy peer benchmark (0-100)
  description: string;
  detectedCount?: number;
  unit?: string;
  coordinates: OverlayCoordinate[];
}

export interface SkinAnalysisResult {
  taskId: string;
  overallScore: number; // 0-100
  skinType: 'Dry' | 'Oily' | 'Combination' | 'Normal' | 'Sensitive';
  skinAge: number;
  actualAge?: number;
  metrics: Record<BiometricAction, BiometricMetricDetail>;
  timestamp: string;
  source: 'youcam-live' | 'clinical-engine';
  imageUrl: string;
  status: 'success' | 'partial' | 'error';
  errorMessage?: string;
}

export interface DiagnosticTriage {
  primaryConditions: string[];
  barrierIntegrity: 'Compromised' | 'Vulnerable' | 'Balanced' | 'Resilient';
  barrierScore: number;
  clinicalSummary: string;
  riskFactors: string[];
}

export interface BlockedIngredient {
  ingredient: string;
  reason: string;
  severity: 'absolute' | 'high' | 'warning';
  targetTrigger: string;
}

export interface AllowedActive {
  ingredient: string;
  targetMetric: string;
  optimalConcentration: string;
  actionMechanism: string;
}

export interface ContraindicationGatekeeper {
  blockedIngredients: BlockedIngredient[];
  allowedActives: AllowedActive[];
  sensitivityFlag: boolean;
  safetyPassed: boolean;
  gatekeeperRationale: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: 'Cleanser' | 'Treatment Serum' | 'Moisturizer' | 'Sunscreen' | 'Eye Complex' | 'Exfoliant';
  stepNumber: number;
  timeOfDay: 'AM' | 'PM' | 'BOTH';
  price: number;
  originalPrice?: number;
  volume: string;
  activeIngredients: Array<{ name: string; concentration: string }>;
  clinicalMatch: number; // 0-100
  imageUrl: string;
  inStock: boolean;
  safetySeals: string[];
  clinicalRationale: string;
}

export interface RegimenStep {
  step: number;
  timeOfDay: 'AM' | 'PM';
  action: string;
  product: ProductItem;
  instructions: string;
  targetConcerns: string[];
}

export interface CommerceBundle {
  bundleId: string;
  name: string;
  description: string;
  products: ProductItem[];
  amRoutine: RegimenStep[];
  pmRoutine: RegimenStep[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  finalTotal: number;
  currency: string;
}

export interface FormulationResponse {
  triage: DiagnosticTriage;
  gatekeeper: ContraindicationGatekeeper;
  bundle: CommerceBundle;
  reasoning: string;
}

export interface DiagnoseResponse {
  success: boolean;
  biometrics: SkinAnalysisResult;
  formulation: FormulationResponse;
  executionTimeMs: number;
  error?: string;
}

export interface ClinicalPreset {
  id: string;
  name: string;
  age: number;
  gender: string;
  tagline: string;
  avatarUrl: string;
  fullImageUrl: string;
  concern: string;
  expectedSkinType: 'Dry' | 'Oily' | 'Combination' | 'Normal' | 'Sensitive';
  description: string;
}
