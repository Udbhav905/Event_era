// Main Application
class App {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupGlobalEventListeners();
    }

    setupNavigation() {
        // Highlight active navigation link
        const navLinks = document.querySelectorAll('.nav-menu a');
        const sections = document.querySelectorAll('main section');

        const highlightNav = () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', highlightNav);
        // Initial highlight
        setTimeout(highlightNav, 100);
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupGlobalEventListeners() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
        });

        // Close modals with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        });
    }
}
// Demo Tour functionality
let currentTourStep = 0;
let tourSteps = [];

function showDemo() {
    const demoModal = document.getElementById('demoModal');
    if (demoModal) {
        demoModal.classList.remove('hidden');
    }
}

function startInteractiveTour() {
    // Close demo modal
    const demoModal = document.getElementById('demoModal');
    if (demoModal) {
        demoModal.classList.add('hidden');
    }

    // Define tour steps with more specific selectors
    tourSteps = [
        {
            element: '.hero',
            title: 'Welcome to Eventera! 🎉',
            description: 'Discover amazing events near you. Our platform helps you find, create, and manage events effortlessly.',
            position: 'bottom'
        },
        {
            element: '.hero-actions',
            title: 'Quick Actions',
            description: 'Explore events or watch demos to learn more about our platform.',
            position: 'bottom'
        },
        {
            element: '#events',
            title: 'Browse Events',
            description: 'Discover various events filtered by categories, dates, and locations.',
            position: 'top'
        },
        {
            element: '.search-filter-container',
            title: 'Smart Search & Filters',
            description: 'Use our advanced search and filters to find exactly what you\'re looking for.',
            position: 'bottom'
        },
        {
            element: '.events-grid',
            title: 'Event Cards',
            description: 'Each event card shows key information. Click to view details and register.',
            position: 'top'
        },
        {
            element: '#create',
            title: 'Create Events',
            description: 'Easily create your own events with our simple form. Add images, videos, and detailed information.',
            position: 'top'
        },
        {
            element: '.create-form-container',
            title: 'Event Creation Form',
            description: 'Fill out this simple form to create your own event in minutes.',
            position: 'left'
        },
        {
            element: '.auth-buttons',
            title: 'Join Our Community',
            description: 'Sign up to save events, get personalized recommendations, and create your own events!',
            position: 'left'
        }
    ];

    currentTourStep = 0;
    showTourStep(currentTourStep);
}

function showTourStep(stepIndex) {
    // Clear previous tour state
    clearTour();

    if (stepIndex >= tourSteps.length) {
        // Tour completed
        Utils.showNotification('🎉 Tour completed! Ready to explore Eventera?', 'success');
        return;
    }

    const step = tourSteps[stepIndex];
    
    // Wait for DOM to be ready and try to find element
    setTimeout(() => {
        let element = document.querySelector(step.element);
        
        // If element not found, try alternative selectors
        if (!element) {
            element = findAlternativeElement(step.element);
        }
        
        if (element) {
            // Add overlay
            const overlay = document.createElement('div');
            overlay.className = 'tour-overlay';
            overlay.id = 'tourOverlay';
            document.body.appendChild(overlay);

            // Highlight element
            element.classList.add('tour-highlight');
            
            // Scroll to element with offset for header
            const elementRect = element.getBoundingClientRect();
            const offsetPosition = elementRect.top + window.pageYOffset - 80; // 80px for header
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Show tooltip after scroll completes
            setTimeout(() => {
                showTourTooltip(element, step, stepIndex);
            }, 800);
        } else {
            // If element still not found, skip to next step
            console.warn(`Element not found: ${step.element}, skipping to next step`);
            showTourStep(stepIndex + 1);
        }
    }, 100);
}

function findAlternativeElement(selector) {
    // Provide alternative selectors for common elements
    const alternatives = {
        '.hero-actions': '.hero .hero-actions, .hero-actions',
        '#events': '#events, .events-section',
        '.search-filter-container': '.search-filter-container, .search-box',
        '.events-grid': '.events-grid, #eventsContainer',
        '#create': '#create, .create-section',
        '.create-form-container': '.create-form-container, .event-form',
        '.auth-buttons': '.auth-buttons, #loginBtn, #registerBtn'
    };
    
    if (alternatives[selector]) {
        return document.querySelector(alternatives[selector]);
    }
    
    return null;
}

