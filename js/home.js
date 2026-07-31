/**
 * home.js — Home Page Specific JavaScript
 * Government Services Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  initDepartmentTabs();
  initHomeParallax();
  initHeroParticles();
});

/* ── Department Interactive Panel ────────────────────────── */
function initDepartmentTabs() {
  const deptItems = document.querySelectorAll('.dept-item[data-dept]');

  const deptData = {
    home: {
      img: 'assets/images/service_1.webp',
      label: 'Home Affairs',
      title: 'Department of Home Affairs',
      desc: 'Oversees internal security, police, civil defence, disaster management, and border security coordination across all states and territories.',
      emp: '15,420', offices: '128', services: '24'
    },
    edu: {
      img: 'assets/images/service_2.webp',
      label: 'Education',
      title: 'Ministry of Education',
      desc: 'Manages primary, secondary, and higher education policies, curriculum development, teacher training, and digital learning initiatives nationwide.',
      emp: '48,600', offices: '342', services: '31'
    },
    health: {
      img: 'assets/images/service_3.webp',
      label: 'Healthcare',
      title: 'Department of Health',
      desc: 'Administers public health programs, hospital management, disease surveillance, immunization drives, and community wellness initiatives.',
      emp: '62,300', offices: '256', services: '42'
    },
    pwd: {
      img: 'assets/images/service_4.webp',
      label: 'Public Works',
      title: 'Public Works Department',
      desc: 'Plans and executes infrastructure projects including roads, highways, bridges, public buildings, and urban utility networks.',
      emp: '28,750', offices: '184', services: '18'
    },
    env: {
      img: 'assets/images/service_5.webp',
      label: 'Environment',
      title: 'Environment & Forests',
      desc: 'Protects natural resources, manages national parks and wildlife sanctuaries, enforces environmental laws, and leads green India initiatives.',
      emp: '11,200', offices: '96', services: '15'
    },
    fin: {
      img: 'assets/images/service_6.webp',
      label: 'Finance',
      title: 'Department of Finance',
      desc: 'Manages state finances, taxation policy, budget allocation, fiscal regulations, and coordinates with RBI on monetary matters.',
      emp: '9,840', offices: '72', services: '22'
    }
  };

  deptItems.forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.dept;
      const data = deptData[key];
      if (!data) return;

      // Update active state
      deptItems.forEach(d => d.classList.remove('active'));
      item.classList.add('active');

      // Update panel
      const panel = document.getElementById('deptPanel');
      const img   = document.getElementById('deptImg');
      const label = document.getElementById('deptLabel');
      const title = document.getElementById('deptTitle');
      const desc  = document.getElementById('deptDesc');
      const counters = panel.querySelectorAll('.dept-stat-value');

      gsap.to(panel, { opacity: 0, y: 10, duration: 0.2, onComplete: () => {
        if (img)   img.src = data.img;
        if (label) label.textContent = data.label;
        if (title) title.textContent = data.title;
        if (desc)  desc.textContent  = data.desc;

        // Update counter values
        const vals = [data.emp.replace(/,/g,''), data.offices.replace(/,/g,''), data.services];
        counters.forEach((counter, i) => {
          const target = parseInt(vals[i]);
          counter.dataset.target = target;
          gsap.fromTo({ v: 0 }, { v: target }, {
            v: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function() {
              counter.textContent = Math.round(this.targets()[0].v).toLocaleString();
            }
          });
        });

        gsap.to(panel, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      }});
    });
  });
}

/* ── Hero Parallax ───────────────────────────────────────── */
function initHomeParallax() {
  const heroBg = document.querySelector('.hero-bg-img');
  if (!heroBg) return;

  gsap.to(heroBg, {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });
}

/* ── Hero Particle Mouse Movement ────────────────────────── */
function initHeroParticles() {
  const particles = document.querySelectorAll('.hero-particle');
  if (!particles.length) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    particles.forEach((p, i) => {
      const factor = (i + 1) * 8;
      gsap.to(p, {
        x: x * factor,
        y: y * factor,
        duration: 1.5,
        ease: 'power2.out'
      });
    });
  });
}
