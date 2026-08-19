import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ─── Types ─── */
interface GeoFeature {
  type: string;
  properties: { district: string; dt_code: string; st_nm: string };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSON {
  type: string;
  features: GeoFeature[];
}

interface DistrictsPageMapProps {
  selectedDistrict: string | null;
  hoveredCardDistrict: string | null;
  onSelectDistrict: (name: string | null) => void;
  onHoverDistrict: (name: string | null) => void;
}

/* ─── Mercator projection helpers ─── */
const BOUNDS = {
  minLng: 83.3,
  maxLng: 88.2,
  minLat: 23.8,
  maxLat: 27.6,
};

const SVG_W = 1000;
const SVG_H = 760;
const PADDING = 40;

function projectLng(lng: number): number {
  return (
    PADDING +
    ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) *
    (SVG_W - 2 * PADDING)
  );
}

function projectLat(lat: number): number {
  return (
    PADDING +
    ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) *
    (SVG_H - 2 * PADDING)
  );
}

function ringToPath(ring: number[][]): string {
  return (
    ring
      .map((coord, i) => {
        const x = projectLng(coord[0]).toFixed(2);
        const y = projectLat(coord[1]).toFixed(2);
        return i === 0 ? `M${x},${y}` : `L${x},${y}`;
      })
      .join(" ") + " Z"
  );
}

function geometryToPath(geometry: GeoFeature["geometry"]): string {
  if (geometry.type === "Polygon") {
    return (geometry.coordinates as number[][][])
      .map((ring) => ringToPath(ring))
      .join(" ");
  }
  return (geometry.coordinates as number[][][][])
    .map((polygon) => polygon.map((ring) => ringToPath(ring)).join(" "))
    .join(" ");
}

function getCentroid(geometry: GeoFeature["geometry"]): [number, number] {
  let coords: number[][] = [];
  if (geometry.type === "Polygon") {
    coords = (geometry.coordinates as number[][][])[0];
  } else {
    const polys = geometry.coordinates as number[][][][];
    let maxLen = 0;
    for (const poly of polys) {
      if (poly[0].length > maxLen) {
        maxLen = poly[0].length;
        coords = poly[0];
      }
    }
  }
  let sumX = 0,
    sumY = 0;
  for (const c of coords) {
    sumX += c[0];
    sumY += c[1];
  }
  return [sumX / coords.length, sumY / coords.length];
}

/* ─── Light beige fill for the districts page ─── */
const DEFAULT_FILL = "#F5F0E8";

const HOVER_FILL = "#F5E6C8";
const SELECTED_FILL = "#D4A017";

