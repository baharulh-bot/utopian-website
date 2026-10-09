/**
 * UTOPIAN CONSULTANCY & CONSTRUCTION
 * Interactive Engineering Portal Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initEstimator();
  initProjectPortfolio();
  initOfficeLocator();
  initTeamFilter();
  initCopyCredentials();
  initContactForm();
  initFAQAccordion();
  initBackToTop();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navbar = document.getElementById('main-navbar');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.toggle('hidden');
    });
  }

  if (closeMobileMenuBtn && mobileMenuDrawer) {
    closeMobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.add('hidden');
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuDrawer) mobileMenuDrawer.classList.add('hidden');
    });
  });

  // Sticky Navbar Blur / Shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('shadow-xl', 'bg-slate-900/95');
      navbar.classList.remove('bg-slate-900/80');
    } else {
      navbar.classList.remove('shadow-xl', 'bg-slate-900/95');
      navbar.classList.add('bg-slate-900/80');
    }
  });
}

/* ==========================================================================
   2. CIVIL PROJECT & CONSULTANCY ESTIMATOR
   ========================================================================== */
function initEstimator() {
  const typeSelect = document.getElementById('est-project-type');
  const areaSlider = document.getElementById('est-area-slider');
  const areaNumber = document.getElementById('est-area-number');
  const floorsSelect = document.getElementById('est-floors');
  const soilSelect = document.getElementById('est-soil');
  
  const checkArch = document.getElementById('chk-arch');
  const checkStruct = document.getElementById('chk-struct');
  const checkBoq = document.getElementById('chk-boq');
  const checkSoil = document.getElementById('chk-soil');
  const checkSupervision = document.getElementById('chk-supervision');

  const outConstCost = document.getElementById('out-const-cost');
  const outConsultFee = document.getElementById('out-consult-fee');
  const outTimeline = document.getElementById('out-timeline');
  const outSeismicCode = document.getElementById('out-seismic-code');
  const whatsappQuoteBtn = document.getElementById('btn-whatsapp-quote');

  if (!areaSlider || !areaNumber) return;

  function syncArea(val) {
    areaSlider.value = val;
    areaNumber.value = val;
    calculateEstimate();
  }

  areaSlider.addEventListener('input', (e) => syncArea(e.target.value));
  areaNumber.addEventListener('input', (e) => syncArea(e.target.value));

  [typeSelect, floorsSelect, soilSelect, checkArch, checkStruct, checkBoq, checkSoil, checkSupervision].forEach(el => {
    if (el) el.addEventListener('change', calculateEstimate);
  });

  function calculateEstimate() {
    const area = parseFloat(areaSlider.value) || 2000;
    const projectType = typeSelect ? typeSelect.value : 'residential';
    const floorMultiplier = floorsSelect ? parseFloat(floorsSelect.value) : 2;
    const soilFactor = soilSelect ? parseFloat(soilSelect.value) : 1.1;

    // Base Construction cost per sqft (Assam / NE standard rates in INR)
    let baseRatePerSqft = 1850;
    let baseConsultancyRate = 22; // per sqft base
    let baseTimelineMonths = 5;

    switch (projectType) {
      case 'residential':
        baseRatePerSqft = 1800;
        baseConsultancyRate = 22;
        baseTimelineMonths = Math.ceil(4 + (area / 1200) * 1.5);
        break;
      case 'commercial':
        baseRatePerSqft = 2200;
        baseConsultancyRate = 28;
        baseTimelineMonths = Math.ceil(6 + (area / 1500) * 2);
        break;
      case 'industrial':
        baseRatePerSqft = 1650;
        baseConsultancyRate = 25;
        baseTimelineMonths = Math.ceil(4 + (area / 2500) * 1.5);
        break;
      case 'hospital':
        baseRatePerSqft = 2600;
        baseConsultancyRate = 35;
        baseTimelineMonths = Math.ceil(8 + (area / 1500) * 2.5);
        break;
      case 'disaster':
        baseRatePerSqft = 1750;
        baseConsultancyRate = 24;
        baseTimelineMonths = Math.ceil(5 + (area / 1800) * 1.5);
        break;
      case 'ndt':
        baseRatePerSqft = 200; // testing & audit scope
        baseConsultancyRate = 12;
        baseTimelineMonths = 1;
        break;
    }

    // Add scope options to consultancy fee
    let scopeRate = 0;
    if (checkArch && checkArch.checked) scopeRate += 10;
    if (checkStruct && checkStruct.checked) scopeRate += 12;
    if (checkBoq && checkBoq.checked) scopeRate += 6;
    if (checkSoil && checkSoil.checked) scopeRate += 4;
    if (checkSupervision && checkSupervision.checked) scopeRate += 8;
    if (scopeRate === 0) scopeRate = 15; // default minimum

    // Total Construction Estimate (approx)
    let totalConstMin, totalConstMax;
    if (projectType === 'ndt') {
      totalConstMin = Math.round(area * 15);
      totalConstMax = Math.round(area * 35);
    } else {
      totalConstMin = Math.round(area * baseRatePerSqft * soilFactor * 0.95);
      totalConstMax = Math.round(area * baseRatePerSqft * soilFactor * 1.15);
    }

    // Consultancy Fee Estimate
    const consultFeeMin = Math.round(area * scopeRate * 0.9);
    const consultFeeMax = Math.round(area * scopeRate * 1.15);

    // Format into Indian currency format
    if (outConstCost) {
      if (projectType === 'ndt') {
        outConstCost.innerText = `₹${formatIndianCurrency(totalConstMin)} - ₹${formatIndianCurrency(totalConstMax)} (Audit Scope)`;
      } else {
        outConstCost.innerText = `₹${formatIndianCurrency(totalConstMin)} - ₹${formatIndianCurrency(totalConstMax)}`;
      }
    }

    if (outConsultFee) {
      outConsultFee.innerText = `₹${formatIndianCurrency(consultFeeMin)} - ₹${formatIndianCurrency(consultFeeMax)}`;
    }

    if (outTimeline) {
      outTimeline.innerText = `${baseTimelineMonths} - ${baseTimelineMonths + 3} Months`;
    }

    if (outSeismicCode) {
      outSeismicCode.innerText = 'Zone V (IS 1893:2016 Compliant)';
    }

    // Update WhatsApp link
    if (whatsappQuoteBtn) {
      const typeLabel = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Civil Project';
      const textMessage = encodeURIComponent(
        `Hello Utopian Consultancy & Construction Team,\n\nI used your online Project Estimator and would like to request a formal quotation:\n` +
        `• Project Type: ${typeLabel}\n` +
        `• Built-up Area: ${area} Sq. Ft.\n` +
        `• Floors: ${floorsSelect ? floorsSelect.options[floorsSelect.selectedIndex].text : 'Standard'}\n` +
        `• Estimated Construction Range: ₹${formatIndianCurrency(totalConstMin)} - ₹${formatIndianCurrency(totalConstMax)}\n` +
        `• Estimated Consultancy Range: ₹${formatIndianCurrency(consultFeeMin)} - ₹${formatIndianCurrency(consultFeeMax)}\n` +
        `• Seismic Zone: Zone V Compliant\n\nPlease let me know the next steps for site survey and consultation.`
      );
      whatsappQuoteBtn.href = `https://wa.me/918402860632?text=${textMessage}`;
    }
  }

  calculateEstimate();
}

