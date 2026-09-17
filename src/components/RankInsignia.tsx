import React from 'react';
import { RankTierKey } from '../types';

export interface RankInsigniaProps {
  tier: RankTierKey | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showGlow?: boolean;
  className?: string;
  animate?: boolean;
}

// Size mappings in pixels
const SIZE_MAP = {
  xs: { width: 28, height: 32 },
  sm: { width: 42, height: 48 },
  md: { width: 68, height: 76 },
  lg: { width: 106, height: 118 },
  xl: { width: 148, height: 164 },
  '2xl': { width: 190, height: 210 },
};

/**
 * 3D Faceted Star Generator
 * Produces a game-tier chiseled 5-pointed star with illuminated & shadowed facets
 */
function render3DStar(
  cx: number, 
  cy: number, 
  outerR: number, 
  innerR: number, 
  lightColor: string, 
  shadowColor: string,
  keyPrefix: string
) {
  const points: { x: number; y: number }[] = [];
  const valleys: { x: number; y: number }[] = [];

  for (let i = 0; i < 5; i++) {
    // Outer point
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    points.push({
      x: cx + outerR * Math.cos(outerAngle),
      y: cy + outerR * Math.sin(outerAngle)
    });

    // Inner valley
    const innerAngle = (i * 72 - 90 + 36) * (Math.PI / 180);
    valleys.push({
      x: cx + innerR * Math.cos(innerAngle),
      y: cy + innerR * Math.sin(innerAngle)
    });
  }

  const facets: React.ReactElement[] = [];

  for (let i = 0; i < 5; i++) {
    const prevValley = valleys[(i + 4) % 5];
    const nextValley = valleys[i];
    const p = points[i];

    // Left facet (Light side)
    facets.push(
      <polygon
        key={`${keyPrefix}-facet-L-${i}`}
        points={`${cx},${cy} ${prevValley.x},${prevValley.y} ${p.x},${p.y}`}
        fill={lightColor}
      />
    );

    // Right facet (Shadow side)
    facets.push(
      <polygon
        key={`${keyPrefix}-facet-R-${i}`}
        points={`${cx},${cy} ${p.x},${p.y} ${nextValley.x},${nextValley.y}`}
        fill={shadowColor}
      />
    );
  }

  return <g key={keyPrefix}>{facets}</g>;
}

/**
 * 3D Beveled Chevron Generator
 * Renders a military-style ribbon chevron with light / shadow sides and beveled edges
 */
function render3DChevron(
  yCenter: number,
  span: number,
  thickness: number,
  lightFill: string,
  shadowFill: string,
  topBevelFill: string,
  key: string
) {
  const cx = 60;
  const leftX = cx - span;
  const rightX = cx + span;
  const armHeight = span * 0.46;

  // Left wing
  const leftWing = (
    <polygon
      key={`${key}-L`}
      points={`${cx},${yCenter} ${leftX},${yCenter - armHeight} ${leftX + 4},${yCenter - armHeight - thickness} ${cx},${yCenter - thickness}`}
      fill={lightFill}
    />
  );

  // Right wing
  const rightWing = (
    <polygon
      key={`${key}-R`}
      points={`${cx},${yCenter} ${cx},${yCenter - thickness} ${rightX - 4},${yCenter - armHeight - thickness} ${rightX},${yCenter - armHeight}`}
      fill={shadowFill}
    />
  );

  // Top highlight edge
  const topEdge = (
    <polyline
      key={`${key}-T`}
      points={`${leftX + 4},${yCenter - armHeight - thickness} ${cx},${yCenter - thickness} ${rightX - 4},${yCenter - armHeight - thickness}`}
      fill="none"
      stroke={topBevelFill}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );

  return (
    <g key={key}>
      {leftWing}
      {rightWing}
      {topEdge}
    </g>
  );
}

/**
 * Laurel Wreath Leaves Generator
 * Curves along the lower flanks of the hexagonal crest
 */
