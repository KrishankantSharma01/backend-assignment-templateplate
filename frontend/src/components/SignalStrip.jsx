export default function SignalStrip({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass p-6 rounded-2xl animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const signals = [
    { label: "Total Students", value: data?.totalStudents || 0 },
    { label: "Active Programs", value: data?.totalPrograms || 0 },
    { label: "Applications Submitted", value: data?.totalApplications || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
      {signals.map((signal, index) => (
        <div key={index} className="glass p-6 rounded-2xl group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-primary/20"></div>
          <span className="block text-gray-400 text-sm font-medium uppercase tracking-wider mb-2 relative z-10">{signal.label}</span>
          <strong className="block text-4xl font-bold text-white relative z-10">{signal.value.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
}
