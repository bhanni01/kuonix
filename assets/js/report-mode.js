/**
 * Report presentation mode.
 * Adds full-screen slide behavior with keyboard and button navigation.
 */

export function initReportMode() {
    const body = document.body;
    const slides = Array.from(document.querySelectorAll('.report-slide'));
    const triggerButtons = document.querySelectorAll('[data-present-trigger], #present-toggle');
    const nextButton = document.querySelector('[data-present-next]');
    const prevButton = document.querySelector('[data-present-prev]');
    const exitButton = document.querySelector('[data-present-exit]');

    if (!body.classList.contains('report-page') || slides.length === 0) return;

    let currentIndex = 0;

    const scrollToSlide = (index) => {
        const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
        currentIndex = nextIndex;
        slides[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const enterPresentMode = async () => {
        body.classList.add('present-mode');

        if (!document.fullscreenElement) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (error) {
                console.warn('Fullscreen request was not completed.', error);
            }
        }

        scrollToSlide(currentIndex);
    };

    const exitPresentMode = async () => {
        body.classList.remove('present-mode');

        if (document.fullscreenElement) {
            try {
                await document.exitFullscreen();
            } catch (error) {
                console.warn('Exiting fullscreen was not completed.', error);
            }
        }
    };

    triggerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            void enterPresentMode();
        });
    });

    nextButton?.addEventListener('click', () => {
        scrollToSlide(currentIndex + 1);
    });

    prevButton?.addEventListener('click', () => {
        scrollToSlide(currentIndex - 1);
    });

    exitButton?.addEventListener('click', () => {
        void exitPresentMode();
    });

    document.addEventListener('keydown', (event) => {
        if (!body.classList.contains('present-mode')) return;

        if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
            event.preventDefault();
            scrollToSlide(currentIndex + 1);
        }

        if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
            event.preventDefault();
            scrollToSlide(currentIndex - 1);
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            void exitPresentMode();
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    currentIndex = slides.indexOf(entry.target);
                }
            });
        },
        {
            threshold: 0.55,
        }
    );

    slides.forEach((slide) => observer.observe(slide));

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && body.classList.contains('present-mode')) {
            body.classList.remove('present-mode');
        }
    });
}
