export interface Coupon {
  id: string;
  store: string;
  discount: string;
  code: string;
  description: string;
  logo: string;
  url: string;
  color: string;
  verifiedDate: string;
  successRate: number;
}

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const getCoupons = (): Coupon[] => {
  const currentDate = new Date();
  const monthName = months[currentDate.getMonth()];
  const formattedDate = currentDate.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return [
    {
      id: 'ali-18',
      store: 'AliExpress',
      discount: '2$',
      code: 'USSS02',
      description: 'خصم 2$ عند الشراء بقيمة 18$ أو أكثر + شحن مجاني (عروض نهاية الشهر)',
      logo: 'AliExpress',
      url: 'https://aliexpress.com',
      color: 'bg-orange-500',
      verifiedDate: formattedDate,
      successRate: 98
    },
    {
      id: 'ali-39',
      store: 'AliExpress',
      discount: '5$',
      code: 'USSS05',
      description: 'خصم 5$ للطلبات التي تتجاوز 39$ + شحن مجاني (عروض نهاية الشهر)',
      logo: 'AliExpress',
      url: 'https://aliexpress.com',
      color: 'bg-orange-500',
      verifiedDate: formattedDate,
      successRate: 96
    },
    {
      id: 'ali-85',
      store: 'AliExpress',
      discount: '12$',
      code: 'USSS12',
      description: 'خصم 12$ على الطلبات فوق 85$ + شحن دولي مجاني خلال 24 ساعة',
      logo: 'AliExpress',
      url: 'https://aliexpress.com',
      color: 'bg-orange-500',
      verifiedDate: formattedDate,
      successRate: 95
    },
    {
      id: 'ali-165',
      store: 'AliExpress',
      discount: '24$',
      code: 'USSS24',
      description: 'خصم ضخم 24$ عند الشراء بقيمة 165$ أو أكثر + شحن مجاني',
      logo: 'AliExpress',
      url: 'https://aliexpress.com',
      color: 'bg-orange-500',
      verifiedDate: formattedDate,
      successRate: 94
    },
    {
      id: 'ali-239',
      store: 'AliExpress',
      discount: '35$',
      code: 'USSS35',
      description: 'خصم 35$ للطلبات الكبيرة أكثر من 239$ + شحن مجاني',
      logo: 'AliExpress',
      url: 'https://aliexpress.com',
      color: 'bg-orange-500',
      verifiedDate: formattedDate,
      successRate: 92
    },
    {
      id: 'ali-379',
      store: 'AliExpress',
      discount: '55$',
      code: 'USSS55',
      description: 'أكبر خصم: 55$ على الطلبات أكثر من 379$ + شحن مجاني',
      logo: 'AliExpress',
      url: 'https://aliexpress.com',
      color: 'bg-orange-500',
      verifiedDate: formattedDate,
      successRate: 90
    },
    {
      id: 'shein',
      store: 'Shein',
      discount: '15%',
      code: 'SHEIN15',
      description: 'تخفيض مجرب 15% للملابس والأزياء عند إتمام الطلب',
      logo: 'Shein',
      url: 'https://shein.com',
      color: 'bg-black',
      verifiedDate: formattedDate,
      successRate: 95
    },
    {
      id: 'jumia',
      store: 'Jumia',
      discount: '10%',
      code: 'JUMIA10',
      description: 'كود حقيقي 10% شغال على الأجهزة والمنتجات المحلية',
      logo: 'Jumia',
      url: 'https://jumia.ma',
      color: 'bg-orange-400',
      verifiedDate: formattedDate,
      successRate: 97
    }
  ];
};