function formatIndianCurrency(num) {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + ' Cr';
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2) + ' Lakhs';
  } else {
    return num.toLocaleString('en-IN');
  }
}

/* ==========================================================================
   3. PROJECT PORTFOLIO & DETAIL MODAL
   ========================================================================== */
const projectData = [
  {
    id: 'hospital-siukapha',
    title: 'Swargadew Siu-Ka-Pha Multispecialty Hospital',
    subtitle: 'Emergency, OPD, ICU Shed, Bio-Medical Waste & Laboratory Blocks',
    category: 'healthcare',
    client: 'Siu-Ka-Pha Hospital Trust & Govt of Assam',
    location: 'Sivasagar, Assam',
    status: 'Completed & Ongoing Allied Blocks',
    image: 'assets/images/project-hospital.jpg',
    description: 'Comprehensive structural engineering and detailed BOQ preparation for major healthcare infrastructure including Emergency, Outpatient Department (OPD), Trussed Roof Shed for ICU Building (Block 4), Bio-Medical Waste Plant, Municipal Solid Waste Facility, Scrap Yard, Laboratory Block (Block-8), and Gymnasium.',
    highlights: [
      'Seismic Zone-V ductile moment resisting RCC frames',
      'Structural design of heavy trussed roof shed for ICU Building',
      'Specialized Bio-Medical waste processing plant structural foundations',
      'Detailed BOQ preparation ensuring zero material wastage & high ROI',
      'Completed Emergency & OPD blocks; Ongoing Gym & Lab structures'
    ],
    deliverables: ['Structural CAD Drawings', 'STAAD.Pro Seismic Analysis', 'BOQ & Cost Estimates', 'Site Inspection Reports']
  },
  {
    id: 'ongc-facility',
    title: 'Central Mud Plant Facility - Drilling Services',
    subtitle: 'Heavy Industrial Mud Plant, RCC Storage Tanks & Drainage Culverts',
    category: 'industrial',
    client: 'Oil and Natural Gas Corporation (ONGC)',
    location: 'Sivasagar & Ligripukhuri, Assam',
    status: 'Completed',
    image: 'assets/images/project-ongc-facility.jpg',
    description: 'Executed complete topographical survey, structural design of heavy industrial buildings, pre-engineered steel framing, box-culvert road crossings, and massive 200 cubic-meter RCC storage tanks for ONGC Drilling Services at Sivasagar and Ligripukhuri.',
    highlights: [
      'Industrial grade structural design for chemical mud storage & machinery',
      'Complete topographical survey with electronic total station & GPS coordinates',
      'Structural design and hydraulic dimensioning of box-culvert road bridges',
      '200 cum liquid storage RCC tanks designed against hydrostatic and seismic surge',
      'Full compliance with ONGC safety and industrial construction guidelines'
    ],
    deliverables: ['Topographical Site Contours', 'Heavy Foundation Drawings', 'Hydraulic Box-Culvert Design', 'Tank Structural Schedules']
  },
  {
    id: 'flood-shelters-seeds',
    title: '32 Flood Shelters & 20 School Building Retrofittings',
    subtitle: 'Statewide Disaster-Resilient Shelters & Sub-Soil Investigations',
    category: 'disaster',
    client: 'Seeds Technical Services Pvt. Ltd. / Assam Disaster Management',
    location: 'Multi-district Assam (9 Villages & 32 Locations)',
    status: 'Completed & Ongoing Expansion',
    image: 'assets/images/project-flood-shelter.jpg',
    description: 'Extensive disaster-mitigation project conducting rapid visual screening, sub-soil geotechnical investigations across 9 villages, and complete structural design with BOQs for 8 new multi-purpose flood shelters and structural rehabilitation/retrofitting of 20 flood-affected school buildings.',
    highlights: [
      'Rapid Visual Screening (RVS) of 32 flood shelter sites across Assam',
      'Geotechnical borehole soil testing & SBC calculation in vulnerable riverine belts',
      'High-plinth flood-proof structural design safe above highest recorded flood levels (HFL)',
      'Structural retrofitting of 20 rural school buildings for earthquake and cyclone safety',
      'Community shelter design with integrated sanitation and rainwater harvesting'
    ],
    deliverables: ['RVS Assessment Reports', 'Geotechnical Soil Investigation Logs', 'Seismic Retrofitting BOQ', 'Architectural Disaster Layouts']
  },
  {
    id: 'bamboo-rcc-shelter',
    title: 'Flood-Proof Assam-Type Community Shelter Home',
    subtitle: 'Eco-Friendly Disaster Shelter Combining Bamboo & Reinforced Concrete',
    category: 'disaster',
    client: 'Community Development Initiative',
    location: 'Jorhat, Assam',
    status: 'Completed',
    image: 'assets/images/project-flood-shelter.jpg',
    description: 'Pioneered an innovative, cost-effective hybrid civil structure combining engineered bamboo, treated timber trusses, and reinforced cement concrete (RCC) foundation stilts to withstand extreme flood currents and high seismic shocks in Upper Assam.',
    highlights: [
      'Eco-friendly low-carbon construction utilizing sustainably harvested local bamboo',
      'Elevated RCC column stilts ensuring living space safety during seasonal inundation',
      'Aerodynamic roof truss design to resist North-Eastern gale and cyclonic storms',
      'Earthquake resilient flexibility with lightweight vernacular superstructure'
    ],
    deliverables: ['Hybrid Bamboo-RCC Joint Details', 'Architectural Floor Plans', 'Material Durability Specifications']
  },
  {
    id: 'guwahati-highrise',
    title: 'G+5 Luxury Residential & Commercial Apartments',
    subtitle: 'Multi-Storeyed Apartment Towers at Sixmile & Baghorbori',
    category: 'commercial',
    client: 'Private Real Estate Developers',
    location: 'Sixmile & Baghorbori, Guwahati, Assam',
    status: 'Completed',
    image: 'assets/images/project-guwahati-complex.jpg',
    description: 'Comprehensive structural analysis, architectural space planning, and GMC/GMDA municipal approval drawings for multiple G+5 multi-storeyed residential apartment towers in prime Guwahati urban corridors.',
    highlights: [
      'High-density urban multi-storeyed structural design conforming to GMDA bylaws',
      'Zone-V seismic response spectrum analysis with ETABS and STAAD.Pro',
      'Underground basement parking layouts with traffic circulation optimization',
      'Modern glass facades, private balconies, and landscaped entrance amenities',
      'Full electrical, plumbing (MEP), and rainwater harvesting integration'
    ],
    deliverables: ['Structural Working Drawings', 'Municipal Sanction Sets', 'Bar Bending Schedules (BBS)', 'Site Supervision Logs']
  },
  {
    id: 'jorhat-commercial',
    title: '5-Storeyed Commercial Building for Mr. Bhupen Bora',
    subtitle: 'Prime Commercial Complex with Retail Showrooms & Corporate Suites',
    category: 'commercial',
    client: 'Mr. Bhupen Bora',
    location: 'K. B. Road, Jorhat, Assam',
    status: 'Completed',
    image: 'assets/images/project-guwahati-complex.jpg',
    description: 'Turnkey architectural planning, 3D exterior design, and detailed structural engineering for a landmark five-storeyed commercial shopping and corporate building in Jorhat city center.',
    highlights: [
      'Column-free retail space planning with post-tensioned / heavy beam spans',
      'Modern glass curtain wall facade with heat-reflective low-E glazing',
      'Safe egress staircases and fire safety compliance certification',
      'Soil stabilization and deep raft/pile foundation system'
    ],
    deliverables: ['3D Architectural Renderings', 'Structural Column & Beam Schedules', 'Fire NOC Layouts']
  },
  {
    id: 'transportation-highways',
    title: 'Rural & Urban Roadway Transportation & Bridge Engineering',
    subtitle: 'Geometric Design, Streetscaping, Interchanges & Quality Control',
    category: 'public',
    client: 'APWD / Municipal Bodies & Infrastructure Contractors',
    location: 'Multiple Locations across Assam',
    status: 'Delivered',
    image: 'assets/images/project-transportation.jpg',
    description: 'Complete highway and roadway engineering including traffic impact studies (TIA), geometric design of intersections, streetscaping, subgrade soil CBR testing, subgrade stabilization, and intelligent transportation system (ITS) planning.',
    highlights: [
      'Comprehensive Total Station and GPS roadway alignment surveys',
      'Flexible and rigid pavement crust design conforming to IRC standards',
      'Interchange and junction safety improvement planning',
      'Subgrade CBR soil testing and subgrade improvement recommendations'
    ],
    deliverables: ['Plan & Longitudinal Road Profiles', 'Cross-section Sheets', 'CBR Lab Reports', 'Bill of Quantities']
  },
  {
    id: 'public-stadium-bongaigaon',
    title: 'Public Sports Stadium & Pavilion',
    subtitle: 'Structural Design of Grandstand, Cantilever Canopies & Civil Amenities',
    category: 'public',
    client: 'Sports Authority & District Administration',
    location: 'North Bongaigaon, Assam',
    status: 'Completed',
    image: 'assets/images/hero-civil-consultancy.jpg',
    description: 'Structural engineering design for the North Bongaigaon Public Stadium, including long-span cantilevered spectator roof trusses, stepped reinforced concrete seating galleries, locker facilities, and drainage systems.',
    highlights: [
      'Heavy structural steel cantilevered roof trusses designed against high wind pressures',
      'Dynamic vibration analysis of stepped spectator gallery seating',
      'High-capacity crowd egress and universal accessibility design',
      'Drainage and flood runoff channels around the sports ground'
    ],
    deliverables: ['Steel Truss Fabrication Drawings', 'RCC Grandstand Schedules', 'Wind Load Simulation Data']
  },
  {
    id: 'ndt-retrofitting-namdoyang',
    title: 'Structural Health Audit & Retrofitting - Namdoyang LP School',
    subtitle: 'Non-Destructive Testing (NDT) & Seismic Rehabilitation',
    category: 'ndt',
    client: 'Education Department & Technical Services',
    location: 'Bokakhat, Golaghat, Assam',
    status: 'Completed',
    image: 'assets/images/service-ndt-testing.jpg',
    description: 'Comprehensive structural health assessment of aging school building using non-destructive testing (NDT), followed by structural retrofitting design to restore seismic integrity and protect school children.',
    highlights: [
      'Digital Rebound Hammer test to evaluate in-situ concrete surface hardness',
      'Ultrasonic Pulse Velocity (UPV) testing to identify internal voids and honeycombing',
      'Rebar locater and cover meter assessment to check rebar corrosion and spacing',
      'RCC micro-concreting and steel jacketing design for weakened structural columns'
    ],
    deliverables: ['NDT Assessment Certificate', 'Structural Integrity Scorecard', 'Retrofitting Engineering Drawings']
  },
  {
    id: 'oxygen-plants-govt',
    title: '5.5tr PSA Medical Oxygen Plants for Govt Hospitals',
    subtitle: 'Heavy Equipment Foundation & Steel Shed Structural Design',
    category: 'healthcare',
    client: 'Health Department, Govt. of Assam',
    location: 'Multiple Govt Hospitals across Assam',
    status: 'Completed',
    image: 'assets/images/project-hospital.jpg',
    description: 'Engineered heavy vibrating machinery foundations and custom structural steel weather sheds for 5.5tr Pressure Swing Adsorption (PSA) Medical Oxygen Generator plants during emergency healthcare expansion.',
    highlights: [
      'Machine foundation design with vibration dampening to eliminate structural resonance',
      'Heavy-duty industrial steel shed with rapid erection bolted connections',
      'Ventilation and fire suppression clearance planning',
      'Fast-track delivery within critical emergency timeframes'
    ],
    deliverables: ['Dynamic Foundation Drawings', 'PEB Shed Erection Plans', 'Safety Compliance Reports']
  },
  {
    id: 'emrs-mizoram',
    title: 'Eklavya Model Residential Schools (EMRS)',
    subtitle: 'Topographical Survey & Campus Engineering across Mizoram Hilly Terrain',
    category: 'public',
    client: 'Ministry of Tribal Affairs / State Implementing Agency',
    location: 'Multiple Hilly Locations, Mizoram',
    status: 'Completed',
    image: 'assets/images/project-transportation.jpg',
    description: 'Conducted high-precision topographical surveys, hill terrain contouring, slope stability analysis, and allied civil planning works for new residential school campuses under the EMRS initiative in Mizoram.',
    highlights: [
      'Complex hilly terrain Total Station surveying and 3D digital elevation models (DEM)',
      'Slope stability assessment and retaining wall alignment planning',
      'Terraced campus master planning optimizing earthwork cut-and-fill volumes',
      'Drainage and runoff diversion design for monsoon hill protection'
    ],
    deliverables: ['3D Contour Maps', 'Earthwork Cut-Fill Reports', 'Slope Stabilization Plans']
  },
  {
    id: 'silchar-commercial',
    title: 'Commercial Complex & Single-Storeyed Truss Godown',
    subtitle: '3-Storeyed Commercial Plaza & Warehousing Facility for Mr. N.A. Mazumder',
    category: 'commercial',
    client: 'Mr. N.A. Mazumder',
    location: 'Silchar, Assam',
    status: 'Ongoing & Completed Godown',
    image: 'assets/images/project-guwahati-complex.jpg',
    description: 'Planning, architectural layout, and structural design of a three-storeyed commercial commercial hub along with an adjacent large-span trussed roof logistics godown facility in Barak Valley.',
    highlights: [
      'Clear-span structural steel roof trusses for heavy goods storage and handling',
      'Heavy floor slab design resisting forklift and pallet truck wheel loads',
      'Modern retail frontage with glass display modules and high ceilings',
      'Barak Valley soft alluvium foundation engineering with deep piles'
    ],
    deliverables: ['Structural Framing Plans', 'Godown Truss Fabrication Drawings', 'Foundation Engineering Dossier']
  }
];

