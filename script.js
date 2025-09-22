// Initialize AOS (Animate On Scroll) Library
AOS.init({
  duration: 1000,
  easing: "ease-out-cubic",
  once: true,
  offset: 50,
});

// Global Variables
let currentTrackIndex = 0;
let isPlaying = false;
let tracks = [
  {
    title: "Ride Your Wave",
    artist: "Gavanni",
    artwork: "New folder/ride your waver cover image.jpg",
    duration: 189, // 3:09 in seconds
  },
  {
    title: "Fever Dream",
    artist: "Gavanni",
    artwork: "New folder/fever dream album cover .jpg",
    duration: 218, // 3:38 in seconds
  },
  {
    title: "Sinking So Deep",
    artist: "Gavanni",
    artwork: "New folder/sinking deep cover.jpg",
    duration: 192, // 3:12 in seconds
  },
  {
    title: "Criminal",
    artist: "Gavanni",
    artwork: "New folder/criminal album cover image.jpg",
    duration: 227, // 3:47 in seconds
  },
];

// DOM Elements
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const heroScrollIndicator = document.querySelector(".scroll-indicator");
const mainPlayBtn = document.getElementById("main-play-btn");
const playIcon = document.getElementById("play-icon");
const audioPlayer = document.getElementById("audio-player");
const currentArtwork = document.getElementById("current-artwork");
const currentTitle = document.getElementById("current-title");
const currentArtist = document.getElementById("current-artist");
const currentTime = document.getElementById("current-time");
const totalTime = document.getElementById("total-time");
const progressBar = document.querySelector(".progress-bar");
const progressFill = document.querySelector(".progress-fill");
const trackPlayBtns = document.querySelectorAll(".track-play-btn");
const videoPlayBtns = document.querySelectorAll(".video-play-btn");
const contactForm = document.getElementById("contact-form");

// Navbar Scroll Effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Music Play/Pause for main track
if (mainPlayBtn && audioPlayer && playIcon) {
  mainPlayBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playIcon.className = "fas fa-pause";
    } else {
      audioPlayer.pause();
      playIcon.className = "fas fa-play";
    }
  });
  audioPlayer.addEventListener("ended", () => {
    playIcon.className = "fas fa-play";
  });
}

// Mobile Navigation Toggle
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");

  // Prevent body scroll when menu is open
  if (navMenu.classList.contains("active")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
});

// Close mobile menu when clicking on nav links
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "auto";
  });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Hero Scroll Indicator
if (heroScrollIndicator) {
  heroScrollIndicator.addEventListener("click", (e) => {
    e.preventDefault();
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      const offsetTop = aboutSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
}

// Music Player Functionality
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateCurrentTrack(trackIndex) {
  const track = tracks[trackIndex];
  currentArtwork.src = track.artwork;
  currentTitle.textContent = track.title;
  currentArtist.textContent = track.artist;
  totalTime.textContent = formatTime(track.duration);

  // Reset progress
  progressFill.style.width = "0%";
  currentTime.textContent = "0:00";

  // Update track card visual states
  trackPlayBtns.forEach((btn, index) => {
    const icon = btn.querySelector("i");
    if (index === trackIndex) {
      icon.className = "fas fa-pause";
    } else {
      icon.className = "fas fa-play";
    }
  });
}

function togglePlayPause() {
  isPlaying = !isPlaying;

  if (isPlaying) {
    playIcon.className = "fas fa-pause";
    startProgressAnimation();
  } else {
    playIcon.className = "fas fa-play";
    stopProgressAnimation();
  }
}

let progressInterval;

function startProgressAnimation() {
  let currentTimeSeconds = 0;
  const track = tracks[currentTrackIndex];

  progressInterval = setInterval(() => {
    currentTimeSeconds += 1;

    if (currentTimeSeconds >= track.duration) {
      // Track finished, move to next or stop
      currentTimeSeconds = 0;
      isPlaying = false;
      playIcon.className = "fas fa-play";
      clearInterval(progressInterval);

      // Auto-play next track (optional)
      setTimeout(() => {
        if (currentTrackIndex < tracks.length - 1) {
          currentTrackIndex++;
          updateCurrentTrack(currentTrackIndex);
          togglePlayPause();
        }
      }, 1000);

      return;
    }

    const progress = (currentTimeSeconds / track.duration) * 100;
    progressFill.style.width = `${progress}%`;
    currentTime.textContent = formatTime(currentTimeSeconds);
  }, 1000);
}

function stopProgressAnimation() {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
}

// Main Play Button
if (mainPlayBtn) {
  mainPlayBtn.addEventListener("click", togglePlayPause);
}

// Track Play Buttons
trackPlayBtns.forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (currentTrackIndex === index && isPlaying) {
      // Pause current track
      togglePlayPause();
    } else {
      // Play selected track
      if (isPlaying) {
        stopProgressAnimation();
      }
      currentTrackIndex = index;
      updateCurrentTrack(index);
      isPlaying = false;
      togglePlayPause();
    }
  });
});