function renderLaurelWreath(
  leafFill: string, 
  leafShadow: string, 
  leafHighlight: string,
  density: 'sparse' | 'medium' | 'dense' = 'medium',
  prefix: string = 'wreath'
) {
  // Positions of leaf pairs along the curve on left side (mirrored to right)
  const leafConfigs = density === 'sparse' 
    ? [
        { cx: 34, cy: 88, rot: 35, s: 0.8 },
        { cx: 22, cy: 76, rot: 60, s: 0.85 },
        { cx: 16, cy: 62, rot: 80, s: 0.9 },
      ]
    : density === 'medium'
    ? [
        { cx: 40, cy: 94, rot: 25, s: 0.75 },
        { cx: 28, cy: 85, rot: 48, s: 0.85 },
        { cx: 18, cy: 72, rot: 70, s: 0.95 },
        { cx: 12, cy: 56, rot: 85, s: 1.0 },
        { cx: 12, cy: 40, rot: 98, s: 0.9 },
      ]
    : [
        // Dense: Full sprawling grand wreath (for Master / Diamond)
        { cx: 42, cy: 96, rot: 20, s: 0.8 },
        { cx: 32, cy: 90, rot: 40, s: 0.9 },
        { cx: 22, cy: 79, rot: 60, s: 1.0 },
        { cx: 14, cy: 65, rot: 78, s: 1.1 },
        { cx: 10, cy: 49, rot: 92, s: 1.15 },
        { cx: 11, cy: 33, rot: 105, s: 1.05 },
        { cx: 16, cy: 20, rot: 125, s: 0.9 },
      ];

  return (
    <g key={prefix} className="drop-shadow-md">
      {leafConfigs.map((cfg, idx) => {
        // Left Leaf
        const leftId = `${prefix}-leaf-L-${idx}`;
        const rightId = `${prefix}-leaf-R-${idx}`;

        return (
          <React.Fragment key={idx}>
            {/* Left Leaf Body */}
            <g transform={`translate(${cfg.cx}, ${cfg.cy}) rotate(${cfg.rot}) scale(${cfg.s})`}>
              <path
                d="M 0,0 C -5,-8 -12,-12 -8,-22 C -2,-18 5,-8 0,0 Z"
                fill={leafFill}
              />
              <path
                d="M 0,0 C -2,-8 -5,-12 -8,-22"
                stroke={leafShadow}
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M 0,0 C 2,-8 4,-14 -8,-22"
                stroke={leafHighlight}
                strokeWidth="0.8"
                fill="none"
              />
            </g>

            {/* Mirrored Right Leaf Body */}
            <g transform={`translate(${120 - cfg.cx}, ${cfg.cy}) scale(-1, 1) rotate(${cfg.rot}) scale(${cfg.s})`}>
              <path
                d="M 0,0 C -5,-8 -12,-12 -8,-22 C -2,-18 5,-8 0,0 Z"
                fill={leafFill}
              />
              <path
                d="M 0,0 C -2,-8 -5,-12 -8,-22"
                stroke={leafShadow}
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M 0,0 C 2,-8 4,-14 -8,-22"
                stroke={leafHighlight}
                strokeWidth="0.8"
                fill="none"
              />
            </g>
          </React.Fragment>
        );
      })}
    </g>
  );
}

