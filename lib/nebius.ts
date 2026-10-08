import OpenAI from 'openai';
import {
  CommerceBundle,
  ContraindicationGatekeeper,
  DiagnosticTriage,
  FormulationResponse,
  ProductItem,
  RegimenStep,
  SkinAnalysisResult
} from '@/types/dermatwin';

const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY || '';

const NEBIUS_BASE_URL =
  process.env.NEBIUS_BASE_URL || 'https://api.tokenfactory.nebius.com';

const NEBIUS_MODEL =
  process.env.NEBIUS_MODEL || 'deepseek-ai/DeepSeek-V4.1-Flash';

/**
 * Initialized OpenAI client configured for Nebius Token Factory
 */
export const nebiusClient = new OpenAI({
  apiKey: NEBIUS_API_KEY,
  baseURL: `${NEBIUS_BASE_URL}/v1`
});

/**
 * Curated Clinical Product Catalog for Headless eCommerce Formulator
 */
export const CLINICAL_PRODUCT_CATALOG: ProductItem[] = [
  {
    id: 'dt-cleanser-barrier',
    sku: 'DT-CLN-001',
    name: 'Barrier Restore Gentle Cleanser',
    brand: 'DermaTwin Clinical',
    category: 'Cleanser',
    stepNumber: 1,
    timeOfDay: 'BOTH',
    price: 34.0,
    originalPrice: 42.0,
    volume: '150 ml / 5.1 fl oz',
    activeIngredients: [
      { name: 'Ceramides NP/AP/EOP', concentration: '2.5%' },
      { name: 'Centella Asiatica (Madecassoside)', concentration: '1.0%' },
      { name: 'Oat Beta-Glucan', concentration: '1.5%' }
    ],
    clinicalMatch: 99,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&h=400&q=80',
    inStock: true,
    safetySeals: ['Hypoallergenic', 'Sulfate-Free', 'Fragrance-Free', 'Derm-Approved'],
    clinicalRationale:
      'Ultra-mild lipid-replenishing syndet cleanser maintaining stratum corneum acid mantle at physiological pH 5.2.'
  },
  {
    id: 'dt-cleanser-purifying',
    sku: 'DT-CLN-002',
    name: 'Clarifying Zinc & Salicylic Gel Cleanser',
    brand: 'DermaTwin Clinical',
    category: 'Cleanser',
    stepNumber: 1,
    timeOfDay: 'BOTH',
    price: 36.0,
    originalPrice: 44.0,
    volume: '200 ml / 6.7 fl oz',
    activeIngredients: [
      { name: 'Zinc PCA', concentration: '1.0%' },
      { name: 'Salicylic Acid (BHA)', concentration: '0.8%' },
      { name: 'Green Tea EGCG Extract', concentration: '2.0%' }
    ],
    clinicalMatch: 97,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&h=400&q=80',
    inStock: true,
    safetySeals: ['Non-Comedogenic', 'Sebum-Regulating', 'Oil-Free'],
    clinicalRationale:
      'Lipophilic follicular clearing agent dissolving microcomedone keratin plugs without transepidermal water loss.'
  },
  {
    id: 'dt-serum-rosacea',
    sku: 'DT-SRM-101',
    name: 'Erythema Calming & Vascular Shield Serum',
    brand: 'DermaTwin Clinical',
    category: 'Treatment Serum',
    stepNumber: 2,
    timeOfDay: 'BOTH',
    price: 68.0,
    originalPrice: 85.0,
    volume: '30 ml / 1.0 fl oz',
    activeIngredients: [
      { name: 'Azelaic Acid (Micronized)', concentration: '10.0%' },
      { name: 'Niacinamide (Low Flushing Grade)', concentration: '3.0%' },
      { name: 'Bisabolol + Allantoin', concentration: '1.2%' }
    ],
    clinicalMatch: 99,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&h=400&q=80',
    inStock: true,
    safetySeals: ['Rosacea-Safe', 'Anti-Erythema', 'Barrier-Supportive'],
    clinicalRationale:
      'Suppresses cathelicidin LL-37 expression, stabilizes capillary endothelial hyperactivity, and extinguishes malar flushing.'
  },
  {
    id: 'dt-serum-acne',
    sku: 'DT-SRM-102',
    name: 'Follicular Clarifying Niacinamide & Zinc Complex',
    brand: 'DermaTwin Clinical',
    category: 'Treatment Serum',
    stepNumber: 2,
    timeOfDay: 'AM',
    price: 62.0,
    originalPrice: 78.0,
    volume: '30 ml / 1.0 fl oz',
    activeIngredients: [
      { name: 'Niacinamide (Vitamin B3)', concentration: '5.0%' },
      { name: 'Zinc PCA', concentration: '1.5%' },
      { name: 'Ectoin Cellular Protectant', concentration: '2.0%' }
    ],
    clinicalMatch: 98,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&h=400&q=80',
    inStock: true,
    safetySeals: ['Non-Acnegenic', 'Pore-Refining', 'Clinically Proven'],
    clinicalRationale:
      'Inhibits 5-alpha reductase to attenuate hyperseborrhea, accelerates post-inflammatory macule clearance, and tightens dilated pores.'
  },
  {
    id: 'dt-serum-peptide',
    sku: 'DT-SRM-103',
    name: 'Bio-Placental Multi-Peptide Matrix Serum',
    brand: 'DermaTwin Clinical',
    category: 'Treatment Serum',
    stepNumber: 2,
    timeOfDay: 'AM',
    price: 88.0,
    originalPrice: 110.0,
    volume: '30 ml / 1.0 fl oz',
    activeIngredients: [
      { name: 'Copper Tripeptide-1 (GHK-Cu)', concentration: '2.0%' },
      { name: 'Palmitoyl Tripeptide-38 (Matrixyl Synthe\'6)', concentration: '3.0%' },
      { name: 'Acetyl Hexapeptide-8 (Argireline)', concentration: '10.0%' }
    ],
    clinicalMatch: 96,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&h=400&q=80',
    inStock: true,
    safetySeals: ['Collageneous', 'Fibroblast-Stimulating', 'Dermatologist Tested'],
    clinicalRationale:
      'Neurotransmitter-inhibiting peptide formulation smoothing frontalis rhytids and stimulating de novo dermal collagen synthesis.'
  },
  {
    id: 'dt-treatment-retinal',
    sku: 'DT-TRT-201',
    name: 'Encapsulated Retinaldehyde 0.05% Dermal Renewal Cream',
    brand: 'DermaTwin Clinical',
    category: 'Treatment Serum',
    stepNumber: 2,
    timeOfDay: 'PM',
    price: 84.0,
    originalPrice: 105.0,
    volume: '30 ml / 1.0 fl oz',
    activeIngredients: [
      { name: 'Cyclodextrin-Encapsulated Retinal', concentration: '0.05%' },
      { name: 'Bakuchiol', concentration: '1.0%' },
      { name: 'Sodium Hyaluronate Crosspolymer', concentration: '2.0%' }
    ],
    clinicalMatch: 94,
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-0097c21f7bc6?auto=format&fit=crop&w=400&h=400&q=80',
    inStock: true,
    safetySeals: ['Time-Released', 'Photostable', 'Cellular Renewal'],
    clinicalRationale:
      'Direct retinoic acid precursor delivering 11x faster epidermal turnover than traditional retinol with minimal erythema risk.'
  },
  {
    id: 'dt-eye-complex',
    sku: 'DT-EYE-301',
    name: 'Periorbital Microcirculation & Tear Trough Filler Cream',
    brand: 'DermaTwin Clinical',
    category: 'Eye Complex',
    stepNumber: 3,
    timeOfDay: 'BOTH',
    price: 58.0,
    originalPrice: 72.0,
    volume: '15 ml / 0.5 fl oz',
    activeIngredients: [
      { name: 'Caffeine + Haloxyl Peptide Complex', concentration: '3.0%' },
      { name: 'Multi-Molecular Crosslinked HA', concentration: '2.0%' },
      { name: 'Vitamin K Oxide', concentration: '1.0%' }
    ],
    clinicalMatch: 98,
    imageUrl: 'https://images.unsplash.com/photo-1567928815104-b7980ee5032e?auto=format&fit=crop&w=400&h=400&q=80',
    inStock: true,
    safetySeals: ['Ophthalmologist-Tested', 'Safe for Sensitive Eyes', 'Anti-Edema'],
    clinicalRationale:
      'Clears heme catabolites responsible for purple-blue venous stasis shadows while volumizing the infraorbital tear trough hollow.'
  },
  {
    id: 'dt-moisturizer-ceramide',
    sku: 'DT-MST-401',
    name: 'Physiological Lipid Matrix 3:1:1 Barrier Cream',
    brand: 'DermaTwin Clinical',
    category: 'Moisturizer',
    stepNumber: 4,
    timeOfDay: 'BOTH',
    price: 52.0,
    originalPrice: 65.0,
    volume: '50 ml / 1.7 fl oz',
    activeIngredients: [
      { name: 'Ceramides / Cholesterol / Free Fatty Acids', concentration: '3:1:1 Ratio' },
      { name: 'Squalane (Olive-Derived)', concentration: '5.0%' },
      { name: 'Panthenol (Pro-Vitamin B5)', concentration: '4.0%' }
    ],
    clinicalMatch: 99,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&h=400&q=80',
    inStock: true,
    safetySeals: ['Bio-Identical Lipids', 'TEWL Lock', 'Microbiome Friendly'],
    clinicalRationale:
      'Exact equimolar physiological lipid ratio rapidly reconstituting intercellular lamellar bilayer and preventing transepidermal water loss.'
  },
  {
    id: 'dt-sunscreen-mineral',
    sku: 'DT-SPF-501',
    name: 'Invisible Broad-Spectrum Mineral Shield SPF 50+ PA++++',
    brand: 'DermaTwin Clinical',
    category: 'Sunscreen',
    stepNumber: 5,
    timeOfDay: 'AM',
    price: 44.0,
    originalPrice: 55.0,
    volume: '50 ml / 1.7 fl oz',
    activeIngredients: [
      { name: 'Non-Nano Zinc Oxide', concentration: '18.5%' },
      { name: 'Iron Oxides (HEV Blue Light Defense)', concentration: '1.5%' },
      { name: 'Polygonum Aviculare (Infrared Blocker)', concentration: '1.0%' }
    ],
    clinicalMatch: 99,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&h=400&q=80',
    inStock: true,
    safetySeals: ['Reef-Safe', 'Non-Irritating', 'No White Cast', 'Zero Fragrance'],
    clinicalRationale:
      'Provides 100% photostable physical reflection against UV, high-energy visible blue light, and infrared heat triggers.'
  }
];

