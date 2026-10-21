// Career descriptions are grounded in the original August 2026 CV.
export const career = [
  {
    id: 'yildiz', name: 'Yıldız Technical University', logo: '/TahaErkinTunali/career/yildiz.png',
    period: '2018 — 2023', role: 'BSc, Mechanical Engineering',
    summary: 'The foundation of my engineering career.',
    introduction: 'I studied Mechanical Engineering at Yıldız Technical University in Istanbul, graduating with a GPA of 3.07 / 4.00.',
    positions: [{ period: '2018 — 2023', title: 'Mechanical Engineering undergraduate' }],
    contributions: [
      'Completed design projects in technical drawing, bicycle conceptual design and solar-energy analysis.',
      'Researched hybrid battery-electric / fuel-cell trucks and renewable-powered hydrogen production stations for my graduation thesis.',
      'Joined the Formula Student Suspension Support Team in 2020–2021.',
      'Won the Leap Event case competition in 2022.'
    ],
    gained: 'A foundation in mechanical design, energy-system analysis and engineering research, developed through academic projects and team activities.',
    tags: ['Mechanical design', 'Energy systems', 'Formula Student']
  },
  {
    id: 'akim', name: 'Akım Metal', logo: '/TahaErkinTunali/career/akim-metal.png',
    period: 'JUN — AUG 2021', role: 'Manufacturing Internship',
    summary: 'My first step into industrial engineering.',
    introduction: 'I completed a manufacturing internship at Akım Metal while studying Mechanical Engineering.',
    positions: [{ period: 'JUN — AUG 2021', title: 'Manufacturing Internship' }],
    contributions: [
      'Completed a manufacturing internship from June to August 2021.',
      'Gained my first industrial experience alongside my university studies.'
    ],
    gained: 'An introduction to a manufacturing workplace and the connection between engineering studies and industry.',
    tags: ['Manufacturing', 'Industrial experience', 'Internship']
  },
  {
    id: 'siemens', name: 'Siemens', logo: '/TahaErkinTunali/career/siemens.png',
    period: 'SEP 2022 — AUG 2023', role: 'Manufacturing Engineer · Working Student',
    summary: 'Production improvement through data and automation.',
    introduction: 'I worked part-time as a manufacturing engineer at Siemens and completed two internships during the same period.',
    positions: [
      { period: 'SEP 2022 — AUG 2023', title: 'Manufacturing Engineer · Part-time Working Student' },
      { period: 'NOV 2022 — JAN 2023', title: 'Construction Internship' },
      { period: 'MAR — MAY 2023', title: 'Business and Organizational Internship' }
    ],
    contributions: [
      'Analyzed production data with Excel, Python and Tableau, supporting approximately 7% shorter cycle times.',
      'Supported process management and tracking across more than five manufacturing improvement projects.',
      'Investigated quality issues, supporting approximately 15% better defect detection.',
      'Developed Python / OpenCV visual-inspection algorithms and automated reporting workflows.',
      'Coordinated production-tool design and orders, and documented processes for continuous improvement.'
    ],
    gained: 'Experience connecting production data, quality investigations and cross-department coordination to practical improvements on the manufacturing side.',
    tags: ['Python / OpenCV', 'Excel / Tableau', 'Process improvement']
  },
  {
    id: 'ford', name: 'Ford Otosan', logo: '/TahaErkinTunali/career/ford-otosan.png',
    period: 'JAN 2024 — PRESENT', role: 'Powertrain & Engine Brake Systems Engineer',
    summary: 'From vehicle simulation to engine component development.',
    introduction: 'My work at Ford Otosan spans propulsion performance, energy management, and my current role in powertrain and engine brake systems.',
    positions: [
      { period: 'JAN 2024 — JUL 2026', title: 'Propulsion Performance & Energy Management Engineer' },
      { period: 'AUG 2026 — PRESENT', title: 'Powertrain & Engine Brake Systems Engineer' }
    ],
    contributions: [
      'Developed engine, battery and thermal-management simulation models using GT-SUITE and supported component selection.',
      'Simulated thermal systems across more than 15 vehicle variants and supported calibration in extreme ambient and high-altitude conditions.',
      'Analyzed lubrication, friction and transmission efficiency; supported a 3% reduction in mechanical losses.',
      'Developed real-time HiL, SiL and MiL models using GT-SUITE, Simulink and Python, reducing calibration time and effort by approximately 50%.',
      'Built engineering automation tools and an AI knowledge assistant for technical documentation.',
      'Manage engine-component changes and WERS releases; investigate field quality and warranty issues, and update Teamcenter product data, BOM structures and CAD models.'
    ],
    gained: 'Experience connecting virtual validation, real vehicle behavior and engineering changes, from system-level simulation to component data and field-quality investigations.',
    tags: ['GT-SUITE / Simulink', 'WERS / Teamcenter', 'Engine brake systems']
  }
] as const;