// Progress Bar Click
if (progressBar) {
  progressBar.addEventListener("click", (e) => {
    if (!isPlaying) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = (clickX / rect.width) * 100;

    progressFill.style.width = `${clickPercent}%`;

    const track = tracks[currentTrackIndex];
    const newTimeSeconds = (clickPercent / 100) * track.duration;
    currentTime.textContent = formatTime(newTimeSeconds);

    // Restart progress from new position
    stopProgressAnimation();
    // In a real app, you'd seek the audio to this position
    // For demo purposes, we'll just continue from here
    setTimeout(startProgressAnimation, 100);
  });
}

// Video Play Buttons (Modal or redirect functionality)
videoPlayBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const videoId = btn.getAttribute("data-video");

    // In a real application, you might open a modal with the video
    // For demo purposes, we'll show an alert
    const videoTitles = {
      "afro-vibes": "Afro Vibes - Official Music Video",
      "soulful-nights": "Soulful Nights - Lyric Video",
      "live-utah": "Live in Utah - Concert Highlights",
    };

    showNotification(`Opening ${videoTitles[videoId] || "Video"}...`);

    // You could implement a modal here or redirect to YouTube
    // window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
  });
});

// Contact Form Handling
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Validate form (basic validation)
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Show success message
    showNotification(
      `Thank you ${name}! Your message has been sent. We'll get back to you soon.`,
      "success"
    );

    // Reset form
    contactForm.reset();

    // Remove active states from labels
    setTimeout(() => {
      const labels = contactForm.querySelectorAll("label");
      labels.forEach((label) => {
        label.style.top = "1rem";
        label.style.left = "1rem";
        label.style.fontSize = "1rem";
        label.style.color = "#aaa";
        label.style.background = "transparent";
      });
    }, 100);
  });
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "#4CAF50"
            : type === "error"
            ? "#f44336"
            : "#F4A460"
        };
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after delay
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

// Form Label Animations
function setupFormLabels() {
  const formGroups = document.querySelectorAll(".form-group");

  formGroups.forEach((group) => {
    const input = group.querySelector("input, textarea, select");
    const label = group.querySelector("label");

    if (!input || !label) return;

    // Handle input focus and blur
    input.addEventListener("focus", () => {
      animateLabel(label, true);
    });

    input.addEventListener("blur", () => {
      if (!input.value.trim()) {
        animateLabel(label, false);
      }
    });

    // Check initial state
    if (input.value.trim()) {
      animateLabel(label, true);
    }
  });
}

function animateLabel(label, isActive) {
  if (isActive) {
    label.style.top = "-0.75rem";
    label.style.left = "0.75rem";
    label.style.fontSize = "0.8rem";
    label.style.color = "#F4A460";
    label.style.background = "#2D1810";
    label.style.padding = "0 0.25rem";
  } else {
    label.style.top = "1rem";
    label.style.left = "1rem";
    label.style.fontSize = "1rem";
    label.style.color = "#aaa";
    label.style.background = "transparent";
    label.style.padding = "0";
  }
}

// Newsletter Subscription
function setupNewsletter() {
  const newsletterForm = document.querySelector(".newsletter");
  if (newsletterForm) {
    const input = newsletterForm.querySelector("input");
    const button = newsletterForm.querySelector("button");

    button.addEventListener("click", (e) => {
      e.preventDefault();
      const email = input.value.trim();

      if (!email) {
        showNotification("Please enter your email address.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }

      showNotification(
        "Thank you for subscribing! You'll receive updates about Gavanni's latest music and shows.",
        "success"
      );
      input.value = "";
    });
  }
}

// Parallax Effect for Hero Section
function setupParallax() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    if (scrolled <= window.innerHeight) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  });
}

