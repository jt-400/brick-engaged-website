export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-charcoal">
      <h1 className="text-6xl font-black mb-4">404</h1>
      <p className="text-xl font-medium text-slate-500 mb-8">Page not found</p>
      <a
        href="/"
        className="bg-lego-orange text-charcoal font-black px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
      >
        Go home
      </a>
    </div>
  );
}