/* ─── Component ─── */
const DistrictsPageMap = ({
  selectedDistrict,
  hoveredCardDistrict,
  onSelectDistrict,
  onHoverDistrict,
}: DistrictsPageMapProps) => {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/bihar-districts.geojson")
      .then((r) => r.json())
      .then((data: GeoJSON) => setGeoData(data))
      .catch((err) => console.error("Failed to load Bihar GeoJSON:", err));
  }, []);

  const districtPaths = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.map((feature, i) => ({
      name: feature.properties.district,
      path: geometryToPath(feature.geometry),
      centroid: getCentroid(feature.geometry),
      fill: DEFAULT_FILL,
    }));
  }, [geoData]);

  // Manual pixel offsets (in SVG units) for crowded / small districts
  const LABEL_OFFSETS: Record<string, [number, number]> = {
    Sheohar: [-18, -8],
    Sitamarhi: [18, -8],
    Arwal: [-8, 8],
    Sheikhpura: [-22, 0],
    Lakhisarai: [22, 0],
    Vaishali: [-6, -6],
    Saran: [-6, 0],
    Patna: [0, -6],
    Nalanda: [0, 6],
    Jehanabad: [-4, 4],
    Bhojpur: [4, -4],
    Buxar: [-8, 0],
    "East Champaran": [0, 10],
    "West Champaran": [0, -10],
    Samastipur: [0, 4],
    Muzaffarpur: [0, -4],
    Darbhanga: [0, -4],
    Gopalganj: [0, 4],
  };

  // Compute label positions (using centroids projected to SVG coords)
  const labelPositions = useMemo(() => {
    return districtPaths.map((d) => {
      const [ox, oy] = LABEL_OFFSETS[d.name] ?? [0, 0];
      return {
        name: d.name,
        x: projectLng(d.centroid[0]) + ox,
        y: projectLat(d.centroid[1]) + oy,
      };
    });
  }, [districtPaths]);

  const handleDistrictHover = useCallback(
    (districtName: string, e: React.MouseEvent) => {
      setHoveredDistrict(districtName);
      onHoverDistrict(districtName);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top - 12,
        });
      }
    },
    [onHoverDistrict]
  );

  const handleDistrictMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (hoveredDistrict && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top - 12,
        });
      }
    },
    [hoveredDistrict]
  );

  const handleDistrictLeave = useCallback(() => {
    setHoveredDistrict(null);
    onHoverDistrict(null);
    setTooltipPos(null);
  }, [onHoverDistrict]);

  const handleDistrictClick = useCallback(
    (districtName: string) => {
      onSelectDistrict(
        selectedDistrict === districtName ? null : districtName
      );
    },
    [selectedDistrict, onSelectDistrict]
  );

  const activeHover = hoveredDistrict || hoveredCardDistrict;

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      onMouseMove={handleDistrictMouseMove}
      onMouseLeave={handleDistrictLeave}
    >
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ display: "block" }}
      >
        {/* District polygons */}
        {districtPaths.map((d) => {
          const isSelected = selectedDistrict === d.name;
          const isHovered = activeHover === d.name;
          let fill = d.fill;
          if (isSelected) fill = SELECTED_FILL;
          else if (isHovered) fill = HOVER_FILL;

          return (
            <path
              key={d.name}
              d={d.path}
              fill={fill}
              stroke="#C8C0B0"
              strokeWidth={isSelected ? 1.6 : 0.8}
              strokeLinejoin="round"
              className="cursor-pointer transition-all duration-200"
              style={{
                filter: isSelected
                  ? "drop-shadow(0 0 6px rgba(212, 160, 23, 0.4))"
                  : "none",
              }}
              onMouseEnter={(e) => handleDistrictHover(d.name, e)}
              onMouseLeave={handleDistrictLeave}
              onClick={() => handleDistrictClick(d.name)}
            />
          );
        })}

        {/* District name labels */}
        {labelPositions.map((lp) => {
          const isSelected = selectedDistrict === lp.name;
          const words = lp.name.split(" ");
          const twoLine = words.length >= 2;
          const line1 = twoLine ? words.slice(0, Math.ceil(words.length / 2)).join(" ") : lp.name;
          const line2 = twoLine ? words.slice(Math.ceil(words.length / 2)).join(" ") : null;
          const labelFill = isSelected ? "#FFFFFF" : "#3A3028";
          const commonStyle: React.CSSProperties = {
            fontSize: "8.5px",
            fontFamily: "Inter, sans-serif",
            fontWeight: isSelected ? 700 : 600,
            fill: labelFill,
            letterSpacing: "0.03em",
            paintOrder: "stroke",
            stroke: isSelected ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.92)",
            strokeWidth: "3px",
            strokeLinejoin: "round" as const,
          };
          return (
            <text
              key={lp.name}
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none"
              style={commonStyle}
            >
              {twoLine ? (
                <>
                  <tspan x={lp.x} dy="-5">{line1}</tspan>
                  <tspan x={lp.x} dy="11">{line2}</tspan>
                </>
              ) : lp.name}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {activeHover && tooltipPos && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2 text-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gold" />
              <span className="text-sm font-bold text-gray-900">
                {activeHover}
              </span>
            </div>
          </div>
          <div className="w-0 h-0 mx-auto border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-white" />
        </div>
      )}
    </div>
  );
};

export default DistrictsPageMap;