function initProjectPortfolio() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectGrid = document.getElementById('project-grid');
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('close-modal-btn');

  if (!projectGrid) return;

  function renderProjects(category) {
    projectGrid.innerHTML = '';
    const filtered = category === 'all' 
      ? projectData 
      : projectData.filter(p => p.category === category);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card group bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/60 hover:border-orange-500/80 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col cursor-pointer';
      card.onclick = () => openProjectModal(p.id);

      card.innerHTML = `
        <div class="relative h-56 overflow-hidden bg-slate-900">
          <img src="${p.image}" alt="${p.title}" class="project-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          <span class="absolute top-3 left-3 px-3 py-1 bg-orange-600/90 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider">
            ${p.category.toUpperCase()}
          </span>
          <span class="absolute top-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs font-medium rounded-full border border-slate-700">
            📍 ${p.location}
          </span>
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <span class="font-medium text-orange-400">Client: ${p.client.length > 25 ? p.client.substring(0, 25) + '...' : p.client}</span>
            <span class="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">${p.status.split(' ')[0]}</span>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1 mb-1">${p.title}</h3>
            <p class="text-xs text-orange-300/80 font-medium mb-2 line-clamp-1">${p.subtitle}</p>
            <p class="text-slate-300 text-sm line-clamp-2 leading-relaxed mb-4">${p.description}</p>
          </div>
          <div class="pt-3 border-t border-slate-700/60 flex items-center justify-between">
            <span class="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              IS Code / APWD Verified
            </span>
            <button type="button" class="text-orange-400 hover:text-orange-300 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Details →
            </button>
          </div>
        </div>
      `;

      projectGrid.appendChild(card);
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active', 'bg-orange-600', 'text-white'));
      tab.classList.add('active');
      renderProjects(tab.dataset.category);
    });
  });

  renderProjects('all');

  // Modal Open/Close
  window.openProjectModal = function(id) {
    const project = projectData.find(p => p.id === id);
    if (!project || !modal) return;

    document.getElementById('modal-title').innerText = project.title;
    document.getElementById('modal-subtitle').innerText = project.subtitle;
    document.getElementById('modal-client').innerText = project.client;
    document.getElementById('modal-location').innerText = project.location;
    document.getElementById('modal-status').innerText = project.status;
    document.getElementById('modal-image').src = project.image;
    document.getElementById('modal-desc').innerText = project.description;

    const highlightsList = document.getElementById('modal-highlights');
    highlightsList.innerHTML = project.highlights.map(h => `
      <li class="flex items-start gap-2.5 text-slate-300 text-sm">
        <span class="text-orange-500 mt-1">✔</span>
        <span>${h}</span>
      </li>
    `).join('');

    const deliverablesList = document.getElementById('modal-deliverables');
    deliverablesList.innerHTML = project.deliverables.map(d => `
      <span class="px-3 py-1 bg-slate-800 text-orange-300 border border-slate-700 rounded-lg text-xs font-mono font-medium">
        ${d}
      </span>
    `).join('');

    const modalInquireBtn = document.getElementById('modal-inquire-btn');
    if (modalInquireBtn) {
      modalInquireBtn.href = `https://wa.me/918402860632?text=${encodeURIComponent('Hello Utopian Team, I saw your project: ' + project.title + ' (' + project.location + '). I would like to consult with you on a similar requirement.')}`;
    }

    modal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('modal-hidden')) {
      closeModal();
    }
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.add('modal-hidden');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   4. INTERACTIVE OFFICE LOCATOR
   ========================================================================== */
