const GallerySkeleton = () => {
  const heights = [280, 340, 240, 380, 300, 260, 320, 290];

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
      {heights.map((h, i) => (
        <div
          key={i}
          className="break-inside-avoid inline-block w-full mb-4 sm:mb-6 rounded-2xl bg-white/[0.05] animate-pulse relative overflow-hidden border border-white/5"
          style={{ height: h }}
        >
          <div className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-white/10" />
          <div className="absolute bottom-3 left-3 right-3 space-y-2">
            <div className="w-3/4 h-3.5 rounded bg-white/10" />
            <div className="w-1/2 h-3 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;
