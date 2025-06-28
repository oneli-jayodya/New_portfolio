// Smooth scrolling and immediate animation trigger for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('header nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Wait for scroll to complete, then manually trigger ScrollReveal for this section
                setTimeout(() => {
                    // Manually reveal all ScrollReveal elements in the target section
                    const elementsToReveal = targetSection.querySelectorAll('.education-item, .skill-category, .skill-icon, .soft-skill-item');
                    
                    elementsToReveal.forEach(element => {
                        // Force ScrollReveal to show the element immediately
                        if (typeof ScrollReveal !== 'undefined') {
                            element.style.visibility = 'visible';
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0) translateX(0)';
                        }
                    });
                    
                    // Also trigger any counter animations if we're in skills section
                    if (targetId === 'skills') {
                        const counters = targetSection.querySelectorAll(".number");
                        counters.forEach(counter => {
                            const target = +counter.dataset.target;
                            let start = 0;
                            const increment = target / (1500 / 16);

                            const update = () => {
                                start += increment;
                                if (start < target) {
                                    counter.textContent = Math.ceil(start);
                                    requestAnimationFrame(update);
                                } else {
                                    counter.textContent = target;
                                }
                            };
                            requestAnimationFrame(update);
                        });
                    }
                }, 800); // Wait for smooth scroll to complete
            }
        });
    });
});

// menu icon 
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};
    
    
    // scroll activate
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');


window.onscroll = () =>{

    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active')
            })
        }
    })

    // stick nav 
let header = document.querySelector('.header');

header.classList.toggle('sticky',window.scrollY > 100);

    // remove menu 
menuIcon.classList.remove('bx-x');
navbar.classList.remove('active');

};

