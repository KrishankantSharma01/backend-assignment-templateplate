export default function InfoCard({ title, body }) {
  return (
    <div className="glass p-8 rounded-3xl group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
      <div className="absolute -inset-px bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
      <h3 className="text-xl font-semibold text-white mb-4 relative z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed relative z-10">{body}</p>
    </div>
  );
}
