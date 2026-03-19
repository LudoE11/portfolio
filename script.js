document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('backToTop');
    const navbar = document.getElementById('main-nav');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    function toggleMobileMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                history.pushState(null, null, targetId);
            }
        });
    });

    function updateActiveNav() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const navbarHeight = navbar.offsetHeight;

            if (window.pageYOffset >= (sectionTop - navbarHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
            navbar.classList.add('scrolled');
        } else {
            backToTopBtn.classList.remove('visible');
            navbar.classList.remove('scrolled');
        }
    }

    backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        updateActiveNav();
        toggleBackToTop();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    updateActiveNav();
    toggleBackToTop();

    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        document.addEventListener('touchstart', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                document.body.style.zoom = '0.99';
            }
        }, false);

        document.addEventListener('touchend', function () {
            setTimeout(function () {
                document.body.style.zoom = '';
            }, 100);
        }, false);
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                ticking = false;
            });
            ticking = true;
        }
    });



    const cvLink = document.querySelector('.cv-download');

    if (cvLink) {
        cvLink.addEventListener('click', function (e) {
            e.preventDefault();

            const url = this.getAttribute('href');
            const filename = 'CV_ERTZER_Ludovic.pdf';

            const newWindow = window.open(url, '_blank');

            if (newWindow) {
                newWindow.focus();
            } else {
                window.location.href = url;
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const privacy = document.getElementById('privacy').checked;
            if (!privacy) {
                showMessage(formError, 'Vous devez accepter la politique de confidentialité');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;

            formSuccess.style.display = 'none';
            formError.style.display = 'none';

            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showMessage(formSuccess, 'Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.');
                    this.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            } catch (error) {
                showMessage(formError, 'Une erreur est survenue. Vous pouvez m\'écrire directement à ludovic.ertzer@orange.fr');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    function showMessage(element, text) {
        if (element && text) {
            element.textContent = text;
            element.style.display = 'block';

            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            setTimeout(() => {
                element.style.display = 'none';
            }, 8000);
        }
    }


    function showFormMessage(text, type) {
        if (!formMessage) return;

        formMessage.textContent = text;
        formMessage.style.display = 'block';
        formMessage.style.padding = '15px';
        formMessage.style.marginTop = '15px';
        formMessage.style.borderRadius = 'var(--border-radius-sm)';
        formMessage.style.fontSize = '14px';

        if (type === 'success') {
            formMessage.style.backgroundColor = 'rgba(46, 204, 113, 0.15)';
            formMessage.style.color = '#2ecc71';
            formMessage.style.border = '1px solid rgba(46, 204, 113, 0.3)';
        } else {
            formMessage.style.backgroundColor = 'rgba(231, 76, 60, 0.15)';
            formMessage.style.color = '#e74c3c';
            formMessage.style.border = '1px solid rgba(231, 76, 60, 0.3)';
        }

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 8000);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');

        inputs.forEach(input => {
            input.addEventListener('focus', function () {
                this.style.borderColor = 'var(--blue)';
                this.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
            });

            input.addEventListener('blur', function () {
                this.style.boxShadow = 'none';
                if (!this.value) {
                    this.style.borderColor = '#2a313a';
                }
            });
        });
    });

});