const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3 md:gap-4 lg:gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-lg sm:rounded-xl bg-white/[0.05] animate-pulse relative overflow-hidden border border-white/5"
        >
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/10" />
          <div className="absolute bottom-2 left-2 right-2 space-y-1">
            <div className="w-3/4 h-2.5 rounded bg-white/10" />
            <div className="w-1/2 h-2 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;