const officeData = {
  nalbari_hq: {
    name: 'Nalbari Corporate Head Office',
    type: 'Registered Corporate Office',
    address: 'Near Nalbari Baro Masjid / NT Road, near Vishal Mega Mart, Barama Road, Nalbari, Assam - 781335',
    phone: '+91-84028-60632 / +91-98646-88249',
    hours: 'Monday – Saturday: 9:00 AM – 8:00 PM',
    mapQuery: 'Barama Road Nalbari Baro Masjid Assam 781335',
    tag: 'Principal Operations & Client Meetings'
  },
  nalbari_workshop: {
    name: 'Nalbari Engineering Workshop & Lab',
    type: 'Testing & Fabrication Center',
    address: 'Near Kendriya Jatiya Vidyalaya, Digheli, Nalbari, Assam - 781334',
    phone: '+91-84028-60632 / +91-97061-98331',
    hours: 'Monday – Saturday: 8:30 AM – 6:30 PM',
    mapQuery: 'Digheli Nalbari Assam 781334',
    tag: 'NDT Testing, Materials & Steel Fabrication'
  },
  guwahati: {
    name: 'Guwahati Regional Branch',
    type: 'Urban Architecture & Approvals Hub',
    address: 'Kabarstan Road, Darandha, Sixmile, Guwahati, Assam - 781022',
    phone: '+91-98646-88249 / +91-84028-60632',
    hours: 'Monday – Saturday: 9:30 AM – 7:30 PM',
    mapQuery: 'Darandha Sixmile Guwahati Assam 781022',
    tag: 'GMDA / GMC Approvals & High-Rise Design'
  },
  jorhat: {
    name: 'Jorhat Branch Office',
    type: 'Upper Assam Regional Hub',
    address: 'JEC Road, Srimantapur, Garmur, Jorhat, Assam - 785007',
    phone: '+91-97061-98331 / +91-84028-60632',
    hours: 'Monday – Saturday: 9:00 AM – 7:00 PM',
    mapQuery: 'JEC Road Garmur Jorhat Assam 785007',
    tag: 'Institutional & Highway Consulting'
  },
  nagaon: {
    name: 'Nagaon Branch Office',
    type: 'Central Assam Projects Desk',
    address: 'Liladhar Kataki Path, Morikolong, Near BJP Office, Nagaon, Assam - 782001',
    phone: '+91-84028-60632',
    hours: 'Monday – Saturday: 9:00 AM – 6:30 PM',
    mapQuery: 'Morikolong Nagaon Assam 782001',
    tag: 'Rural Roadways & Flood Mitigation Projects'
  }
};