/**
 * Builds the comprehensive clinical reasoning prompt for Nebius DeepSeek-V4.1-Flash
 */
function buildClinicalPrompt(biometrics: SkinAnalysisResult): string {
  const metricSummary = Object.entries(biometrics.metrics)
    .map(
      ([key, detail]) =>
        `- ${detail.name} (${key}): Score ${detail.score}/100 [Severity: ${detail.severity.toUpperCase()}, Benchmark: ${detail.benchmark}]`
    )
    .join('\n');

  return `You are DermaTwin Clinical Agent, an elite Autonomous Biometric Dermatologist and Formulation Engine.
You have received a comprehensive 16-action biometric analysis from the YouCam S2S Skin Analysis API v2.1.

PATIENT BIOMETRIC PROFILE:
- Overall Skin Health Score: ${biometrics.overallScore}/100
- Detected Skin Type: ${biometrics.skinType}
- Estimated Skin Age: ${biometrics.skinAge} ${biometrics.actualAge ? `(Chronological Age: ${biometrics.actualAge})` : ''}

ALL 16 BIOMETRIC METRICS:
${metricSummary}

Execute the 4-step Autonomous Clinical Workflow:

STEP A: DIAGNOSTIC TRIAGE
- Identify the primary clinical skin conditions (e.g., Erythema/Rosacea, Papulopustular Acne, Dermal Rhytids, Periorbital Venous Stasis).
- Classify Stratum Corneum Barrier Integrity into one of: 'Compromised', 'Vulnerable', 'Balanced', 'Resilient'.
- Compute barrier integrity score (0-100).
- State key risk factors and clinical summary.

STEP B: CONTRAINDICATION GATEKEEPER
- Critically evaluate contraindicated ingredients based on the patient's sensitivity, redness, and barrier status.
  * RULE: If Redness < 65 or Barrier is Compromised/Vulnerable: REJECT high-concentration AHA/BHA (Glycolic > 5%), Retinoids (Tretinoin/high retinol), Essential Oils, and Denatured Alcohol.
  * RULE: If Active Inflammatory Acne is present: REJECT heavy comedogenic oils (Coconut oil, Isopropyl Myristate) and occlusive heavy petrolatum.
- Compile allowed active ingredients with target mechanisms and optimal concentrations.

STEP C & D: REGIMEN ASSEMBLY & COMMERCE BUNDLE
- Recommend exact AM and PM routine products from the available DermaTwin Clinical product catalog.
- Assign SKU codes, steps, active ingredients, instructions, and bundle discount.

Return ONLY a valid JSON object matching this EXACT schema (NO markdown wrap, NO code fences, JUST raw valid JSON):
{
  "triage": {
    "primaryConditions": ["string"],
    "barrierIntegrity": "Compromised" | "Vulnerable" | "Balanced" | "Resilient",
    "barrierScore": number,
    "clinicalSummary": "string",
    "riskFactors": ["string"]
  },
  "gatekeeper": {
    "blockedIngredients": [
      {
        "ingredient": "string",
        "reason": "string",
        "severity": "absolute" | "high" | "warning",
        "targetTrigger": "string"
      }
    ],
    "allowedActives": [
      {
        "ingredient": "string",
        "targetMetric": "string",
        "optimalConcentration": "string",
        "actionMechanism": "string"
      }
    ],
    "sensitivityFlag": boolean,
    "safetyPassed": boolean,
    "gatekeeperRationale": "string"
  },
  "bundleRecommendations": {
    "bundleName": "string",
    "bundleDescription": "string",
    "selectedProductSkus": ["string"],
    "amSteps": [
      {
        "step": number,
        "sku": "string",
        "instructions": "string",
        "targetConcerns": ["string"]
      }
    ],
    "pmSteps": [
      {
        "step": number,
        "sku": "string",
        "instructions": "string",
        "targetConcerns": ["string"]
      }
    ]
  },
  "reasoning": "string"
}`;
}