// Loading Animation
function setupLoadingAnimation() {
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");

    // Trigger additional entrance animations
    setTimeout(() => {
      const heroElements = document.querySelectorAll("[data-aos]");
      heroElements.forEach((element) => {
        element.classList.add("aos-animate");
      });
    }, 500);
  });
}

// Statistics Counter Animation
function setupStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number");

  const observerOptions = {
    threshold: 0.7,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach((stat) => {
    observer.observe(stat);
  });
}

function animateCounter(element) {
  const finalValue = element.textContent;
  const numericValue = parseInt(finalValue.replace(/\D/g, ""));
  const suffix = finalValue.replace(/\d/g, "");
  const duration = 2000; // 2 seconds
  const increment = numericValue / (duration / 16); // 60 FPS

  let currentValue = 0;
  element.textContent = "0" + suffix;

  const counter = setInterval(() => {
    currentValue += increment;

    if (currentValue >= numericValue) {
      element.textContent = finalValue;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(currentValue) + suffix;
    }
  }, 16);
}

// Image Slideshow for Main Gavanni Photo
function setupImageSlideshow() {
  const images = document.querySelectorAll(".main-image");
  if (images.length === 0) return;

  let currentImageIndex = 0;

  // Function to switch to next image
  function switchImage() {
    // Remove active class from current image
    images[currentImageIndex].classList.remove("active");

    // Move to next image (loop back to 0 if at end)
    currentImageIndex = (currentImageIndex + 1) % images.length;

    // Add active class to new image
    images[currentImageIndex].classList.add("active");
  }

  // For now, we'll use the same image but you can add different images later
  // Switch every 2 seconds
  setInterval(switchImage, 2000);
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupFormLabels();
  setupNewsletter();
  setupParallax();
  setupLoadingAnimation();
  setupStatsCounter();
  setupImageSlideshow();

  // Initialize first track
  updateCurrentTrack(0);

  // Add loading class to body initially
  document.body.classList.add("loading");

  // Set total time for the current track
  if (totalTime) {
    totalTime.textContent = formatTime(tracks[0].duration);
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768) {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Social Media Link Handlers
document.addEventListener("click", (e) => {
  if (e.target.closest(".social-link")) {
    e.preventDefault();
    const link = e.target.closest(".social-link");
    const platform = link.querySelector("i").className;

    let platformName = "social media";
    if (platform.includes("spotify")) platformName = "Spotify";
    else if (platform.includes("apple")) platformName = "Apple Music";
    else if (platform.includes("youtube")) platformName = "YouTube";
    else if (platform.includes("instagram")) platformName = "Instagram";
    else if (platform.includes("twitter")) platformName = "Twitter";
    else if (platform.includes("facebook")) platformName = "Facebook";
    else if (platform.includes("tiktok")) platformName = "TikTok";
    else if (platform.includes("soundcloud")) platformName = "SoundCloud";

    showNotification(
      `Opening ${platformName}... Follow Gavanni for the latest updates!`
    );

    // In a real application, these would link to actual social media profiles
    // window.open('https://spotify.com/artist/gavanni', '_blank');
  }
});

// Platform Link Handlers
document.addEventListener("click", (e) => {
  if (e.target.closest(".platform-link")) {
    e.preventDefault();
    const link = e.target.closest(".platform-link");
    const platformName = link.querySelector("span").textContent;

    showNotification(`Opening ${platformName}... Listen to Gavanni's music!`);

    // In a real application, these would link to actual music platforms
    // window.open('https://open.spotify.com/artist/gavanni', '_blank');
  }
});

// Ticket Purchase Handlers
document.addEventListener("click", (e) => {
  if (e.target.closest(".btn-outline")) {
    e.preventDefault();
    if (e.target.textContent.includes("Get Tickets")) {
      const showElement = e.target.closest(".tour-date-card");
      const venue = showElement.querySelector(".show-info h3").textContent;

      showNotification(`Redirecting to ticket purchase for ${venue}...`);

      // In a real application, this would redirect to a ticketing platform
      // window.open('https://tickets.com/gavanni-concert', '_blank');
    }
  }
});

console.log("🎵 Gavanni Music Website Loaded Successfully! 🎵");
console.log(
  "Features loaded: Navigation, Music Player, Animations, Forms, and More!"
);
