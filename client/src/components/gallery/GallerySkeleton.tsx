const GallerySkeleton = () => {
  const heights = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-square'];

  return (
    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 lg:gap-6">
      {heights.map((aspect, i) => (
        <div
          key={i}
          className={`break-inside-avoid inline-block w-full mb-3 sm:mb-4 lg:mb-6 ${aspect} rounded-xl sm:rounded-2xl bg-white/[0.05] animate-pulse relative overflow-hidden border border-white/5`}
        >
          <div className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-white/10" />
          <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
            <div className="w-3/4 h-3 rounded bg-white/10" />
            <div className="w-1/2 h-2.5 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;
