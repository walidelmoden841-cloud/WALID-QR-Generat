import Navbar from './components/Navbar';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col selection:bg-blue-100">
      <Navbar />
      <main className="flex-grow w-full">
        <Home />
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 text-center text-gray-600 text-sm flex-shrink-0">
        <p>© {new Date().getFullYear()} WALID QR Generator. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

