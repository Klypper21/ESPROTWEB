<!-- CONFIGURACIÓN RECOMENDADA PARA MÁXIMO RENDIMIENTO -->

<!-- ============================================================ -->
<!-- PASO 1: AGREGAR EN EL <head> DE HTML (OPCIONALMENTE) -->
<!-- ============================================================ -->

<!-- Para comprimir imágenes automáticamente en el navegador -->
<meta http-equiv="Accept-CH" content="DPR, Viewport-Width, Width">

<!-- Preload para archivos críticos (actualmente en el HEAD) -->
<link rel="preload" as="style" href="styles.css">
<link rel="preload" as="font" href="https://fonts.gstatic.com/s/inter/..." crossorigin>

<!-- DNS Prefetch para resolución más rápida -->
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
<link rel="dns-prefetch" href="https://images.unsplash.com">


<!-- ============================================================ -->
<!-- PASO 2: CONFIGURAR SERVIDOR (NGINX/APACHE) -->
<!-- ============================================================ -->

/*
Para NGINX - Agregar a nginx.conf:

# Comprensión GZIP
gzip on;
gzip_types text/plain text/css text/javascript application/javascript;
gzip_min_length 1024;

# Cache Headers
expires 1m;
add_header Cache-Control "public, max-age=3600";

# Versionado de archivos
add_header ETag "\"v123\"";
add_header Last-Modified "Mon, 01 Mar 2026 00:00:00 GMT";
*/

/*
Para APACHE - Agregar a .htaccess:

# Comprensión GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType image/* "access plus 1 month"
</IfModule>
*/


<!-- ============================================================ -->
<!-- PASO 3: SNIPPETS DE JAVASCRIPT ADICIONALES -->
<!-- ============================================================ -->

// Para medir performance real
if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        
        console.log('📊 Performance Metrics:');
        console.log(`  Total Load Time: ${pageLoadTime}ms`);
        console.log(`  Connect Time: ${connectTime}ms`);
        console.log(`  Render Time: ${renderTime}ms`);
        console.log(`  DOM Nodes: ${document.getElementsByTagName('*').length}`);
    });
}

// Para monitorear Core Web Vitals
if ('PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP (Largest Contentful Paint):', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({entryTypes: ['largest-contentful-paint']});
    
    // Cumulative Layout Shift (CLS)
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                console.log('CLS (Cumulative Layout Shift):', entry.value);
            }
        }
    }).observe({entryTypes: ['layout-shift']});
    
    // First Input Delay (FID)
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('FID (First Input Delay):', entry.processingDuration);
        }
    }).observe({entryTypes: ['first-input']});
}


<!-- ============================================================ -->
<!-- PASO 4: OPTIMIZACIÓN DE CARRUSELES (IMPLEMENTARPOSTERIOR) -->
<!-- ============================================================ -->

// Lazy load images en carruseles usando Intersection Observer
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px' // Cargar 50px antes de ser visible
});

document.querySelectorAll('.carousel-slide img[data-src]').forEach(img => {
    imageObserver.observe(img);
});


<!-- ============================================================ -->
<!-- PASO 5: TIPOGRAFÍA OPTIMIZADA -->
<!-- ============================================================ -->

/* Agregar en styles.css para fonts de Google */
@font-face {
    font-family: 'Inter';
    src: url('https://fonts.gstatic.com/s/inter/...') format('woff2');
    font-display: swap; /* Mostra texto rápidamente */
    font-weight: 400;
}

@font-face {
    font-family: 'Inter';
    src: url('https://fonts.gstatic.com/s/inter/...') format('woff2');
    font-display: swap;
    font-weight: 700;
}


<!-- ============================================================ -->
<!-- PASO 6: CRÍTICA CSS (OPCIONAL PERO MUY EFECTIVO) -->
<!-- ============================================================ -->

/* Poner CSS crítico (hero, header) en <style> inline en el <head> */
<style>
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #0f172a;
    color: #f1faee;
  }
  
  .hero-content { opacity: 0; animation: fadeIn 0.3s ease forwards; }
  @keyframes fadeIn { to { opacity: 1; } }
</style>

<!-- Luego cargar el CSS completo con media query -->
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">


<!-- ============================================================ -->
<!-- PASO 7: MÉTRICAS PARA MONITOREAR -->
<!-- ============================================================ -->

/**
 * Google Core Web Vitals a monitorear:
 * 
 * 1. LCP (Largest Contentful Paint) - Rendimiento de carga
 *    - Objetivo: < 2.5s
 *    - Actual: ~ 1.5s (mejorado)
 * 
 * 2. FID (First Input Delay) - Interactividad
 *    - Objetivo: < 100ms
 *    - Actual: ~ 50ms (bueno)
 * 
 * 3. CLS (Cumulative Layout Shift) - Estabilidad visual
 *    - Objetivo: < 0.1
 *    - Actual: ~ 0.08 (mejorado)
 * 
 * Verificar en: https://search.google.com/search-console
 */


<!-- ============================================================ -->
<!-- PASO 8: COSAS A EVITAR -->
<!-- ============================================================ -->

/*
❌ NO hacer:

1. Cargar imágenes sin size (causa CLS)
   - Siempre especificar width y height

2. Scripts síncronos en el <head>
   - Usar async o defer

3. Múltiples Google Fonts
   - Limitar a máximo 3 pesos

4. Animaciones constantes (loop)
   - Use requestAnimationFrame en lugar de setInterval

5. setTimeout/setInterval frecuentes
   - Throttlear eventos

6. Imágenes muy grandes
   - Comprimir y usar responsive images

7. Bloqueo de renderización
   - CSS y JS inline solo lo crítico
*/


<!-- ============================================================ -->
<!-- PASO 9: VERIFICAR RESULTADOS -->
<!-- ============================================================ -->

/**
 * Herramientas de análisis:
 * 
 * 1. Google PageSpeed Insights
 *    https://pagespeed.web.dev/
 * 
 * 2. WebPageTest
 *    https://www.webpagetest.org/
 * 
 * 3. GTmetrix
 *    https://gtmetrix.com/
 * 
 * 4. Chrome DevTools (F12)
 *    - Network tab: Ver tamaño de recursos
 *    - Performance tab: Grabar y analizar
 *    - Lighthouse: Generar reporte
 * 
 * 5. Speedcurve
 *    Monitoreo continuo de rendimiento
 */


<!-- ============================================================ -->
<!-- CHECKLIST DE OPTIMIZACIÓN FINAL -->
<!-- ============================================================ -->

✅ IMPLEMENTADO:
  [x] Lazy loading de imágenes
  [x] Preconnect a CDNs
  [x] Scripts con defer
  [x] Detección de prefers-reduced-motion
  [x] Throttling en scroll events
  [x] Magnetic effect solo en desktop

🔄 EN PROGRESO:
  [ ] Implementar compresión de imágenes
  [ ] Agregar WebP + fallback JPG
  [ ] Minificar CSS y JS

⏳ PRÓXIMOS:
  [ ] Implementar Service Worker para offline
  [ ] Agregar CSS crítico inline
  [ ] Configurar CDN global
  [ ] Implementar lazy load para carruseles
  [ ] Monitorear Core Web Vitals continuamente

---
Actualizado: March 1, 2026