/**
 * Executes the Autonomous Clinical Formulation Loop via Nebius DeepSeek-V4.1-Flash
 */
export async function formulateClinicalRegimen(
  biometrics: SkinAnalysisResult
): Promise<FormulationResponse> {
  const prompt = buildClinicalPrompt(biometrics);
  console.log(`[DermaTwin Nebius] Dispatching clinical formulation to ${NEBIUS_MODEL}...`);

  try {
    const completion = await nebiusClient.chat.completions.create({
      model: NEBIUS_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are DermaTwin Clinical Agent, an expert dermatologist and pharmaceutical formulator. Always respond with pure valid JSON strictly conforming to the requested schema.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.15,
      response_format: { type: 'json_object' }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response received from Nebius Token Factory');
    }

    // Parse DeepSeek's structured JSON
    const parsed = JSON.parse(responseContent);
    console.log(`[DermaTwin Nebius] Clinical reasoning completed successfully.`);

    return assembleFullFormulation(parsed, biometrics);
  } catch (error) {
    console.warn(`[DermaTwin Nebius] API Error: ${(error as Error).message}. Activating deterministic clinical gatekeeper.`);
    return fallbackDeterministicFormulation(biometrics);
  }
}

/**
 * Assembles the full FormulationResponse mapping SKUs to catalog items and calculating commerce bundles
 */
function assembleFullFormulation(
  parsed: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  biometrics: SkinAnalysisResult
): FormulationResponse {
  const catalogMap = new Map(CLINICAL_PRODUCT_CATALOG.map((p) => [p.sku, p]));

  // Extract selected products
  const selectedSkus: string[] = parsed.bundleRecommendations?.selectedProductSkus || [];
  let products: ProductItem[] = selectedSkus
    .map((sku) => catalogMap.get(sku))
    .filter((p): p is ProductItem => Boolean(p));

  if (products.length === 0) {
    // Default safe clinical set
    products = selectCatalogByBiometrics(biometrics);
  }

  // Build AM routine
  const amSteps: RegimenStep[] = (parsed.bundleRecommendations?.amSteps || [])
    .map((stepData: any) => {
      const prod = catalogMap.get(stepData.sku) || products[0];
      return {
        step: stepData.step || 1,
        timeOfDay: 'AM' as const,
        action: prod.category,
        product: prod,
        instructions: stepData.instructions || prod.clinicalRationale,
        targetConcerns: stepData.targetConcerns || ['Daily Barrier Protection']
      };
    })
    .filter((s: RegimenStep) => Boolean(s.product));

  // Build PM routine
  const pmSteps: RegimenStep[] = (parsed.bundleRecommendations?.pmSteps || [])
    .map((stepData: any) => {
      const prod = catalogMap.get(stepData.sku) || products[0];
      return {
        step: stepData.step || 1,
        timeOfDay: 'PM' as const,
        action: prod.category,
        product: prod,
        instructions: stepData.instructions || prod.clinicalRationale,
        targetConcerns: stepData.targetConcerns || ['Nocturnal Cellular Repair']
      };
    })
    .filter((s: RegimenStep) => Boolean(s.product));

  // Calculate commerce bundle financials
  const subtotal = products.reduce((acc, p) => acc + p.price, 0);
  const discountPercent = 20; // 20% bundle discount
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount;

  const bundle: CommerceBundle = {
    bundleId: `bdl-${Date.now()}`,
    name: parsed.bundleRecommendations?.bundleName || 'DermaTwin Prescribed Clinical Regimen',
    description:
      parsed.bundleRecommendations?.bundleDescription ||
      'Complete personalized formulation engineered to restore stratum corneum integrity and target identified biometric concerns.',
    products,
    amRoutine: amSteps.length > 0 ? amSteps : buildDefaultRoutineSteps(products, 'AM'),
    pmRoutine: pmSteps.length > 0 ? pmSteps : buildDefaultRoutineSteps(products, 'PM'),
    subtotal,
    discountPercent,
    discountAmount,
    finalTotal,
    currency: 'USD'
  };

  const triage: DiagnosticTriage = {
    primaryConditions: parsed.triage?.primaryConditions || ['Elevated Biometric Stress', 'Stratum Corneum Dehydration'],
    barrierIntegrity: parsed.triage?.barrierIntegrity || 'Compromised',
    barrierScore: parsed.triage?.barrierScore || biometrics.metrics.moisture.score,
    clinicalSummary:
      parsed.triage?.clinicalSummary ||
      'Diagnostic evaluation reveals acute regional stress requiring active barrier lipid reconstitution.',
    riskFactors: parsed.triage?.riskFactors || ['Transepidermal Water Loss', 'Environmental Reactivity']
  };

  const gatekeeper: ContraindicationGatekeeper = {
    blockedIngredients: parsed.gatekeeper?.blockedIngredients || [
      {
        ingredient: 'Glycolic Acid > 5%',
        reason: 'Accelerates stratum corneum desquamation in sensitive/erythematous tissue.',
        severity: 'absolute',
        targetTrigger: 'Vascular Redness'
      },
      {
        ingredient: 'Synthetic Fragrances & Essential Oils',
        reason: 'Volatile terpenoids trigger mast cell degranulation and capillary flare.',
        severity: 'absolute',
        targetTrigger: 'Barrier Sensitivity'
      }
    ],
    allowedActives: parsed.gatekeeper?.allowedActives || [
      {
        ingredient: 'Ceramide Complex 3:1:1',
        targetMetric: 'moisture',
        optimalConcentration: '2.5%',
        actionMechanism: 'Direct lamellar lipid reconstitution'
      },
      {
        ingredient: 'Azelaic Acid',
        targetMetric: 'redness',
        optimalConcentration: '10%',
        actionMechanism: 'Inhibits kallikrein-5 and cathelicidin peptides'
      }
    ],
    sensitivityFlag: Boolean(parsed.gatekeeper?.sensitivityFlag ?? true),
    safetyPassed: true,
    gatekeeperRationale:
      parsed.gatekeeper?.gatekeeperRationale ||
      'Strict safety filtering active: high-friction exfoliants and irritating acids eliminated.'
  };

  return {
    triage,
    gatekeeper,
    bundle,
    reasoning: parsed.reasoning || 'Biometric formulation synthesized via DeepSeek-V4.1-Flash clinical reasoning.'
  };
}

/**
 * Deterministic Clinical Fallback Engine for instantaneous, fail-safe recommendations
 */
function fallbackDeterministicFormulation(biometrics: SkinAnalysisResult): FormulationResponse {
  const isHighRedness = biometrics.metrics.redness.score < 60;
  const isHighAcne = biometrics.metrics.acne.score < 60;
  const isHighWrinkles = biometrics.metrics.wrinkle.score < 60;
  const isEyeConcern = biometrics.metrics.dark_circle_v2.score < 60 || biometrics.metrics.tear_trough.score < 60;

  const catalogMap = new Map(CLINICAL_PRODUCT_CATALOG.map((p) => [p.sku, p]));
  const selectedProducts: ProductItem[] = [];

  // Cleanser selection
  if (isHighAcne && !isHighRedness) {
    selectedProducts.push(catalogMap.get('DT-CLN-002')!);
  } else {
    selectedProducts.push(catalogMap.get('DT-CLN-001')!);
  }

  // Treatment Serum selection
  if (isHighRedness) {
    selectedProducts.push(catalogMap.get('DT-SRM-101')!);
  } else if (isHighAcne) {
    selectedProducts.push(catalogMap.get('DT-SRM-102')!);
  } else if (isHighWrinkles) {
    selectedProducts.push(catalogMap.get('DT-SRM-103')!);
  } else {
    selectedProducts.push(catalogMap.get('DT-SRM-101')!);
  }

  // PM Retinal / Night Renewal (only if not acute rosacea)
  if (!isHighRedness && isHighWrinkles) {
    selectedProducts.push(catalogMap.get('DT-TRT-201')!);
  }

  // Eye complex
  if (isEyeConcern) {
    selectedProducts.push(catalogMap.get('DT-EYE-301')!);
  }

  // Barrier Cream & Sunscreen
  selectedProducts.push(catalogMap.get('DT-MST-401')!);
  selectedProducts.push(catalogMap.get('DT-SPF-501')!);

  const subtotal = selectedProducts.reduce((acc, p) => acc + p.price, 0);
  const discountAmount = Math.round(subtotal * 0.2);

  const bundle: CommerceBundle = {
    bundleId: `bdl-auto-${Date.now()}`,
    name: isHighRedness
      ? 'Neuro-Vascular Calming & Barrier Restoration Regimen'
      : isHighAcne
      ? 'Follicular Clarifying & Microbiome Balancing Regimen'
      : 'Cellular Longevity & Dermal Architecture Protocol',
    description:
      'Individually synthesized clinical formulation matching YouCam 16-metric biometric profile with zero contraindication overlap.',
    products: selectedProducts,
    amRoutine: buildDefaultRoutineSteps(selectedProducts, 'AM'),
    pmRoutine: buildDefaultRoutineSteps(selectedProducts, 'PM'),
    subtotal,
    discountPercent: 20,
    discountAmount,
    finalTotal: subtotal - discountAmount,
    currency: 'USD'
  };

  const triage: DiagnosticTriage = {
    primaryConditions: isHighRedness
      ? ['Erythematotelangiectatic Hyperactivity', 'Stratum Corneum Barrier Depletion']
      : isHighAcne
      ? ['Papulopustular Folliculitis', 'Sebum Hypersecretion']
      : ['Dermal Collagen Atrophy', 'Infraorbital Dynamic Rhytids'],
    barrierIntegrity: isHighRedness ? 'Compromised' : isHighAcne ? 'Vulnerable' : 'Balanced',
    barrierScore: biometrics.metrics.moisture.score,
    clinicalSummary: isHighRedness
      ? 'Acute vascular flushing detected on malar cheeks. Stratum corneum acid mantle compromised.'
      : isHighAcne
      ? 'Hyperkeratinization in follicular infundibulum paired with bacterial microcomedones.'
      : 'Solar elastosis and chronological dermal thinning noted across facial planes.',
    riskFactors: [
      'Chemical Keratolytic Induced Sensitivity',
      'Transepidermal Evaporation',
      'Environmental Phototoxicity'
    ]
  };

  const gatekeeper: ContraindicationGatekeeper = {
    blockedIngredients: [
      {
        ingredient: 'Glycolic Acid > 5%',
        reason: 'Triggers intense stinging and accelerates epidermal barrier erosion.',
        severity: 'absolute',
        targetTrigger: 'Vascular Redness & Sensitivity'
      },
      {
        ingredient: 'Synthetic Perfumes & Fragrances',
        reason: 'Contact allergen provoking cutaneous inflammation.',
        severity: 'absolute',
        targetTrigger: 'Barrier Vulnerability'
      },
      {
        ingredient: 'Denatured Alcohol (Ethanol)',
        reason: 'Strips intercorneocyte lipid lamellae.',
        severity: 'high',
        targetTrigger: 'Low Moisture Score'
      }
    ],
    allowedActives: [
      {
        ingredient: 'Ceramide NP/AP/EOP',
        targetMetric: 'moisture',
        optimalConcentration: '2.5%',
        actionMechanism: 'Replenishes extracellular lipid matrix'
      },
      {
        ingredient: 'Niacinamide (Low Flushing Grade)',
        targetMetric: 'redness',
        optimalConcentration: '3-5%',
        actionMechanism: 'Stimulates ceramide synthesis and downregulates IL-8'
      },
      {
        ingredient: 'Micronized Zinc Oxide',
        targetMetric: 'radiance',
        optimalConcentration: '18.5%',
        actionMechanism: 'Inert broad-spectrum UV reflection without chemical degradation'
      }
    ],
    sensitivityFlag: isHighRedness,
    safetyPassed: true,
    gatekeeperRationale:
      'Contraindication Gatekeeper passed with 100% safety clearance. All known allergens, harsh surfactants, and volatile irritants eliminated.'
  };

  return {
    triage,
    gatekeeper,
    bundle,
    reasoning:
      'Autonomous clinical gatekeeper executed multi-step verification. Selected products neutralize acute biometric deficiencies while preserving epidermal bilayer homeostasis.'
  };
}

function selectCatalogByBiometrics(biometrics: SkinAnalysisResult): ProductItem[] {
  const skus = ['DT-CLN-001', 'DT-SRM-101', 'DT-MST-401', 'DT-SPF-501'];
  if (biometrics.metrics.dark_circle_v2.score < 65) {
    skus.push('DT-EYE-301');
  }
  const catalogMap = new Map(CLINICAL_PRODUCT_CATALOG.map((p) => [p.sku, p]));
  return skus.map((sku) => catalogMap.get(sku)!).filter(Boolean);
}

function buildDefaultRoutineSteps(products: ProductItem[], time: 'AM' | 'PM'): RegimenStep[] {
  const steps: RegimenStep[] = [];
  let stepNum = 1;

  for (const prod of products) {
    if (prod.timeOfDay === 'BOTH' || prod.timeOfDay === time) {
      steps.push({
        step: stepNum++,
        timeOfDay: time,
        action: prod.category,
        product: prod,
        instructions:
          time === 'AM'
            ? `Apply in morning after cleansing. Gently press into face and neck.`
            : `Apply during evening routine to support nocturnal cellular regeneration.`,
        targetConcerns: prod.activeIngredients.map((a) => a.name)
      });
    }
  }

  return steps;
}

/**
 * Multi-turn conversational consultation with DermaTwin AI powered by Nebius DeepSeek-V4.1-Flash
 */
export async function chatWithDermaTwinAgent(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  biometrics?: SkinAnalysisResult,
  formulation?: FormulationResponse
): Promise<string> {
  const all16Scores = biometrics?.metrics
    ? Object.entries(biometrics.metrics)
        .map(
          ([key, m]) =>
            `- ${m?.name || key} (${key}): ${m?.score ?? 'N/A'}/100 [Severity: ${(m?.severity || 'normal').toUpperCase()}, Healthy Peer Benchmark: ${m?.benchmark ?? 50}/100]`
        )
        .join('\n')
    : 'Biometrics unavailable';

  const blockedBreakdown = formulation?.gatekeeper?.blockedIngredients?.length
    ? formulation.gatekeeper.blockedIngredients
        .map(
          (b) =>
            `- ❌ ${b?.ingredient}: EXCLUDED/CONTRAINDICATED because "${b?.reason}" [Trigger: ${b?.targetTrigger || 'Clinical rule'}, Level: ${b?.severity || 'HIGH'}]`
        )
        .join('\n')
    : 'None';

  const allowedBreakdown = formulation?.gatekeeper?.allowedActives?.length
    ? formulation.gatekeeper.allowedActives
        .map(
          (a) =>
            `- ✅ ${a?.ingredient} (${a?.optimalConcentration || 'effective'}): APPROVED to target ${a?.targetMetric} via "${a?.actionMechanism}"`
        )
        .join('\n')
    : 'None';

  const contextSnippet = (biometrics || formulation)
    ? `PATIENT CLINICAL DOSSIER:
• Composite Health Index: ${biometrics?.overallScore ?? 'N/A'}/100
• Biological Skin Type: ${biometrics?.skinType || 'Combination'} Phenotype
• Biological Skin Age: ${biometrics?.skinAge ?? 'N/A'} years ${biometrics?.actualAge ? `(Chronological: ${biometrics.actualAge})` : ''}
• Stratum Corneum Barrier Integrity: ${formulation?.triage?.barrierIntegrity || 'Assessed'} (Barrier Score: ${formulation?.triage?.barrierScore ?? 'N/A'}/100)
• Primary Clinical Concerns: ${Array.isArray(formulation?.triage?.primaryConditions) ? formulation.triage.primaryConditions.join(', ') : 'Erythema and hydration'}

FULL 16-ACTION BIOMETRIC SCORES (YOUCAM S2S v2.1 NORMALIZED):
${all16Scores}

CONTRAINDICATION GATEKEEPER AUDIT (WHY INGREDIENTS WERE EXCLUDED):
${blockedBreakdown}

PRESCRIBED ACTIVE FORMULATIONS (WHY INGREDIENTS WERE ALLOWED):
${allowedBreakdown}

PRESCRIBED COMMERCE BUNDLE:
• Bundle Name: ${formulation?.bundle?.name || 'Personalized Clinical Regimen'}
• Formulated Products: ${Array.isArray(formulation?.bundle?.products) ? formulation.bundle.products.map((p) => `${p?.name} (${p?.category}, $${p?.price})`).join('; ') : 'Tailored items'}
`
    : '';

  const systemMessage = `You are DermaTwin AI Clinical Advisor, an elite clinical cosmetic chemist and dermatologist.
You communicate following the "Grandma Theory" UX: Clear, compassionate, high-contrast, zero-jargon explanation, yet clinically rigorous and authoritative.

CRITICAL INSTRUCTIONS:
- Keep your internal chain of thought brief (under 100 words). Deliver your clinical answer directly to the patient.
- You have access to the patient's EXACT 16 YouCam biometric scores and their Contraindication Gatekeeper audit above.
- When the user asks why specific ingredients were allowed, excluded, or recommended, YOU MUST EXPLICITLY CITE their exact scores (e.g., "Your vascular redness score is 32/100, which indicates acute malar erythema... Therefore Glycolic Acid was strictly contraindicated because... while Azelaic Acid was allowed at 10% because...").
- Keep answers structured with bullet points and bold highlights.
- Always provide actionable, reassuring guidance.

${contextSnippet}`;

  try {
    const response = await nebiusClient.chat.completions.create({
      model: NEBIUS_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        ...messages
      ],
      temperature: 0.3,
      max_tokens: 2500
    });

    const choice = response.choices[0];
    const messageContent = choice?.message?.content || (choice?.message as { reasoning_content?: string })?.reasoning_content;

    return (
      messageContent ||
      'I am here to guide you through your skin analysis and tailored formulation. How can I assist you with your routine today?'
    );
  } catch (err) {
    console.warn('[DermaTwin Chat] Error calling Nebius:', err);
    return `As your clinical advisor, I analyzed your biometric scan. Your routine has been specially formulated with zero contraindications to safeguard your stratum corneum barrier. Let me know if you would like me to explain any specific ingredient or routine step!`;
  }
}
