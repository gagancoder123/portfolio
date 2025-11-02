/* Menu (show/hidden) */
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close")

/* Menu (show) */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu")
  })
}

/* Menu (hidden) */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu")
  })
}

/* Mobile menu */
const navLink = document.querySelectorAll(".nav-link")

function linkAction() {
  const navMenu = document.getElementById("nav-menu")
  navMenu.classList.remove("show-menu")
}
navLink.forEach((n) => n.addEventListener("click", linkAction))

/* Skills (accordion) */
const skillsContent = document.getElementsByClassName("skills-container-content"),
  skillsHeader = document.querySelectorAll(".skills-container-header")

function toggleSkills() {
  let itemClass = this.parentNode.className

  for (i = 0; i < skillsContent.length; i++) {
    skillsContent[i].className = "skills-container-content skills-close";
  }
  if (itemClass === "skills-container-content skills-close") {
    this.parentNode.className = "skills-container-content skills-open"
  }
}

skillsHeader.forEach((el) => {
  el.addEventListener("click", toggleSkills)
})

/* Experience tabs */
const tabs = document.querySelectorAll("[data-target]"),
  tabContents = document.querySelectorAll("[data-content]")

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target)

    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("experience-active")
    })
    target.classList.add("experience-active")

    tabs.forEach((tab) => {
      tab.classList.remove("experience-active")
    })
    tab.classList.add("experience-active")
  })
})

/* Articles swiper */
const swiperArticles = new Swiper(".articles-container", {
  cssMode: true,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
})

/* Scroll sections (active link) */
const sections = document.querySelectorAll("section[id]")

function scrollActive() {
  const scrollY = window.pageYOffset

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight
    const sectionTop = current.offsetTop - 50
    const sectionId = current.getAttribute("id")

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.add("active-link")
    } else {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.remove("active-link")
    }
  })
}
window.addEventListener("scroll", scrollActive)

/* Ensure anchor targets appear below fixed header: set scroll-margin-top dynamically */
function adjustSectionScrollMargin() {
  try {
    const header = document.getElementById('header')
    const headerHeight = header ? header.offsetHeight : 80
    document.querySelectorAll('section[id]').forEach((sec) => {
      // add a small extra offset (10px) so content isn't flush to the header
      sec.style.scrollMarginTop = (headerHeight + 10) + 'px'
    })
  } catch (e) {
    console.warn('adjustSectionScrollMargin failed', e)
  }
}

// Run on load and when window resizes (header height may change on mobile toggles)
window.addEventListener('load', adjustSectionScrollMargin)
window.addEventListener('resize', adjustSectionScrollMargin)

/* Background header */
function scrollHeader() {
  const nav = document.getElementById("header")

  if (this.scrollY >= 80) nav.classList.add("scroll-header")
  else nav.classList.remove("scroll-header")
}
window.addEventListener("scroll", scrollHeader)

/* Show scroll to top */
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up")

  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll")
  else scrollUp.classList.remove("show-scroll")
}
window.addEventListener("scroll", scrollUp)

/* Dark/Light mode */
const themeButton = document.getElementById("theme-button")
const darkTheme = "dark-theme"
const iconTheme = "fa-sun"

const selectedTheme = localStorage.getItem("selected-theme")
const selectedIcon = localStorage.getItem("selected-icon")

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light"
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "fa-moon" : "fa-sun"

if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](darkTheme)
  themeButton.classList[selectedIcon === "fa-moon" ? "add" : "remove"](iconTheme)
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkTheme)
  themeButton.classList.toggle(iconTheme)

  localStorage.setItem("selected-theme", getCurrentTheme())
  localStorage.setItem("selected-icon", getCurrentIcon())
})

/* Mail integration */
// Optional: set this to your deployed Google Apps Script Web App URL to send via your Gmail
// If empty, the code will use EmailJS (if configured) as a fallback.
const GOOGLE_APPS_SCRIPT_URL = "" // e.g. https://script.google.com/macros/s/XXXX/exec

document.addEventListener("DOMContentLoaded", function() {
  // Initialize EmailJS (keeps existing EmailJS behavior as a fallback)
  try {
    if (typeof emailjs !== 'undefined') emailjs.init("A9PZASRNY-NxAYHQX")
  } catch (e) {
    console.warn('EmailJS init failed or not loaded', e)
  }

  const form = document.getElementById('contact-form')
  if (!form) return

  form.addEventListener('submit', function(event) {
    event.preventDefault()

    const payload = {
      from_name: form.querySelector('[name=from_name]')?.value || '',
      reply_to: form.querySelector('[name=reply_to]')?.value || '',
      subject: form.querySelector('[name=subject]')?.value || '',
      message: form.querySelector('[name=message]')?.value || ''
    }

    // Helper to fallback to mailto (opens user's mail client) if all else fails
    const mailtoFallback = () => {
      const to = 'your-email@gmail.com' // <- replace with your Gmail if you want fallback prefill
      const subject = encodeURIComponent(payload.subject)
      const body = encodeURIComponent(`From: ${payload.from_name} <${payload.reply_to}>\n\n${payload.message}`)
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`, '_blank')
    }

    // If a Google Apps Script URL is provided, try POSTing there first
    if (GOOGLE_APPS_SCRIPT_URL) {
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok')
          return res.json()
        })
        .then((data) => {
          console.log('GAS send success', data)
          alert('Message sent! Thank you.')
          form.reset()
        })
        .catch((err) => {
          console.error('GAS send failed, falling back to EmailJS', err)
          // fallback to EmailJS if available
          sendViaEmailJS(payload, form) || mailtoFallback()
        })
    } else {
      // No GAS endpoint — use EmailJS directly as before
      sendViaEmailJS(payload, form, mailtoFallback)
    }
  })
})

function sendViaEmailJS(payload, form, finalFallback) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not available')
    if (finalFallback) finalFallback()
    return
  }

  emailjs.send('service_btvk1js', 'template_zhvgvnk', payload)
    .then(function(response) {
      console.log('EmailJS Success!', response.status, response.text)
      alert('Email sent successfully!')
      if (form) form.reset()
    }, function(error) {
      console.error('EmailJS Failed...', error)
      alert('Email sending failed — opening mail client as fallback.')
      if (finalFallback) finalFallback()
    })
}