export const RankInsignia: React.FC<RankInsigniaProps> = ({
  tier,
  size = 'md',
  showGlow = false,
  className = '',
  animate = false,
}) => {
  const normalizedTier = (tier || 'bronze').toLowerCase() as RankTierKey;
  const { width, height } = SIZE_MAP[size] || SIZE_MAP.md;

  // Tier color palettes matching the user's reference image
  // (Hexagonal 3D beveled shield + chiseled insignia)
  const palette = React.useMemo(() => {
    switch (normalizedTier) {
      case 'bronze':
        return {
          // Warm burnished copper & bronze
          rimTopLeft: '#F59E0B',
          rimTopRight: '#D97706',
          rimBottomRight: '#78350F',
          rimBottomLeft: '#92400E',
          rimHighlight: '#FDE68A',
          rimShadow: '#451A03',
          innerPlateStart: '#2A1708',
          innerPlateEnd: '#130B04',
          innerRidge: '#B45309',
          insigniaLight: '#FBBF24',
          insigniaShadow: '#B45309',
          insigniaHighlight: '#FFFBEB',
          laurelFill: '#D97706',
          laurelShadow: '#78350F',
          laurelHighlight: '#FDE68A',
          starLight: '#FDE047',
          starShadow: '#B45309',
          ambientGlow: 'rgba(217, 119, 6, 0.4)',
        };
      case 'silver':
        return {
          // Polished steel, chrome & silver (Row 1, Badge 2 in reference image)
          rimTopLeft: '#FFFFFF',
          rimTopRight: '#E2E8F0',
          rimBottomRight: '#475569',
          rimBottomLeft: '#64748B',
          rimHighlight: '#FFFFFF',
          rimShadow: '#1E293B',
          innerPlateStart: '#1E293B',
          innerPlateEnd: '#0A0E14',
          innerRidge: '#94A3B8',
          insigniaLight: '#F8FAFC',
          insigniaShadow: '#64748B',
          insigniaHighlight: '#FFFFFF',
          laurelFill: '#CBD5E1',
          laurelShadow: '#475569',
          laurelHighlight: '#FFFFFF',
          starLight: '#F1F5F9',
          starShadow: '#475569',
          ambientGlow: 'rgba(203, 213, 225, 0.35)',
        };
      case 'gold':
        return {
          // Radiant polished gold (Row 2, Badge 3 in reference image)
          rimTopLeft: '#FEF08A',
          rimTopRight: '#FBBF24',
          rimBottomRight: '#92400E',
          rimBottomLeft: '#B45309',
          rimHighlight: '#FFFBEB',
          rimShadow: '#451A03',
          innerPlateStart: '#3D2406',
          innerPlateEnd: '#140C03',
          innerRidge: '#F59E0B',
          insigniaLight: '#FDE047',
          insigniaShadow: '#B45309',
          insigniaHighlight: '#FFFBEB',
          laurelFill: '#F59E0B',
          laurelShadow: '#78350F',
          laurelHighlight: '#FEF08A',
          starLight: '#FACC15',
          starShadow: '#92400E',
          ambientGlow: 'rgba(245, 158, 11, 0.5)',
        };
      case 'platinum':
        return {
          // Frost platinum / Diamond Chrome (Row 1, Badge 4 in reference image)
          rimTopLeft: '#E0F2FE',
          rimTopRight: '#7DD3FC',
          rimBottomRight: '#0369A1',
          rimBottomLeft: '#0284C7',
          rimHighlight: '#FFFFFF',
          rimShadow: '#082F49',
          innerPlateStart: '#0C2033',
          innerPlateEnd: '#040B13',
          innerRidge: '#38BDF8',
          insigniaLight: '#BAE6FD',
          insigniaShadow: '#0284C7',
          insigniaHighlight: '#FFFFFF',
          laurelFill: '#7DD3FC',
          laurelShadow: '#0369A1',
          laurelHighlight: '#E0F2FE',
          starLight: '#E0F2FE',
          starShadow: '#0284C7',
          ambientGlow: 'rgba(56, 189, 248, 0.55)',
        };
      case 'diamond':
        return {
          // Luminous celestial diamond (Row 1, Badge 5 in reference image)
          rimTopLeft: '#E0E7FF',
          rimTopRight: '#A78BFA',
          rimBottomRight: '#4C1D95',
          rimBottomLeft: '#6D28D9',
          rimHighlight: '#FFFFFF',
          rimShadow: '#2E1065',
          innerPlateStart: '#1E1238',
          innerPlateEnd: '#0A0517',
          innerRidge: '#C084FC',
          insigniaLight: '#DDD6FE',
          insigniaShadow: '#6D28D9',
          insigniaHighlight: '#FFFFFF',
          laurelFill: '#C084FC',
          laurelShadow: '#4C1D95',
          laurelHighlight: '#EDE9FE',
          starLight: '#F5F3FF',
          starShadow: '#6D28D9',
          ambientGlow: 'rgba(192, 132, 252, 0.6)',
        };
      case 'master':
      default:
        return {
          // GRAND MASTER GOLDEN CREST (Bottom right in reference image!)
          rimTopLeft: '#FEF9C3',
          rimTopRight: '#FACC15',
          rimBottomRight: '#854D0E',
          rimBottomLeft: '#A16207',
          rimHighlight: '#FFFFFF',
          rimShadow: '#361D02',
          innerPlateStart: '#422006',
          innerPlateEnd: '#130801',
          innerRidge: '#F59E0B',
          insigniaLight: '#FDE047',
          insigniaShadow: '#B45309',
          insigniaHighlight: '#FFFBEB',
          laurelFill: '#FBBF24',
          laurelShadow: '#78350F',
          laurelHighlight: '#FEF08A',
          starLight: '#FDE047',
          starShadow: '#92400E',
          ambientGlow: 'rgba(250, 204, 21, 0.75)',
        };
    }
  }, [normalizedTier]);

  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className} ${
        animate ? 'hover:scale-105 transition-transform duration-300' : ''
      }`}
      style={{ width, height }}
    >
      {/* Optional Ambient Aura Glow */}
      {(showGlow || normalizedTier === 'master' || normalizedTier === 'diamond') && (
        <div 
          className="absolute inset-0 rounded-full blur-xl pointer-events-none -z-10 opacity-70 animate-pulse"
          style={{ backgroundColor: palette.ambientGlow }}
        />
      )}

      <svg
        viewBox="0 0 120 126"
        width={width}
        height={height}
        className="w-full h-full overflow-visible drop-shadow-xl"
      >
        <defs>
          {/* Outer Hex Rim Gradients */}
          <linearGradient id={`grad-rim-L-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.rimHighlight} />
            <stop offset="40%" stopColor={palette.rimTopLeft} />
            <stop offset="100%" stopColor={palette.rimBottomLeft} />
          </linearGradient>

          <linearGradient id={`grad-rim-R-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.rimTopRight} />
            <stop offset="70%" stopColor={palette.rimBottomRight} />
            <stop offset="100%" stopColor={palette.rimShadow} />
          </linearGradient>

          {/* Inner Recessed Plate Gradient */}
          <radialGradient id={`grad-plate-${uniqueId}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor={palette.innerPlateStart} />
            <stop offset="100%" stopColor={palette.innerPlateEnd} />
          </radialGradient>

          {/* Star Metal Shimmer */}
          <linearGradient id={`star-shimmer-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.starLight} />
            <stop offset="100%" stopColor={palette.starShadow} />
          </linearGradient>
        </defs>

        {/* 1. Laurel Wreath Underlay (Positioned behind shield for rich depth) */}
        {normalizedTier === 'silver' && (
          renderLaurelWreath(palette.laurelFill, palette.laurelShadow, palette.laurelHighlight, 'sparse', `wreath-silver-${uniqueId}`)
        )}
        {normalizedTier === 'gold' && (
          renderLaurelWreath(palette.laurelFill, palette.laurelShadow, palette.laurelHighlight, 'medium', `wreath-gold-${uniqueId}`)
        )}
        {normalizedTier === 'platinum' && (
          renderLaurelWreath(palette.laurelFill, palette.laurelShadow, palette.laurelHighlight, 'medium', `wreath-plat-${uniqueId}`)
        )}
        {normalizedTier === 'diamond' && (
          renderLaurelWreath(palette.laurelFill, palette.laurelShadow, palette.laurelHighlight, 'dense', `wreath-dia-${uniqueId}`)
        )}
        {normalizedTier === 'master' && (
          renderLaurelWreath(palette.laurelFill, palette.laurelShadow, palette.laurelHighlight, 'dense', `wreath-master-${uniqueId}`)
        )}

        {/* 2. Outer Hexagonal Shield Frame (3D Beveled rim) */}
        {/* Hexagon vertices: (60, 6) [Top peak] -> (104, 30) [Top-R] -> (104, 76) [Bot-R] -> (60, 102) [Bot peak] -> (16, 76) [Bot-L] -> (16, 30) [Top-L] */}
        
        {/* Left Rim Facet (Illuminated) */}
        <path
          d="M 60,6 L 16,30 L 16,76 L 60,102 L 60,94 L 24,72 L 24,34 L 60,14 Z"
          fill={`url(#grad-rim-L-${uniqueId})`}
        />

        {/* Right Rim Facet (Shadowed) */}
        <path
          d="M 60,6 L 104,30 L 104,76 L 60,102 L 60,94 L 96,72 L 96,34 L 60,14 Z"
          fill={`url(#grad-rim-R-${uniqueId})`}
        />

        {/* Top Rim Highlight Bevel Line */}
        <polyline
          points="16,30 60,6 104,30"
          fill="none"
          stroke={palette.rimHighlight}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom Rim Shadow Chamfer Line */}
        <polyline
          points="16,76 60,102 104,76"
          fill="none"
          stroke={palette.rimShadow}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Inner Plate (Deep Recessed Metallic Face) */}
        <polygon
          points="60,14 96,34 96,72 60,94 24,72 24,34"
          fill={`url(#grad-plate-${uniqueId})`}
        />

        {/* Inner Groove Chiseled Border */}
        <polygon
          points="60,16 94,35 94,71 60,92 26,71 26,35"
          fill="none"
          stroke={palette.innerRidge}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* 4. TIER-SPECIFIC MILITARY INSIGNIA */}

        {/* TIER 1: BRONZE (Single Chevron) */}
        {normalizedTier === 'bronze' && (
          <g transform="translate(0, 4)">
            {render3DChevron(
              62, 
              22, 
              9, 
              palette.insigniaLight, 
              palette.insigniaShadow, 
              palette.insigniaHighlight, 
              `chevron-br-1-${uniqueId}`
            )}
          </g>
        )}

        {/* TIER 2: SILVER (Double Chevrons) */}
        {normalizedTier === 'silver' && (
          <g transform="translate(0, 2)">
            {render3DChevron(
              54, 
              21, 
              8, 
              palette.insigniaLight, 
              palette.insigniaShadow, 
              palette.insigniaHighlight, 
              `chevron-sv-1-${uniqueId}`
            )}
            {render3DChevron(
              69, 
              21, 
              8, 
              palette.insigniaLight, 
              palette.insigniaShadow, 
              palette.insigniaHighlight, 
              `chevron-sv-2-${uniqueId}`
            )}
          </g>
        )}

        {/* TIER 3: GOLD (Triple Chevrons + 1 Bottom Star) */}
        {normalizedTier === 'gold' && (
          <g>
            <g transform="translate(0, -3)">
              {render3DChevron(
                45, 
                20, 
                7, 
                palette.insigniaLight, 
                palette.insigniaShadow, 
                palette.insigniaHighlight, 
                `chevron-gd-1-${uniqueId}`
              )}
              {render3DChevron(
                58, 
                20, 
                7, 
                palette.insigniaLight, 
                palette.insigniaShadow, 
                palette.insigniaHighlight, 
                `chevron-gd-2-${uniqueId}`
              )}
              {render3DChevron(
                71, 
                20, 
                7, 
                palette.insigniaLight, 
                palette.insigniaShadow, 
                palette.insigniaHighlight, 
                `chevron-gd-3-${uniqueId}`
              )}
            </g>
            {/* 1 Bottom Star */}
            <g className="drop-shadow">
              {render3DStar(60, 102, 10, 4.2, palette.starLight, palette.starShadow, `star-gd-bot-${uniqueId}`)}
            </g>
          </g>
        )}

        {/* TIER 4: PLATINUM (4 Stacked Chevron / Diamond Bars + 2 Bottom Stars) */}
        {normalizedTier === 'platinum' && (
          <g>
            {/* Top Diamond Bar */}
            <polygon
              points="60,32 72,39 60,46 48,39"
              fill={palette.insigniaLight}
              stroke={palette.insigniaHighlight}
              strokeWidth="0.8"
            />
            <polygon
              points="60,32 72,39 60,46"
              fill={palette.insigniaShadow}
            />

            {/* 3 Chevrons beneath */}
            <g transform="translate(0, 0)">
              {render3DChevron(
                56, 
                19, 
                6.5, 
                palette.insigniaLight, 
                palette.insigniaShadow, 
                palette.insigniaHighlight, 
                `chevron-pl-1-${uniqueId}`
              )}
              {render3DChevron(
                67, 
                19, 
                6.5, 
                palette.insigniaLight, 
                palette.insigniaShadow, 
                palette.insigniaHighlight, 
                `chevron-pl-2-${uniqueId}`
              )}
              {render3DChevron(
                78, 
                19, 
                6.5, 
                palette.insigniaLight, 
                palette.insigniaShadow, 
                palette.insigniaHighlight, 
                `chevron-pl-3-${uniqueId}`
              )}
            </g>

            {/* 2 Bottom Stars */}
            <g className="drop-shadow">
              {render3DStar(48, 101, 8.5, 3.6, palette.starLight, palette.starShadow, `star-pl-L-${uniqueId}`)}
              {render3DStar(72, 101, 8.5, 3.6, palette.starLight, palette.starShadow, `star-pl-R-${uniqueId}`)}
            </g>
          </g>
        )}

        {/* TIER 5: DIAMOND (Center 3D Star + 2 Flanking Stars) */}
        {normalizedTier === 'diamond' && (
          <g>
            {/* Center Big 3D Star */}
            <g className="drop-shadow-lg" transform="translate(0, -2)">
              {render3DStar(60, 54, 22, 9, palette.starLight, palette.starShadow, `star-dia-main-${uniqueId}`)}
            </g>

            {/* 2 Bottom Stars */}
            <g className="drop-shadow">
              {render3DStar(46, 102, 9.5, 4, palette.starLight, palette.starShadow, `star-dia-bot-L-${uniqueId}`)}
              {render3DStar(74, 102, 9.5, 4, palette.starLight, palette.starShadow, `star-dia-bot-R-${uniqueId}`)}
            </g>
          </g>
        )}

        {/* TIER 6: MASTER / TRẠNG NGUYÊN (The Grand Featured Badge with 3 Stars!) */}
        {normalizedTier === 'master' && (
          <g>
            {/* Grand Center 3D Chiseled Star with Specular Polish */}
            <g className="drop-shadow-2xl" transform="translate(0, -3)">
              {render3DStar(60, 53, 25, 10.5, palette.starLight, palette.starShadow, `star-ms-main-${uniqueId}`)}
              
              {/* Star Core Specular Reflection */}
              <circle cx="60" cy="53" r="2.5" fill="#FFFFFF" opacity="0.9" />
            </g>

            {/* 3 Prominent Bottom Stars (Matching bottom right reference image!) */}
            <g className="drop-shadow-md">
              {/* Left Star */}
              {render3DStar(36, 98, 9.5, 4, palette.starLight, palette.starShadow, `star-ms-bot-L-${uniqueId}`)}
              
              {/* Right Star */}
              {render3DStar(84, 98, 9.5, 4, palette.starLight, palette.starShadow, `star-ms-bot-R-${uniqueId}`)}

              {/* Center Main Bottom Star (Slightly larger, crowned in middle) */}
              {render3DStar(60, 104, 12.5, 5.2, palette.starLight, palette.starShadow, `star-ms-bot-C-${uniqueId}`)}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
