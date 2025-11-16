// Slide Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    let currentSlide = 0;
    let slide1HintStarted = false;
    let slide1HintClicked = false;
    let slide1HintCycleTimeout = null;

    // Load slide content from text files
    loadSlideContent();

    // Load slide content from text files
    async function loadSlideContent() {
        try {
            // Load slide 0 content
            const slide0Response = await fetch('txt/slide0.txt');
            const slide0Text = await slide0Response.text();
            parseAndDisplaySlideContent(slide0Text, 'slide0');
            
            // Load slide 1 content
            const slide1Response = await fetch('txt/slide1.txt');
            const slide1Text = await slide1Response.text();
            parseAndDisplaySlideContent(slide1Text, 'slide1');
        } catch (error) {
            console.error('Error loading slide content:', error);
        }
    }

    // Function to parse text file and display content
    function parseAndDisplaySlideContent(text, slideId) {
        const lines = text.trim().split('\n').filter(line => line.trim() !== '');
        
        // Set specific headings for slides
        if (slideId === 'slide0') {
            const headingElement = document.getElementById(`${slideId}-heading`);
            if (headingElement) {
                headingElement.textContent = "Reimagining the Omniverse Launcher";
            }
            
            // All lines become content paragraphs for slide0
            const contentElement = document.getElementById(`${slideId}-content`);
            if (contentElement && lines.length > 0) {
                contentElement.innerHTML = lines.map(line => `<p>${line}</p>`).join('');
            }
        } else if (slideId === 'slide1') {
            const headingElement = document.getElementById(`${slideId}-heading`);
            if (headingElement) {
                headingElement.textContent = "1. Simplifying Software Interoperability";
            }
            
            // All lines become content paragraphs for slide1
            const contentElement = document.getElementById(`${slideId}-content`);
            if (contentElement && lines.length > 0) {
                contentElement.innerHTML = lines.map(line => `<p>${line}</p>`).join('');
            }
        } else {
            // For other slides, use first line as heading
            if (lines.length > 0) {
                const heading = lines[0];
                const headingElement = document.getElementById(`${slideId}-heading`);
                if (headingElement) {
                    headingElement.textContent = heading;
                }

                // Remaining lines are content paragraphs
                const contentLines = lines.slice(1);
                const contentElement = document.getElementById(`${slideId}-content`);
                if (contentElement && contentLines.length > 0) {
                    contentElement.innerHTML = contentLines.map(line => `<p>${line}</p>`).join('');
                }
            }
        }
    }

    // Function to scroll to a specific slide
    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < sections.length) {
            currentSlide = slideIndex;
            sections[currentSlide].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Function to go to next slide
    function nextSlide() {
        if (currentSlide < sections.length - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    // Function to go to previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Keyboard event listener
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowRight':
            case '>':
                event.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case '<':
                event.preventDefault();
                prevSlide();
                break;
            case 'Home':
                event.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                event.preventDefault();
                goToSlide(sections.length - 1);
                break;
        }
    });

    // Update current slide index when user scrolls manually
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find which slide is currently visible
                for (let i = 0; i < sections.length; i++) {
                    if (sections[i] === entry.target) {
                        currentSlide = i;
                        break;
                    }
                }

                // Start hint cycle when slide1 (overview) first becomes visible
                if (entry.target.id === 'overview' && !slide1HintStarted) {
                    const hintEl = document.getElementById('slide1-hint');
                    if (hintEl) {
                        slide1HintStarted = true;
                        // Initial delay of 5 seconds before first appearance
                        setTimeout(() => {
                            if (!slide1HintClicked) {
                                runSlide1HintCycle(hintEl);
                            }
                        }, 3000);
                    }
                }
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the slide is visible
    });

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Navigation click handlers for header navigation
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            goToSlide(index);
        });
    });

    console.log('Slide navigation initialized!');
    console.log('Use arrow keys (← →) or < > keys to navigate between slides');
    console.log('Use Home/End keys to jump to first/last slide');
    console.log('Slide content loaded from external text files');

    // Slide 1 image toggle logic
    const slide1Image = document.getElementById('slide1-image');
    if (slide1Image) {
        const primarySrc = slide1Image.getAttribute('src');
        const altSrc = slide1Image.getAttribute('data-alt-src');
        slide1Image.style.cursor = 'pointer';
        slide1Image.addEventListener('click', () => {
            const currentSrc = slide1Image.getAttribute('src');
            if (currentSrc === primarySrc) {
                slide1Image.setAttribute('src', altSrc);
            } else {
                slide1Image.setAttribute('src', primarySrc);
            }
            // Stop hint cycle on first user click
            if (!slide1HintClicked) {
                slide1HintClicked = true;
                const hintEl = document.getElementById('slide1-hint');
                if (hintEl) {
                    hintEl.classList.remove('visible');
                }
                if (slide1HintCycleTimeout) {
                    clearTimeout(slide1HintCycleTimeout);
                }
            }
        });
    }

    // Hint cycle function: show for 1s, hide for 1.5s, repeat until clicked
    function runSlide1HintCycle(hintEl) {
        if (slide1HintClicked) return;
        // Show hint
        hintEl.classList.add('visible');
        setTimeout(() => {
            hintEl.classList.remove('visible');
            // Schedule next cycle after 1.5s hidden period
            slide1HintCycleTimeout = setTimeout(() => {
                runSlide1HintCycle(hintEl);
            }, 1500);
        }, 1000); // Visible for 1 second
    }
});