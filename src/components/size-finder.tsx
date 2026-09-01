'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// Sizing calculation helper (Objective brands sizing guidelines)
interface SizeRecommendation {
  compression: string;
  hoodie: string;
  pants: string;
  shorts: string;
  oversize: string;
}

// Sizing calculation helper (Objective brands sizing guidelines)
function calculateAllRecommendedSizes(
  gender: 'hombre' | 'mujer',
  heightCm: number,
  weightLbs: number
): SizeRecommendation {
  if (gender === 'hombre') {
    // ----------------------------------------------------
    // MEN'S SIZING LOGIC
    // ----------------------------------------------------
    
    // 1. Playera de Compresión (Compression Shirt)
    let compression = 'M';
    if (heightCm < 165) {
      compression = weightLbs < 130 ? 'XS' : 'S';
    } else if (heightCm >= 165 && heightCm < 170) {
      compression = weightLbs >= 155 ? 'M' : 'S';
    } else if (heightCm >= 170 && heightCm <= 180) {
      if (weightLbs < 140) {
        compression = 'S';
      } else if (weightLbs >= 175) {
        compression = 'L';
      } else {
        compression = 'M'; // User: 178-180cm, 160 lbs -> M
      }
    } else if (heightCm > 180 && heightCm <= 190) {
      if (weightLbs < 170) {
        compression = 'M';
      } else if (weightLbs >= 200) {
        compression = 'XL';
      } else {
        compression = 'L';
      }
    } else { // > 190
      compression = weightLbs >= 195 ? 'XL' : 'L';
    }

    // 2. Hoodies / Sudaderas
    let hoodie = 'M';
    if (heightCm < 160) {
      hoodie = weightLbs < 125 ? 'XS' : 'S';
    } else if (heightCm >= 160 && heightCm <= 176) {
      if (weightLbs < 130) {
        hoodie = 'XS';
      } else if (weightLbs >= 165) {
        hoodie = 'M';
      } else {
        hoodie = 'S';
      }
    } else if (heightCm >= 177 && heightCm <= 185) {
      // User is 178-180cm and 160 lbs -> He wears S.
      if (weightLbs < 165) {
        hoodie = 'S';
      } else if (weightLbs >= 195) {
        hoodie = 'L';
      } else {
        hoodie = 'M';
      }
    } else { // > 185
      if (weightLbs < 180) {
        hoodie = 'M';
      } else if (weightLbs >= 215) {
        hoodie = 'XL';
      } else {
        hoodie = 'L';
      }
    }

    // 3. Pants
    let pants = 'M';
    if (heightCm < 165) {
      pants = weightLbs < 130 ? 'XS' : 'S';
    } else if (heightCm >= 165 && heightCm < 170) {
      pants = weightLbs >= 155 ? 'M' : 'S';
    } else if (heightCm >= 170 && heightCm <= 180) {
      // User: 178-180cm, 160 lbs -> S
      if (weightLbs < 140) {
        pants = 'XS';
      } else if (weightLbs >= 180) {
        pants = 'M';
      } else {
        pants = 'S';
      }
    } else if (heightCm > 180 && heightCm <= 188) {
      if (weightLbs < 165) {
        pants = 'S';
      } else if (weightLbs >= 200) {
        pants = 'L';
      } else {
        pants = 'M';
      }
    } else { // > 188
      if (weightLbs < 180) {
        pants = 'M';
      } else if (weightLbs >= 215) {
        pants = 'XL';
      } else {
        pants = 'L';
      }
    }

    // 4. Shorts
    let shorts = 'M';
    if (heightCm < 165) {
      shorts = weightLbs < 130 ? 'XS' : 'S';
    } else if (heightCm >= 165 && heightCm < 172) {
      shorts = weightLbs >= 155 ? 'M' : 'S';
    } else if (heightCm >= 172 && heightCm <= 182) {
      if (weightLbs < 140) {
        shorts = 'XS';
      } else if (weightLbs >= 180) {
        shorts = 'L';
      } else if (weightLbs < 165) {
        shorts = 'S';
      } else {
        shorts = 'M';
      }
    } else { // > 182
      if (weightLbs < 170) {
        shorts = 'M';
      } else if (weightLbs >= 200) {
        shorts = 'XL';
      } else {
        shorts = 'L';
      }
    }

    // 5. Oversize Shirts / Playera Normal
    let oversize = 'M';
    if (heightCm < 165) {
      oversize = weightLbs < 130 ? 'XS' : 'S';
    } else if (heightCm >= 165 && heightCm <= 172) {
      if (weightLbs < 135) {
        oversize = 'XS';
      } else if (weightLbs >= 160) {
        oversize = 'M';
      } else {
        oversize = 'S';
      }
    } else if (heightCm >= 173 && heightCm <= 182) {
      if (weightLbs < 150) {
        oversize = 'S';
      } else if (weightLbs >= 185) {
        oversize = 'L';
      } else {
        oversize = 'M';
      }
    } else if (heightCm > 182 && heightCm <= 190) {
      if (weightLbs < 175) {
        oversize = 'M';
      } else if (weightLbs >= 210) {
        oversize = 'XL';
      } else {
        oversize = 'L';
      }
    } else { // > 190
      oversize = weightLbs >= 190 ? 'XL' : 'L';
    }

    return { compression, hoodie, pants, shorts, oversize };
  } else {
    // ----------------------------------------------------
    // WOMEN'S SIZING LOGIC (Adjusted proportionally)
    // ----------------------------------------------------
    
    // 1. Playera de Compresión / Tops Deportivos (Mujer)
    let compression = 'M';
    if (heightCm < 150) {
      compression = weightLbs < 100 ? 'XS' : 'S';
    } else if (heightCm >= 150 && heightCm < 160) {
      if (weightLbs < 110) {
        compression = 'XS';
      } else if (weightLbs >= 130) {
        compression = 'M';
      } else {
        compression = 'S';
      }
    } else if (heightCm >= 160 && heightCm <= 170) {
      if (weightLbs < 120) {
        compression = 'S';
      } else if (weightLbs >= 145) {
        compression = 'L';
      } else {
        compression = 'M';
      }
    } else {
      if (weightLbs < 140) {
        compression = 'M';
      } else if (weightLbs >= 165) {
        compression = 'XL';
      } else {
        compression = 'L';
      }
    }

    // 2. Hoodies / Sudaderas (Mujer)
    let hoodie = 'M';
    if (heightCm < 150) {
      hoodie = weightLbs < 100 ? 'XS' : 'S';
    } else if (heightCm >= 150 && heightCm <= 162) {
      if (weightLbs < 115) {
        hoodie = 'XS';
      } else if (weightLbs >= 135) {
        hoodie = 'M';
      } else {
        hoodie = 'S';
      }
    } else if (heightCm >= 163 && heightCm <= 172) {
      if (weightLbs < 125) {
        hoodie = 'S';
      } else if (weightLbs >= 150) {
        hoodie = 'L';
      } else {
        hoodie = 'M';
      }
    } else {
      if (weightLbs < 140) {
        hoodie = 'M';
      } else if (weightLbs >= 170) {
        hoodie = 'XL';
      } else {
        hoodie = 'L';
      }
    }

    // 3. Pants / Leggings (Mujer)
    let pants = 'M';
    if (heightCm < 150) {
      pants = weightLbs < 100 ? 'XS' : 'S';
    } else if (heightCm >= 150 && heightCm < 160) {
      if (weightLbs < 110) {
        pants = 'XS';
      } else if (weightLbs >= 130) {
        pants = 'M';
      } else {
        pants = 'S';
      }
    } else if (heightCm >= 160 && heightCm <= 170) {
      if (weightLbs < 125) {
        pants = 'S';
      } else if (weightLbs >= 145) {
        pants = 'L';
      } else {
        pants = 'M';
      }
    } else {
      if (weightLbs < 140) {
        pants = 'M';
      } else if (weightLbs >= 165) {
        pants = 'XL';
      } else {
        pants = 'L';
      }
    }

    // 4. Shorts (Mujer)
    let shorts = 'M';
    if (heightCm < 150) {
      shorts = weightLbs < 100 ? 'XS' : 'S';
    } else if (heightCm >= 150 && heightCm < 160) {
      if (weightLbs < 110) {
        shorts = 'XS';
      } else if (weightLbs >= 130) {
        shorts = 'M';
      } else {
        shorts = 'S';
      }
    } else if (heightCm >= 160 && heightCm <= 170) {
      if (weightLbs < 125) {
        shorts = 'S';
      } else if (weightLbs >= 145) {
        shorts = 'L';
      } else {
        shorts = 'M';
      }
    } else {
      if (weightLbs < 140) {
        shorts = 'M';
      } else if (weightLbs >= 165) {
        shorts = 'XL';
      } else {
        shorts = 'L';
      }
    }

    // 5. Oversize Shirts / Playera Normal (Mujer)
    let oversize = 'M';
    if (heightCm < 150) {
      oversize = weightLbs < 100 ? 'XS' : 'S';
    } else if (heightCm >= 150 && heightCm < 160) {
      if (weightLbs < 110) {
        oversize = 'XS';
      } else if (weightLbs >= 130) {
        oversize = 'M';
      } else {
        oversize = 'S';
      }
    } else if (heightCm >= 160 && heightCm <= 170) {
      if (weightLbs < 120) {
        oversize = 'S';
      } else if (weightLbs >= 145) {
        oversize = 'L';
      } else {
        oversize = 'M';
      }
    } else {
      if (weightLbs < 140) {
        oversize = 'M';
      } else if (weightLbs >= 165) {
        oversize = 'XL';
      } else {
        oversize = 'L';
      }
    }

    return { compression, hoodie, pants, shorts, oversize };
  }
}

