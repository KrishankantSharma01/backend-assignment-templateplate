export default function SpotlightList({ items, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass rounded-3xl h-80 animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Map images to countries
  const getImageForCountry = (country) => {
    const c = country.toLowerCase();
    if (c.includes('canada')) return '/assets/images/campus_canada.png';
    if (c.includes('uk') || c.includes('united kingdom')) return '/assets/images/campus_uk.png';
    if (c.includes('australia')) return '/assets/images/campus_australia.png';
    return '/assets/images/campus_canada.png'; // fallback
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="glass rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-white/10 hover:border-primary/50 shadow-2xl">
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-darker/20 z-10"></div>
            <img 
              src={getImageForCountry(item.country)} 
              alt={item.name} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-darker/80 backdrop-blur-md text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-primary/20">
                {item.country}
              </span>
            </div>
            {item.qsRanking > 0 && (
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-white/10 backdrop-blur-md text-white px-2 py-1 rounded-md text-xs font-semibold border border-white/20">
                  QS #{item.qsRanking}
                </span>
              </div>
            )}
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">Located in the beautiful city of {item.city}. Discover top programs tailored for international students.</p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {item.tags?.slice(0, 3).map((tag, i) => (
                <span key={i} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-2 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
