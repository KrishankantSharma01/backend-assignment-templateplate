import { useState, useEffect } from "react";
import InfoCard from "../components/InfoCard.jsx";
import SignalStrip from "../components/SignalStrip.jsx";
import SpotlightList from "../components/SpotlightList.jsx";
import AiAssistant from "../components/AiAssistant.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api.js";

const featureCards = [
  {
    title: "Global Discovery",
    body: "Explore universities and programs using real-time search, robust filtering by country and budget, and cursor-based pagination.",
  },
  {
    title: "Application Workflow",
    body: "Track application states smoothly from draft to under-review, ensuring no duplicates and robust timeline histories.",
  },
  {
    title: "Smart Insights",
    body: "Discover curated recommendations powered by our advanced MongoDB aggregation pipeline or let the AI guide your journey.",
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [overviewData, setOverviewData] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingUnis, setLoadingUnis] = useState(true);

  useEffect(() => {
    // Fetch dashboard overview
    api.get('/dashboard/overview')
      .then(res => {
        if (res.data.success) setOverviewData(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoadingOverview(false));

    // Fetch popular universities
    api.get('/universities/popular')
      .then(res => {
        if (res.data.success) setUniversities(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoadingUnis(false));
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 relative">
      
      {/* Navbar / Header area */}
      <div className="flex justify-between items-center mb-12 glass p-4 px-6 rounded-2xl">
        <div className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
           <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
           Waygood
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden md:inline-block">Logged in as <strong className="text-white">{user?.fullName}</strong> ({user?.role})</span>
          <button 
            onClick={logout}
            className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <section className="text-center max-w-4xl mx-auto mb-16 relative z-10 pt-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
          Study Abroad. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            Reimagined.
          </span>
        </h1>
        <p className="text-lg text-gray-300 mx-auto max-w-2xl leading-relaxed">
          Experience the next generation of international student discovery. 
          This interface consumes high-performance APIs, real-time caching, and AI-driven study plans.
        </p>
      </section>

      <SignalStrip data={overviewData} loading={loadingOverview} />

      <section className="mt-24">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Product Direction</p>
          <h2 className="text-4xl font-bold text-white">Platform Core Features</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((card) => (
            <InfoCard key={card.title} title={card.title} body={card.body} />
          ))}
        </div>
      </section>

      <section className="mt-24">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Popular Destinations</p>
            <h2 className="text-4xl font-bold text-white">Trending Universities</h2>
          </div>
          <p className="text-gray-400 max-w-sm">Pulled live from our optimized Redis cache, these institutions are highly sought after by students globally.</p>
        </div>
        <SpotlightList items={universities} loading={loadingUnis} />
      </section>

      {/* AI Assistant Section */}
      <AiAssistant />
      
    </main>
  );
}