const SizeFinder = () => {
  // Form states
  const [gender, setGender] = useState<'hombre' | 'mujer'>('hombre');
  const [height, setHeight] = useState<number>(178); // set default close to user example
  const [weight, setWeight] = useState<number>(160); // set default close to user example
  const [garmentType, setGarmentType] = useState<keyof SizeRecommendation>('compression');
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const router = useRouter();

  // Sizing calculation for all garments
  const recommendedSizes = useMemo(() => {
    return calculateAllRecommendedSizes(gender, height, weight);
  }, [gender, height, weight]);

  const recommendedSize = recommendedSizes[garmentType];

  const handleCalculate = () => {
    if (isRedirecting) return;
    setHasCalculated(true);
    setIsRedirecting(true);
    setTimeout(() => {
      router.push(`/recomendaciones?gender=${gender}&selectedType=${garmentType}&compression=${recommendedSizes.compression}&hoodie=${recommendedSizes.hoodie}&pants=${recommendedSizes.pants}&shorts=${recommendedSizes.shorts}&oversize=${recommendedSizes.oversize}`);
      setTimeout(() => setIsRedirecting(false), 1000);
    }, 2000);
  };

  const garmentLabels: Record<keyof SizeRecommendation, string> = {
    compression: 'Playera de Compresión',
    hoodie: 'Hoodie / Sudadera',
    pants: 'Pants',
    shorts: 'Shorts',
    oversize: 'Playera Oversize / Regular'
  };

  return (
    <section id="size-finder-section" className="py-16 relative overflow-hidden bg-transparent border-t border-zinc-900">
      {/* Red ambient background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-8 sm:w-12 bg-red-600/40" />
            <span className="text-red-600 font-bold tracking-[0.4em] text-[10px] uppercase">Ajuste Perfecto</span>
            <div className="h-px w-8 sm:w-12 bg-red-600/40" />
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter">
            ENCONTRAR <span className="text-red-600 drop-shadow-[0_0_15px_rgba(229,0,0,0.4)]">ROPA PARA MI</span>
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm sm:text-base mt-3">
            Ingresa tu altura, peso y tipo de prenda para calcular tu talla recomendada exacta y ver productos que te queden a la perfección.
          </p>
        </div>

        {/* Interactive Form Card */}
        <div className="max-w-4xl mx-auto bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Gender Selector */}
              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Género</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled={isRedirecting}
                    onClick={() => setGender('hombre')}
                    className={`py-3 px-6 rounded-xl border font-bold text-sm tracking-wide transition-all ${
                      gender === 'hombre'
                        ? 'border-red-600 bg-red-950/20 text-white shadow-[0_0_15px_rgba(220,38,38,0.15)]'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                    } ${isRedirecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Hombre
                  </button>
                  <button
                    type="button"
                    disabled={isRedirecting}
                    onClick={() => setGender('mujer')}
                    className={`py-3 px-6 rounded-xl border font-bold text-sm tracking-wide transition-all ${
                      gender === 'mujer'
                        ? 'border-red-600 bg-red-950/20 text-white shadow-[0_0_15px_rgba(220,38,38,0.15)]'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                    } ${isRedirecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Mujer
                  </button>
                </div>
              </div>

              {/* Garment Selector */}
              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Tipo de Prenda</label>
                <select
                  disabled={isRedirecting}
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value as keyof SizeRecommendation)}
                  className="w-full py-3 px-4 rounded-xl border border-zinc-800 bg-zinc-900/80 text-white font-bold text-sm focus:outline-none focus:border-red-600 transition-all cursor-pointer"
                >
                  {Object.entries(garmentLabels).map(([key, label]) => (
                    <option key={key} value={key} className="bg-zinc-950">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Height Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Altura</label>
                  <span className="text-white font-mono font-bold text-lg">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="210"
                  disabled={isRedirecting}
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className={`w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none ${isRedirecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono">
                  <span>140 cm</span>
                  <span>175 cm</span>
                  <span>210 cm</span>
                </div>
              </div>

              {/* Weight Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Peso</label>
                  <span className="text-white font-mono font-bold text-lg">{weight} lbs</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="260"
                  disabled={isRedirecting}
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className={`w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none ${isRedirecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono">
                  <span>80 lbs</span>
                  <span>170 lbs</span>
                  <span>260 lbs</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCalculate}
                disabled={isRedirecting}
                className={`w-full py-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black tracking-widest transition-all rounded-xl hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] uppercase italic text-sm mt-6 flex items-center justify-center gap-2 ${
                  isRedirecting ? 'opacity-80 cursor-wait' : ''
                }`}
              >
                {isRedirecting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Buscando prendas en talla {recommendedSize}...
                  </>
                ) : (
                  `Buscar ${garmentLabels[garmentType]} Talla ${recommendedSize}`
                )}
              </button>
            </div>

            {/* Results Display */}
            <div className="flex flex-col items-center justify-center p-6 min-h-[360px] border border-zinc-900 bg-zinc-900/10 rounded-2xl text-center relative overflow-hidden w-full">
              <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
              
              {isRedirecting ? (
                <div className="flex flex-col items-center justify-center p-4 animate-pulse">
                  <div className="relative my-3 flex items-center justify-center w-28 h-28 rounded-full border border-red-600 bg-red-950/20 shadow-[0_0_30px_rgba(229,0,0,0.3)] z-10">
                    <span className="w-8 h-8 border-4 border-white/20 border-t-red-600 rounded-full animate-spin" />
                  </div>
                  <h3 className="text-white font-bold text-base mt-4 mb-2 italic">Ajustando a Talla {recommendedSize}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
                    Estamos seleccionando prendas ideales en talla {recommendedSize}. Redirigiendo...
                  </p>
                </div>
              ) : hasCalculated ? (
                <div className="w-full space-y-5">
                  <div>
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1 block">Talla Recomendada</span>
                    <h3 className="text-red-500 text-sm font-bold uppercase tracking-wider mb-2 italic">
                      {garmentLabels[garmentType]}
                    </h3>
                    
                    {/* Glowing animated size */}
                    <div className="relative my-3 mx-auto flex items-center justify-center w-24 h-24 rounded-full border border-red-600/30 bg-black/60 shadow-[0_0_30px_rgba(229,0,0,0.15)] z-10">
                      <span className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                        {recommendedSize}
                      </span>
                      <span className="absolute -inset-1 rounded-full border border-red-600/40 animate-ping opacity-25" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>

                  {/* Sizing profile breakdown */}
                  <div className="border-t border-zinc-900 pt-4 text-left w-full">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 block text-center">Tu Perfil Completo de Tallas</span>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {Object.entries(garmentLabels).map(([key, label]) => {
                        const isSelected = key === garmentType;
                        const sizeVal = recommendedSizes[key as keyof SizeRecommendation];
                        return (
                          <div
                            key={key}
                            onClick={() => !isRedirecting && setGarmentType(key as keyof SizeRecommendation)}
                            className={`flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer transition-all border ${
                              isSelected
                                ? 'bg-red-950/20 border-red-900/60 text-white font-bold'
                                : 'bg-black/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                            }`}
                          >
                            <span>{label}</span>
                            <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                              isSelected ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'
                            }`}>{sizeVal}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-zinc-500 text-[10px] leading-relaxed max-w-xs mx-auto">
                    Basado en las medidas oficiales de <span className="text-zinc-400 font-semibold">YoungLA</span> y <span className="text-zinc-400 font-semibold">Gymshark</span> para tu contextura física.
                  </p>

                  <button
                    type="button"
                    onClick={handleCalculate}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-xs rounded-lg tracking-wider transition-all uppercase italic shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                  >
                    Ver Catálogo Completo en Talla {recommendedSize}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="text-red-600/40 text-5xl mb-4">📐</div>
                  <h3 className="text-white font-bold text-base mb-2 italic">Perfil de Ajuste de Ropa</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
                    Ingresa tus especificaciones de altura, peso y tipo de prenda. Calcularemos tu talla recomendada y generaremos tu perfil completo de tallas para playeras, pants y sudaderas.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default SizeFinder;
