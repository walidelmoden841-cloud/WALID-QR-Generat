import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { getCoupons } from '../data';
import { Check, Copy, ExternalLink, X } from 'lucide-react';

export default function CouponDetail() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  
  const coupons = useMemo(() => getCoupons(), []);
  const coupon = coupons.find((c) => c.id === id);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!coupon) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">لم يتم العثور على الكوبون</h2>
        <Link to="/" className="text-blue-600 hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-slate-50 relative min-h-[calc(100vh-64px)] flex items-start justify-center pt-16 px-4 before:absolute before:inset-0 before:bg-slate-900/40 before:backdrop-blur-sm z-0">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        <Link to="/" className="absolute top-4 left-4 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 p-2 rounded-full hover:bg-slate-100">
          <X className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <div className={`h-20 min-w-[80px] max-w-[200px] inline-flex px-6 rounded-2xl mx-auto mb-4 items-center justify-center text-white font-black text-3xl shadow-lg ${coupon.color}`}>
             {coupon.logo}
          </div>
          <h3 className="text-2xl font-bold mb-2 text-slate-900">متجر {coupon.store}</h3>
          
          <div className="inline-block bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
            تاريخ التحقق: {coupon.verifiedDate}
          </div>

          <p className="text-slate-600 mb-6 font-medium text-base leading-relaxed">
            استخدم الكود أدناه عند إتمام عملية الدفع للحصول على خصم {coupon.discount}
          </p>

          <div className="bg-blue-50 border-r-4 border-blue-500 p-4 mb-6 text-right rounded-l-lg text-sm leading-relaxed">
            <p className="text-blue-800 font-bold mb-1">
              💡 ملاحظة هامة:
            </p>
            <p className="text-blue-700">
              الخصم الحقيقي ({coupon.discount}) لا يظهر مباشرة على صور المنتجات، بل <span className="font-bold">يتم تطبيقه في صفحة الدفع النهائية (Checkout)</span> بعد أن تقوم بلصق الكود في خانة "الرمز الترويجي / Promo Code".
            </p>
          </div>
          
          <div className="relative mb-6">
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 rounded-xl font-mono text-3xl font-bold tracking-widest text-slate-900 select-all">
              {coupon.code}
            </div>
          </div>
          
          <button
            onClick={handleCopy}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center text-white ${
              copied 
                ? 'bg-emerald-500 shadow-emerald-200' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-200'
            }`}
          >
            {copied ? '✓ تم النسخ بنجاح!' : 'نسخ الكود الكلي'}
          </button>
          
          <a
            href={coupon.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            فتح متجر {coupon.store} 
            <ExternalLink className="mr-1.5 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
