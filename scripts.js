        // Cargar header automáticamente en todas las páginas
        document.addEventListener('DOMContentLoaded', async function() {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                try {
                    const response = await fetch('header.html');
                    if (response.ok) {
                        headerContainer.innerHTML = await response.text();
                        // Re-inicializar event listeners para el header cargado
                        setupHeaderEventListeners();
                        // Aplicar magnetic effect a los nuevos elementos
                        applyMagneticEffect();
                    }
                } catch (error) {
                    console.error('Error cargando header:', error);
                }
            }
        });

        // Detectar preferencia de reducción de movimiento
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Initialize Lenis for smooth scroll
        const lenis = new Lenis({
            duration: prefersReducedMotion ? 0.5 : 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        let lastRAFTime = 0;
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Integrate Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Scroll Progress Bar - Optimized with throttling
        let scrollProgressTimeout = null;
        lenis.on('scroll', ({ progress }) => {
            if (scrollProgressTimeout) return;
            
            const progressBar = document.getElementById('scrollProgress');
            if (progressBar) {
                progressBar.style.width = `${progress * 100}%`;
            }
            
            scrollProgressTimeout = setTimeout(() => {
                scrollProgressTimeout = null;
            }, 33); // Throttle to ~30fps
        });

        // GSAP Animations
        gsap.registerPlugin(ScrollTrigger);

        // Hero Animations
        const heroTimeline = gsap.timeline();
        
        heroTimeline
            .to('.hero-content h1 .line', {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: 'power4.out'
            })
            .to('.hero-content p', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5')
            .to('.hero-content .btn', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'back.out(1.7)'
            }, '-=0.5');

        // Hero Parallax
        gsap.to('.hero-bg', {
            yPercent: 50,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        gsap.to('.floating-shield', {
            rotation: 360,
            yPercent: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Services Section Animations
        gsap.to('.section-header h2', {
            scrollTrigger: {
                trigger: '.section-header',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.to('.section-header p', {
            scrollTrigger: {
                trigger: '.section-header',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });

        // Service Cards Stagger Animation
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 0,
                rotateX: 0,
                opacity: 1,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Location Section Animations
        gsap.to('.location-info', {
            scrollTrigger: {
                trigger: '.location-content',
                start: 'top 70%',
                toggleActions: 'play none none reverse',
                onEnter: () => document.querySelector('.location-info').classList.add('revealed')
            },
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.to('.map-container', {
            scrollTrigger: {
                trigger: '.location-content',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out'
        });

        // Branch Items Stagger
        gsap.utils.toArray('.branch-item').forEach((item, i) => {
            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Quote Text Animation
        gsap.to('.quote-text', {
            scrollTrigger: {
                trigger: '.quote-text',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Footer Animations
        ScrollTrigger.create({
            trigger: '.site-footer',
            start: 'top 80%',
            onEnter: () => {
                document.querySelector('.site-footer').classList.add('revealed');
                
                gsap.to('.footer-column', {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out'
                });

                document.querySelectorAll('.footer-column').forEach(col => {
                    col.classList.add('revealed');
                });

                gsap.to('.footer-bottom', {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: 0.4,
                    ease: 'power3.out'
                });
            }
        });

        // Magnetic Effect - Solo en dispositivos de escritorio
        if (window.innerWidth > 768 && !prefersReducedMotion) {
            const magneticElements = document.querySelectorAll('.magnetic');
            
            magneticElements.forEach(elem => {
                elem.addEventListener('mousemove', (e) => {
                    const rect = elem.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    gsap.to(elem, {
                        x: x * 0.3,
                        y: y * 0.3,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
                
                elem.addEventListener('mouseleave', () => {
                    gsap.to(elem, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });
        }

        // Hamburger Menu Logic
        function toggleMenu() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                lenis.stop();
            } else {
                lenis.start();
            }
        }

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                lenis.start();
            });
        });

        // Scroll Header Effect - Optimized with throttling
        let headerScrollTimeout = null;
        window.addEventListener('scroll', () => {
            if (headerScrollTimeout) return;
            
            const header = document.getElementById('main-header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            headerScrollTimeout = setTimeout(() => {
                headerScrollTimeout = null;
            }, 33);
        }, { passive: true });

        // Carousel Logic
        let slideIndices = [0, 0, 0, 0, 0, 0];
        
        function updateCarouselButtons(carouselIndex) {
            const slides = document.querySelectorAll('.carousel-slide');
            const carousel = slides[carouselIndex];
            const carouselContainer = carousel.closest('.carousel-container');
            const prevBtn = carouselContainer.querySelector('.prev');
            const nextBtn = carouselContainer.querySelector('.next');
            const totalSlides = carousel.children.length;
            const currentIndex = slideIndices[carouselIndex];
            
            // Mostrar/ocultar botón prev
            if (currentIndex === 0) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = '';
            }
            
            // Mostrar/ocultar botón next
            if (currentIndex === totalSlides - 1) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = '';
            }
        }
        
        function initCarousels() {
            const slides = document.querySelectorAll('.carousel-slide');
            slides.forEach((slide, index) => {
                updateCarouselButtons(index);
            });
        }
        
        function moveSlide(step, carouselIndex) {
            const slides = document.querySelectorAll('.carousel-slide');
            const totalSlides = slides[carouselIndex].children.length;
            const newIndex = slideIndices[carouselIndex] + step;
            
            // Solo permitir navegación si es válida
            if (newIndex < 0 || newIndex >= totalSlides) {
                return;
            }
            
            slideIndices[carouselIndex] = newIndex;
            
            gsap.to(slides[carouselIndex], {
                x: -slideIndices[carouselIndex] * 100 + '%',
                duration: 0.5,
                ease: 'power2.inOut'
            });
            
            updateCarouselButtons(carouselIndex);
        }
        
        // Animaciones para Sede Principal y UEB
gsap.to('.sede-container', {
    scrollTrigger: {
        trigger: '.sede-container',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out'
});

// Animación para tarjetas UEB
gsap.utils.toArray('.ueb-card').forEach((card, i) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out'
    });
});

// Animación para leyenda del mapa
gsap.to('.map-legend', {
    scrollTrigger: {
        trigger: '.map-container',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    y: 0,
    opacity: 1,
    duration: 0.8,
    delay: 0.3,
    ease: 'power3.out'
});

        // Modal Logic with Animation
        function openModal() { 
            const modal = document.getElementById('contactModal');
            modal.classList.add('active');
            lenis.stop();
        }
        
        function closeModal() { 
            const modal = document.getElementById('contactModal');
            modal.classList.remove('active');
            lenis.start();
        }

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('contactModal');
            if (event.target === modal) {
                closeModal();
            }
        });

        // Form submission
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            // Animate button before submitting
            const btn = e.target.querySelector('.btn');
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            
            gsap.to(btn, {
                scale: 0.95,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
            
            // FormSubmit manejará el envío automáticamente
            // El formulario se enviará después de la animación
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.2
                    });
                }
            });
        });

        // Initialize carousels on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCarousels);
        } else {
            initCarousels();
        }

        // Hacer funciones globales para que sean accesibles desde el HTML dinámico
        window.toggleMenu = toggleMenu;
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.moveSlide = moveSlide;

        // Función para re-aplicar event listeners cuando el header se carga dinámicamente
        function setupHeaderEventListeners() {
            // Close menu when clicking on a nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const hamburger = document.querySelector('.hamburger');
                    const navMenu = document.querySelector('.nav-menu');
                    
                    if (hamburger && navMenu) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        lenis.start();
                    }
                });
            });
        }

        // Función para re-aplicar magnético effect
        function applyMagneticEffect() {
            if (window.innerWidth > 768 && !prefersReducedMotion) {
                const magneticElements = document.querySelectorAll('.magnetic');
                
                magneticElements.forEach(elem => {
                    // Remover listeners anteriores para evitar duplicados
                    elem.removeEventListener('mousemove', handleMagneticMove);
                    elem.removeEventListener('mouseleave', handleMagneticLeave);
                    
                    // Añadir nuevos listeners
                    elem.addEventListener('mousemove', handleMagneticMove);
                    elem.addEventListener('mouseleave', handleMagneticLeave);
                });
            }
        }

        // Funciones auxiliares para el efecto magnético
        function handleMagneticMove(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(this, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        function handleMagneticLeave() {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        window.setupHeaderEventListeners = setupHeaderEventListeners;
        window.applyMagneticEffect = applyMagneticEffect;

        // ========== FLIP CARDS FUNCTIONALITY ==========
        // Initialize flip cards for UEB municipals
        function initializeFlipCards() {
            const uebCards = document.querySelectorAll('.ueb-card');
            
            uebCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    // No flip if clicking on an external link
                    if (e.target.closest('a')) return;
                    
                    this.classList.toggle('flipped');
                });
                
                // Optional: Add keyboard support (Enter/Space to flip)
                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.classList.toggle('flipped');
                    }
                });
                
                // Make card focusable for accessibility
                if (!card.hasAttribute('tabindex')) {
                    card.setAttribute('tabindex', '0');
                }
            });
        }

        // Initialize flip cards when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeFlipCards);
        } else {
            initializeFlipCards();
        }

        window.initializeFlipCards = initializeFlipCards;