function initOfficeLocator() {
  const officeTabs = document.querySelectorAll('.office-tab');
  const officeNameEl = document.getElementById('office-name');
  const officeTypeEl = document.getElementById('office-type');
  const officeAddressEl = document.getElementById('office-address');
  const officePhoneEl = document.getElementById('office-phone');
  const officeHoursEl = document.getElementById('office-hours');
  const officeTagEl = document.getElementById('office-tag');
  const officeMapBtn = document.getElementById('office-map-link');
  const officeCallBtn = document.getElementById('office-call-btn');

  if (!officeTabs.length || !officeNameEl) return;

  function switchOffice(key) {
    const data = officeData[key];
    if (!data) return;

    officeNameEl.innerText = data.name;
    officeTypeEl.innerText = data.type;
    officeAddressEl.innerText = data.address;
    officePhoneEl.innerText = data.phone;
    officeHoursEl.innerText = data.hours;
    officeTagEl.innerText = data.tag;
    
    if (officeMapBtn) {
      officeMapBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.mapQuery)}`;
    }
    if (officeCallBtn) {
      officeCallBtn.href = `tel:${data.phone.split('/')[0].trim().replace(/[^0-9+]/g, '')}`;
    }
  }

  officeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      officeTabs.forEach(t => {
        t.classList.remove('bg-orange-600', 'text-white', 'border-orange-500');
        t.classList.add('bg-slate-800', 'text-slate-300', 'border-slate-700');
      });
      tab.classList.remove('bg-slate-800', 'text-slate-300', 'border-slate-700');
      tab.classList.add('bg-orange-600', 'text-white', 'border-orange-500');
      switchOffice(tab.dataset.office);
    });
  });
}

/* ==========================================================================
   5. MEET THE TEAM DISCIPLINE FILTER
   ========================================================================== */
function initTeamFilter() {
  const teamTabs = document.querySelectorAll('.team-filter-btn');
  const teamCards = document.querySelectorAll('.team-member-card');

  if (!teamTabs.length) return;

  teamTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      teamTabs.forEach(t => t.classList.remove('bg-orange-600', 'text-white'));
      tab.classList.add('bg-orange-600', 'text-white');
      const dept = tab.dataset.dept;

      teamCards.forEach(card => {
        if (dept === 'all' || card.dataset.dept.includes(dept)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. COPY REGISTRATION CREDENTIALS WITH TOAST
   ========================================================================== */
function initCopyCredentials() {
  const copyButtons = document.querySelectorAll('.copy-cred-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.dataset.copyText;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast(`Selected: ${textToCopy}`);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 border border-orange-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium transition-all duration-300';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   7. CONTACT & RFQ FORM WITH WHATSAPP SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('rfq-contact-form');
  const sendWhatsappBtn = document.getElementById('btn-form-whatsapp');

  if (!form) return;

  function buildMessage() {
    const name = document.getElementById('rfq-name')?.value || 'Client';
    const phone = document.getElementById('rfq-phone')?.value || 'N/A';
    const email = document.getElementById('rfq-email')?.value || 'N/A';
    const location = document.getElementById('rfq-location')?.value || 'Assam';
    const projectType = document.getElementById('rfq-type')?.value || 'General Inquiry';
    const area = document.getElementById('rfq-area')?.value || 'Not specified';
    const details = document.getElementById('rfq-message')?.value || 'Requesting consultation';

    return (
      `Hello Utopian Consultancy & Construction,\n\n` +
      `I would like to submit an inquiry from your website:\n` +
      `• Name: ${name}\n` +
      `• Phone: ${phone}\n` +
      `• Email: ${email}\n` +
      `• Project Location: ${location}\n` +
      `• Project Category: ${projectType}\n` +
      `• Built-up Area: ${area}\n` +
      `• Project Scope & Details:\n${details}\n\n` +
      `Please get in touch with me for further discussions.`
    );
  }

  if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = encodeURIComponent(buildMessage());
      window.open(`https://wa.me/918402860632?text=${msg}`, '_blank');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Inquiry received! Our Senior Engineer will contact you within 24 hours.');
    form.reset();
  });
}

/* ==========================================================================
   8. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      faqItems.forEach(other => {
        const otherContent = other.querySelector('.faq-content');
        const otherIcon = other.querySelector('.faq-icon');
        if (otherContent) otherContent.classList.add('hidden');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
