import { useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Link as LinkIcon, RefreshCcw } from 'lucide-react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateQRCode = async () => {
    if (!inputText.trim()) {
      setError('يرجى إدخال الرابط أو النص أولاً');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    
    try {
      // Generate QR Code data URL
      const url = await QRCode.toDataURL(inputText, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      
      setQrImageUrl(url);
    } catch (err) {
      setError('حدث خطأ أثناء توليد الكود. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrImageUrl) return;
    
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `WALID_QR_${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)]">
      
      {/* Intro Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
          أنشئ كود QR خاص بك في ثوانٍ
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          أداة احترافية، سريعة، ومجانية بالكامل لتحويل الروابط والنصوص إلى أكواد QR ذكية عالية الجودة.
        </p>
      </div>

      <div className="flex justify-center">
        
        {/* Main Generator Section */}
        <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="space-y-6">
            
            {/* Input Area */}
            <div>
              <label htmlFor="qr-input" className="block text-sm font-bold text-gray-700 mb-2">
                أدخل الرابط (URL) أو النص هنا
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="qr-input"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      generateQRCode();
                    }
                  }}
                  className="block w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 focus:bg-white transition-colors duration-200 text-lg"
                  placeholder="https://example.com ..."
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQRCode}
              disabled={isGenerating}
              className="w-full flex justify-center items-center gap-2 py-4 px-8 border border-transparent rounded-xl text-lg font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-md transition-all active:scale-[0.99] disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <RefreshCcw className="h-6 w-6 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                <>
                  <QrCode className="h-6 w-6" />
                  توليد كود الـ QR
                </>
              )}
            </button>
            
            {/* Divider */}
            {qrImageUrl && <hr className="border-gray-100 my-8" />}

            {/* Result Area */}
            {qrImageUrl && (
              <div className="flex flex-col items-center justify-center pt-4 animate-in fade-in zoom-in duration-300">
                
                <div className="bg-white p-4 border-2 border-gray-100 rounded-2xl shadow-sm mb-6 relative group overflow-hidden">
                  <img 
                    src={qrImageUrl} 
                    alt="Generated QR Code" 
                    className="w-64 h-64 md:w-80 md:h-80 object-contain"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-5 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl"></div>
                </div>
                
                <button
                  onClick={downloadQRCode}
                  className="flex justify-center items-center gap-2 py-3 px-8 rounded-xl text-base font-bold text-gray-900 bg-white border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Download className="h-5 w-5" />
                  تحميل كود الـ QR كصورة PNG
                </button>
                
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