document.addEventListener("DOMContentLoaded", () => {
      const counters = document.querySelectorAll(".number");
      const DURATION = 1500;

      counters.forEach(counter => {
        const target = +counter.dataset.target;
        let start = 0;
        const increment = target / (DURATION / 16);

        const update = () => {
          start += increment;
          if (start < target) {
            counter.textContent = Math.ceil(start);
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        };

        requestAnimationFrame(update);
      });
    });

    // dark mode 
let darkmodeicon = document.querySelector('#darkmode');

darkmodeicon.onclick = () => {
    darkmodeicon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode')
};

// Initialize ScrollReveal with better settings for navigation
ScrollReveal({
    reset: false, // Don't reset animations when scrolling back up
    distance: '30px',
    duration: 800,
    delay: 50,
    mobile: true,
    viewFactor: 0.1, // Trigger animation when only 10% of element is visible
    opacity: 0 // Start with elements visible, just animate position
});

// Apply ScrollReveal animations
ScrollReveal().reveal('.home-content, .heading',{origin: 'top'});
ScrollReveal().reveal('.home-img img, .services-container, .project-box, .contact form',{origin: 'bottom'});
ScrollReveal().reveal('.home-content h1, .about-img img',{origin: 'left'});
ScrollReveal().reveal('.home-content h3, .home-content p, .about-content',{origin: 'right'});

// Separate, gentler animations for education and skills that won't break navigation
ScrollReveal().reveal('.education-item',{
    origin: 'bottom',
    distance: '20px',
    duration: 600,
    delay: 100,
    interval: 200,
    viewFactor: 0.1
});

ScrollReveal().reveal('.education-icon',{
    origin: 'left',
    distance: '20px',
    duration: 600,
    delay: 200,
    viewFactor: 0.1
});

ScrollReveal().reveal('.skill-category, .skill-icon',{
    origin: 'bottom',
    distance: '20px',
    duration: 600,
    delay: 100,
    interval: 150,
    viewFactor: 0.1
});

ScrollReveal().reveal('.soft-skill-item',{
    origin: 'right',
    distance: '20px',
    duration: 600,
    delay: 100,
    interval: 100,
    viewFactor: 0.1
});

// Portfolio Filter System
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio filter system initializing...');
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const portfolioContainer = document.querySelector('.portfolio-container');
    
    console.log('Found filter buttons:', filterBtns.length);
    console.log('Found portfolio cards:', portfolioCards.length);

    // Check if GSAP is available
    const gsapAvailable = typeof gsap !== 'undefined';
    console.log('GSAP available:', gsapAvailable);

    if (gsapAvailable) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initial GSAP animations for portfolio cards only
        gsap.set('.portfolio-card', { opacity: 0, y: 50, scale: 0.9 });
        
        gsap.to('.portfolio-card', {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.portfolio-container',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Ensure filter buttons are always visible - no animation
        gsap.set('.filter-btn', { opacity: 1, y: 0, visibility: 'visible' });
    }

    // Enhanced filter function with GSAP animations
    function filterProjects(selectedBtn) {
        console.log('Filter function called');
        
        // Remove active class from all buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        selectedBtn.classList.add('active');
        
        // Get filter value
        const filterValue = selectedBtn.getAttribute('data-filter');
        console.log('Filter value:', filterValue);
        
        // Add filtering class for smooth transition
        if (portfolioContainer) {
            portfolioContainer.classList.add('filtering');
        }

        if (gsapAvailable) {
            // GSAP Enhanced Animation
            const tl = gsap.timeline();
            
            // First, animate out all cards
            tl.to('.portfolio-card', {
                opacity: 0,
                scale: 0.8,
                rotationY: 90,
                duration: 0.4,
                stagger: 0.05,
                ease: "power2.in"
            })
            .call(() => {
                // Hide/show cards based on filter
                portfolioCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hide');
                        card.classList.add('show');
                    } else {
                        card.classList.add('hide');
                        card.classList.remove('show');
                    }
                });
            })
            .to('.portfolio-card.show', {
                opacity: 1,
                scale: 1,
                rotationY: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)"
            });

            // Button click animation
            gsap.to(selectedBtn, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });

        } else {
            // Fallback without GSAP
            portfolioCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.add('hide');
                    card.classList.remove('show');
                }
            });
        }
        
        // Remove filtering class after animation
        setTimeout(() => {
            if (portfolioContainer) {
                portfolioContainer.classList.remove('filtering');
            }
        }, 1000);
    }

    // Initialize filter system
    function initializeFilter() {
        filterBtns.forEach((btn, index) => {
            console.log(`Adding click listener to button ${index}:`, btn.getAttribute('data-filter'));
            
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Filter button clicked:', this.getAttribute('data-filter'));
                filterProjects(this);
            });

            // Add hover effects
            if (gsapAvailable) {
                btn.addEventListener('mouseenter', () => {
                    if (!btn.classList.contains('active')) {
                        gsap.to(btn, {
                            y: -5,
                            scale: 1.05,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                });
                
                btn.addEventListener('mouseleave', () => {
                    if (!btn.classList.contains('active')) {
                        gsap.to(btn, {
                            y: 0,
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                });
            }
        });
    }

    // Enhanced hover effects for portfolio cards
    function initializeCardHovers() {
        if (!gsapAvailable) return;

        portfolioCards.forEach(card => {
            const cardImage = card.querySelector('.card-image img');
            const techTags = card.querySelectorAll('.tech-tag');
            const btnLinks = card.querySelectorAll('.btn-link');
            
            card.addEventListener('mouseenter', () => {
                // Subtle card lift
                gsap.to(card, {
                    y: -5,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Image zoom
                if (cardImage) {
                    gsap.to(cardImage, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                
                // Tech tags glow effect
                gsap.to(techTags, {
                    scale: 1.05,
                    duration: 0.2,
                    stagger: 0.02,
                    ease: "power2.out"
                });
                
                // Button links subtle animation
                gsap.to(btnLinks, {
                    x: 3,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset all animations
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                if (cardImage) {
                    gsap.to(cardImage, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                
                gsap.to(techTags, {
                    scale: 1,
                    duration: 0.2,
                    stagger: 0.02,
                    ease: "power2.out"
                });
                
                gsap.to(btnLinks, {
                    x: 0,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power2.out"
                });
            });
        });
    }

    // Initialize everything
    initializeFilter();
    initializeCardHovers();
    
    // Force filter buttons to be visible (fix for disappearing issue)
    setTimeout(() => {
        filterBtns.forEach(btn => {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
            btn.style.display = 'flex';
        });
    }, 100);
    
    console.log('Portfolio filter system initialized successfully');
});

// Counter animation with intersection observer
function initializeCounters() {
    const counters = document.querySelectorAll('.number');
    const options = {
        threshold: 0.7
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerText: 1 },
                    onUpdate: function() {
                        counter.innerText = Math.ceil(counter.innerText);
                    }
                });
                
                observer.unobserve(counter);
            }
        });
    }, options);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Initialize counters when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCounters);

// Skills icon animation
function animateSkillIcons() {
    const skillIcons = document.querySelectorAll('.skill-icon');
    
    skillIcons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.opacity = '1';
            icon.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Intersection Observer for skill icons
function observeSkillIcons() {
    const skillsSection = document.querySelector('.skills');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillIcons();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.ceil(current);
        }, 20);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skill bar observer
    observeSkillIcons();
    
    // Animate counters when stats section is visible
    const statsSection = document.querySelector('.box');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        statsObserver.observe(statsSection);
    }
    
    // GSAP animations for education and skills if GSAP is available
    if (typeof gsap !== 'undefined') {
        // Education items animation
        gsap.from('.education-item', {
            duration: 1,
            y: 100,
            opacity: 0,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.education',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Skills columns animation
        gsap.from('.skills-column', {
            duration: 1,
            x: -100,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.skills-container',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Soft skills animation
        gsap.from('.soft-skill-item', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.soft-skills-grid',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    }
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('header nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            console.log('Clicking:', targetId, 'Found section:', targetSection);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100; // Account for header height
                
                console.log('Scrolling to:', offsetTop);
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('header nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
                
                // Close mobile menu if open
                if (menuIcon && navbar) {
                    menuIcon.classList.remove('bx-x');
                    navbar.classList.remove('active');
                }
            } else {
                console.error('Section not found:', targetId);
            }
        });
    });
});

// Fallback: Ensure all sections are visible on page load
window.addEventListener('load', function() {
    // Force all potential hidden elements to be visible
    const allAnimatedElements = document.querySelectorAll('.education-item, .education-icon, .skills-column, .skill-item, .soft-skill-item');
    
    allAnimatedElements.forEach(element => {
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.transform = 'none';
    });
});

// Additional check for hash navigation on page load
window.addEventListener('DOMContentLoaded', function() {
    // If there's a hash in the URL, ensure that section's content is visible
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            setTimeout(() => {
                const elementsInSection = targetSection.querySelectorAll('.education-item, .education-icon, .skills-column, .skill-item, .soft-skill-item');
                elementsInSection.forEach(element => {
                    element.style.visibility = 'visible';
                    element.style.opacity = '1';
                    element.style.transform = 'none';
                });
            }, 100);
        }
    }
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('input[type="submit"]');
            const originalBtnText = submitBtn.value;
            
            // Show loading state
            submitBtn.value = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Send AJAX request to Vercel API
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                // Reset button state
                submitBtn.value = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                // Show message
                showContactMessage(data.message, data.success);
                
                // Reset form if successful
                if (data.success) {
                    contactForm.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Reset button state
                submitBtn.value = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                showContactMessage('Sorry, there was an error sending your message. Please try again later.', false);
            });
        });
    }
});

// Function to show contact form messages
function showContactMessage(message, isSuccess) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.contact-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `contact-message ${isSuccess ? 'success' : 'error'}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class='bx ${isSuccess ? 'bx-check-circle' : 'bx-error-circle'}'></i>
            <span>${message}</span>
            <button class="close-message" onclick="this.parentElement.parentElement.remove()">
                <i class='bx bx-x'></i>
            </button>
        </div>
    `;
    
    // Insert message after the form
    const contactForm = document.querySelector('.contact form');
    contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
    
    // Auto-remove success messages after 5 seconds
    if (isSuccess) {
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}