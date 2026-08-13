const GallerySkeleton = () => {
  // Varying heights for masonry effect
  const heights = [200, 280, 240, 320, 200, 260, 300, 220, 280, 240];

  return (
    <div className="gallery-masonry">
      {heights.map((h, i) => (
        <div
          key={i}
          className="gallery-skeleton rounded-2xl overflow-hidden"
          style={{ height: h }}
        >
          {/* Image skeleton */}
          <div className="w-full h-full relative">
            {/* Category badge skeleton */}
            <div className="absolute top-3 left-3 w-16 h-5 rounded-full bg-white/[0.06]" />

            {/* Bottom overlay skeleton */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-white/[0.06]" />
                <div className="w-20 h-3 rounded bg-white/[0.06]" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-3 rounded bg-white/[0.06]" />
                <div className="w-12 h-3 rounded bg-white/[0.06]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;
