// Hero Stars Background
const canvas = document.getElementById('hero-stars');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let width, height;

    function initStars() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        stars = [];
        const count = Math.floor((width * height) / 3000); // Responsive density

        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5,
                opacity: Math.random(),
                speed: 0.005 + Math.random() * 0.01
            });
        }
    }

    function drawStars() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#EAE8E4';

        stars.forEach(star => {
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // Simple pulse animation
            star.opacity += star.speed;
            if (star.opacity > 1 || star.opacity < 0.1) {
                star.speed = -star.speed;
            }
        });

        requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', initStars);
    initStars();
    drawStars();
}

// Navbar behavior
const navbar = document.getElementById('navbar');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
    });
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Navbar scroll effect
    if (scrolled > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hero content scale and fade effect
    if (heroTitle && heroSubtitle) {
        const threshold = window.innerHeight * 0.8;
        const scaleFactor = Math.max(0.4, 1 - (scrolled / threshold));
        const opacityFactor = Math.max(0, 1 - (scrolled / (threshold * 0.5)));
        
        heroTitle.style.transform = `scale(${scaleFactor})`;
        heroSubtitle.style.transform = `scale(${Math.max(0.7, scaleFactor)})`;
        heroTitle.style.opacity = opacityFactor;
        heroSubtitle.style.opacity = opacityFactor;
    }
});

// Custom Cursor Follower
const cursor = document.createElement('div');
cursor.className = 'cursor-follower';
const isDesktop = !('ontouchstart' in window) && window.innerWidth > 1024;

if (isDesktop) {
    document.body.appendChild(cursor);
    document.documentElement.classList.add('has-custom-cursor');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let hasMoved = false;

    document.addEventListener('mousemove', (e) => {
        if (!hasMoved) {
            hasMoved = true;
            cursor.classList.add('active');
        }
        
        // Immediate position update to eliminate delay
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    });

    // Use event delegation for hover effects
    const interactiveSelectors = 'a, button, .slider-btn, .side-nav-dot, .submit-btn, .logo, .social-icon-link, .view-demo-btn, .order-btn, #closeLightbox, summary, .project-image';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursor.classList.add('hovering');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursor.classList.remove('hovering');
        }
    });

    // Magnetic Elements
    const magneticElements = document.querySelectorAll('.logo, .social-icon-link, .slider-btn, .submit-btn, .order-btn');
    magneticElements.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            item.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translate3d(0, 0, 0)';
        });
    });
}

// Form Submission Handler
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const button = contactForm.querySelector('button');
        const originalText = button.textContent;
        
        button.disabled = true;
        button.textContent = 'Sending...';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = 'Thanks! Your message has been sent.';
                formStatus.className = 'form-status active success';
                contactForm.reset();
            } else {
                const data = await response.json();
                if (data && data.message) {
                    formStatus.textContent = data.message;
                } else {
                    formStatus.textContent = 'Oops! There was a problem submitting your form.';
                }
                formStatus.className = 'form-status active error';
            }
        } catch (error) {
            formStatus.textContent = 'Oops! There was a problem submitting your form.';
            formStatus.className = 'form-status active error';
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger').forEach(el => revealObserver.observe(el));

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Hero title parallax
    if (heroTitle) {
        heroTitle.style.transform = `translateY(${scrollPos * 0.1}px)`;
        heroTitle.style.opacity = 1 - (scrollPos / 800);
    }
    
    // Project image parallax
    document.querySelectorAll('.parallax-wrap img').forEach(img => {
        const speed = 0.05;
        const rect = img.parentElement.getBoundingClientRect();
        const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
        img.style.transform = `translateY(${offset}px) scale(1.1)`;
    });
});

// Image Lightbox/Zoom
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('closeLightbox');
const projectImages = document.querySelectorAll('.project-image img');

if (lightbox && lightboxImg && closeLightbox) {
    projectImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeTarget = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeLightbox.addEventListener('click', closeTarget);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeTarget();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeTarget();
        }
    });
}

// Side Navigation Logic
const sideNavDots = document.querySelectorAll('.side-nav-dot');
const sections = document.querySelectorAll('section[id]');
const sideNav = document.getElementById('sideNav');
let labelFadeTimeout;

