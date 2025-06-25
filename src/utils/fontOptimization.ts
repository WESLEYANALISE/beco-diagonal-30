
export const preloadFonts = () => {
  const fonts = [
    {
      family: 'Cinzel',
      weights: ['400', '500', '600', '700'],
      display: 'swap'
    },
    {
      family: 'Playfair Display',
      weights: ['400', '500', '600', '700'],
      display: 'swap'
    },
    {
      family: 'Inter',
      weights: ['300', '400', '500', '600'],
      display: 'swap'
    }
  ];

  fonts.forEach(font => {
    font.weights.forEach(weight => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = `https://fonts.googleapis.com/css2?family=${font.family.replace(' ', '+')}:wght@${weight}&display=${font.display}`;
      document.head.appendChild(link);
    });
  });
};

export const optimizeFontLoading = () => {
  // Add font-display: swap to existing font links
  const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  fontLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('display=swap')) {
      link.setAttribute('href', `${href}&display=swap`);
    }
  });
};
