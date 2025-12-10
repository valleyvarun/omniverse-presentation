// Slide Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    let currentSlide = 0;

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

            // Load slide 2 content
            const slide2Response = await fetch('txt/slide2.txt');
            const slide2Text = await slide2Response.text();
            parseAndDisplaySlideContent(slide2Text, 'slide2');

            // Load slide 3 content
            const slide3Response = await fetch('txt/slide3.txt');
            const slide3Text = await slide3Response.text();
            parseAndDisplaySlideContent(slide3Text, 'slide3');

            // Load slide 4 content
            const slide4Response = await fetch('txt/slide4.txt');
            const slide4Text = await slide4Response.text();
            parseAndDisplaySlideContent(slide4Text, 'slide4');

            // Load slide 5 content
            const slide5Response = await fetch('txt/slide5.txt');
            const slide5Text = await slide5Response.text();
            parseAndDisplaySlideContent(slide5Text, 'slide5');

            // Load slide 6 content
            const slide6Response = await fetch('txt/slide6.txt');
            const slide6Text = await slide6Response.text();
            parseAndDisplaySlideContent(slide6Text, 'slide6');
        } catch (error) {
            console.error('Error loading slide content:', error);
        }
    }

    // Function to parse text file and display content
    function parseAndDisplaySlideContent(text, slideId) {
        const lines = text.trim().split('\n').filter(line => line.trim() !== '');
        
        // All lines become content paragraphs
        const contentElement = document.getElementById(`${slideId}-content`);
        if (contentElement && lines.length > 0) {
            contentElement.innerHTML = lines.map(line => `<p>${line}</p>`).join('');
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
});