if (sideNavDots.length > 0 && sections.length > 0 && sideNav) {
    const updateActiveDot = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop - 200) {
                currentSectionId = section.getAttribute('id');
            }
        });

        let changed = false;
        sideNavDots.forEach(dot => {
            const dotSection = dot.getAttribute('data-section');
            if (dotSection === currentSectionId && !dot.classList.contains('active')) {
                changed = true;
            }
            
            dot.classList.remove('active');
            if (dotSection === currentSectionId) {
                dot.classList.add('active');
            }
        });

        // If the section changed, show labels and set timeout to fade them
        if (changed || !sideNav.classList.contains('labels-faded')) {
            sideNav.classList.remove('labels-faded');
            
            if (labelFadeTimeout) clearTimeout(labelFadeTimeout);
            
            labelFadeTimeout = setTimeout(() => {
                sideNav.classList.add('labels-faded');
            }, 2000);
        }
    };

    window.addEventListener('scroll', updateActiveDot);
    
    // Initial call
    updateActiveDot();
    
    sideNavDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href');
            const targetOffset = document.querySelector(targetId).offsetTop;
            
            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });
        });
    });
}

// Project Slider Logic
const projectTrack = document.getElementById('projectTrack');
const prevBtn = document.getElementById('prevProject');
const nextBtn = document.getElementById('nextProject');
const projectGrid = document.querySelector('.project-grid');

if (projectTrack && projectGrid && prevBtn && nextBtn) {
    let isAnimating = false;

    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        const firstItem = projectGrid.firstElementChild;
        projectTrack.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        projectTrack.style.transform = `translateX(calc(-100% - 3rem))`;

        setTimeout(() => {
            projectTrack.style.transition = 'none';
            projectGrid.appendChild(firstItem);
            projectTrack.style.transform = 'translateX(0)';
            isAnimating = false;
        }, 700);
    });

    prevBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        const lastItem = projectGrid.lastElementChild;
        projectTrack.style.transition = 'none';
        projectGrid.insertBefore(lastItem, projectGrid.firstElementChild);
        projectTrack.style.transform = `translateX(calc(-100% - 3rem))`;

        // Force reflow to ensure the transform applies before transitioning
        void projectTrack.offsetWidth;

        projectTrack.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        projectTrack.style.transform = 'translateX(0)';

        setTimeout(() => {
            isAnimating = false;
        }, 700);
    });

    // Hide slider buttons when features are expanded to prevent overlap
    const featureDetails = document.querySelectorAll('.mobile-interactive-features');
    if (featureDetails.length > 0) {
        featureDetails.forEach(detail => {
            detail.addEventListener('click', (e) => {
                const summary = e.target.closest('summary');
                if (summary) {
                    e.preventDefault();
                    const content = detail.querySelector('.features-list-wrapper');

                    if (detail.hasAttribute('open')) {
                        content.style.height = content.scrollHeight + 'px';
                        detail.classList.add('closing');
                        // reflow
                        content.offsetHeight;
                        content.style.height = '0px';

                        setTimeout(() => {
                            detail.removeAttribute('open');
                            detail.classList.remove('closing');
                            content.style.height = '';
                            detail.dispatchEvent(new Event('toggle'));
                        }, 300);
                    } else {
                        detail.setAttribute('open', '');
                        content.style.height = '0px';
                        // reflow
                        content.offsetHeight;
                        content.style.height = content.scrollHeight + 'px';

                        setTimeout(() => {
                            content.style.height = '';
                            detail.dispatchEvent(new Event('toggle'));
                        }, 300);
                    }
                }
            });

            detail.addEventListener('toggle', () => {
                const anyOpen = Array.from(featureDetails).some(d => d.open && !d.classList.contains('closing'));
                if (anyOpen) {
                    prevBtn.style.opacity = '0';
                    prevBtn.style.pointerEvents = 'none';
                    nextBtn.style.opacity = '0';
                    nextBtn.style.pointerEvents = 'none';
                } else {
                    prevBtn.style.opacity = '1';
                    prevBtn.style.pointerEvents = 'auto';
                    nextBtn.style.opacity = '1';
                    nextBtn.style.pointerEvents = 'auto';
                }
            });
        });
    }
}