function showTourTooltip(element, step, stepIndex) {
    const tooltip = document.getElementById('tourTooltip');
    
    // Create tooltip content with progress indicator
    const progress = `${stepIndex + 1}/${tourSteps.length}`;
    
    tooltip.innerHTML = `
        <div class="tour-progress">${progress}</div>
        <h3>${step.title}</h3>
        <p>${step.description}</p>
        <div class="tour-tooltip-actions">
            <button onclick="previousTourStep()" ${stepIndex === 0 ? 'disabled' : ''}>
                <i class="fas fa-arrow-left"></i> Back
            </button>
            <button onclick="nextTourStep()" class="btn-primary">
                ${stepIndex === tourSteps.length - 1 ? 
                    '<i class="fas fa-flag-checkered"></i> Finish' : 
                    'Next <i class="fas fa-arrow-right"></i>'}
            </button>
        </div>
        <div class="tour-skip">
            <button onclick="endTour()" class="btn-ghost">
                Skip Tour
            </button>
        </div>
    `;
    
    tooltip.classList.remove('hidden');
    
    // Position tooltip
    positionTourTooltip(element, tooltip, step.position);
}

function positionTourTooltip(element, tooltip, position) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    let top, left;

    switch (position) {
        case 'top':
            top = rect.top + scrollTop - tooltipRect.height - 20;
            left = rect.left + scrollLeft + rect.width/2 - tooltipRect.width/2;
            break;
        case 'bottom':
            top = rect.bottom + scrollTop + 20;
            left = rect.left + scrollLeft + rect.width/2 - tooltipRect.width/2;
            break;
        case 'left':
            top = rect.top + scrollTop + rect.height/2 - tooltipRect.height/2;
            left = rect.left + scrollLeft - tooltipRect.width - 20;
            break;
        case 'right':
            top = rect.top + scrollTop + rect.height/2 - tooltipRect.height/2;
            left = rect.right + scrollLeft + 20;
            break;
        default:
            top = rect.bottom + scrollTop + 20;
            left = rect.left + scrollLeft + rect.width/2 - tooltipRect.width/2;
    }

    // Ensure tooltip stays within viewport
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    // Adjust horizontal position
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewport.width - 10) {
        left = viewport.width - tooltipRect.width - 10;
    }

    // Adjust vertical position
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewport.height + scrollTop - 10) {
        top = viewport.height + scrollTop - tooltipRect.height - 10;
    }

    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
}

function nextTourStep() {
    currentTourStep++;
    showTourStep(currentTourStep);
}

function previousTourStep() {
    if (currentTourStep > 0) {
        currentTourStep--;
        showTourStep(currentTourStep);
    }
}

function endTour() {
    clearTour();
    Utils.showNotification('Tour ended. Feel free to explore on your own!', 'info');
}

function clearTour() {
    // Remove highlights
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });
    
    // Remove overlay
    const overlay = document.getElementById('tourOverlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Hide tooltip
    const tooltip = document.getElementById('tourTooltip');
    if (tooltip) {
        tooltip.classList.add('hidden');
    }
}

// Update the existing showDemoAlert function
function showDemoAlert() {
    showDemo();
}

// Add event listeners for demo modal and tour
document.addEventListener('DOMContentLoaded', function() {
    // Demo modal close event
    document.addEventListener('click', function(e) {
        const demoModal = document.getElementById('demoModal');
        if (demoModal && !demoModal.classList.contains('hidden')) {
            if (e.target.classList.contains('close') || e.target.id === 'demoModal') {
                demoModal.classList.add('hidden');
            }
        }
    });

    // Close tour when clicking on overlay
    document.addEventListener('click', function(e) {
        if (e.target.id === 'tourOverlay') {
            endTour();
        }
    });
});

// Keyboard navigation for tour
document.addEventListener('keydown', function(e) {
    const tooltip = document.getElementById('tourTooltip');
    if (!tooltip || tooltip.classList.contains('hidden')) return;

    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            nextTourStep();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousTourStep();
            break;
        case 'Escape':
            e.preventDefault();
            endTour();
            break;
    }
});
// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});