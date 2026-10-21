import {projects} from './projects';

// Portfolio and contact details supplied by the owner; publication links are primary sources.
export const portfolio = {
  name: 'Taha', fullName: 'Taha Erkin Tunalı', role: 'Powertrain & Engine Brake Systems Engineer', industry: 'Ford Otosan',
  intro: 'I’m Taha Erkin Tunalı. I connect engine systems, simulation and data to make automotive engineering move forward.',
  about: 'I am a mechanical engineer at Ford Otosan, working on powertrain and engine brake systems. My experience connects engine performance, thermal management and virtual validation with manufacturing, product data and real-world problem solving.',
  aboutDetail: 'From production optimization at Siemens to electric and combustion vehicle simulation at Ford, I combine engineering fundamentals with Python, CAE and machine learning. My research explores more efficient thermal management for battery electric vehicles.',
  email: 'tahaerkintunali@gmail.com',
  location: 'Istanbul, Türkiye', linkedin: 'https://www.linkedin.com/in/taha-erkin-tunal%C4%B1-1a0999208/', github: '',
  cv: '/TahaErkinTunali/cv/Taha-Erkin-Tunali-CV.pdf?rev=20261010', cvLabel: 'August 2026 · 4 pages · PDF',
  cvPages: [
    { src: '/TahaErkinTunali/cv/page-1.webp?rev=20261010', title: 'Profile, education & skills' },
    { src: '/TahaErkinTunali/cv/page-2.webp', title: 'Publications, internships & Siemens' },
    { src: '/TahaErkinTunali/cv/page-3.webp', title: 'Ford Otosan experience' },
    { src: '/TahaErkinTunali/cv/page-4.webp', title: 'Thesis, projects & activities' }
  ],
  skills: [
    {title:'Powertrain & engine systems',number:'01',summary:'From component changes to field performance.',items:['Engine brake systems','WERS release processes','Field quality & root cause analysis']},
    {title:'Thermal & energy management',number:'02',summary:'Connect energy, temperature and vehicle efficiency.',items:['BEV & ICE thermal systems','Heat pumps & cooling loops','Component selection & benchmarking']},
    {title:'Simulation & validation',number:'03',summary:'Understand the system before the physical test.',items:['GT-SUITE system models','HiL / SiL / MiL development','Calibration & extreme conditions']},
    {title:'Design & manufacturing',number:'04',summary:'Turn analysis into practical engineering changes.',items:['CAD models & technical drawings','Teamcenter & BOM structures','Production process improvement']},
    {title:'Programming & automation',number:'05',summary:'Make engineering knowledge and data useful.',items:['Python engineering tools','Machine learning & predictive control','Data analysis & visualization']}
  ],
  tools: [
    {name:'GT-SUITE',logo:'gt-suite',category:'Simulation',detail:'Powertrain, lubrication and thermal system simulation.',color:'#1597cf'},
    {name:'MATLAB',logo:'matlab',category:'Simulation',detail:'Numerical analysis, calibration and engineering calculations.',color:'#f47a21'},
    {name:'Simulink',logo:'simulink',category:'Simulation',detail:'Real-time models and HiL, SiL and MiL development.',color:'#fba928'},
    {name:'Ansys',logo:'ansys',category:'Simulation',detail:'Engineering analysis and simulation.',color:'#ffbc00'},
    {name:'PVsyst',logo:'pvsyst',category:'Simulation',detail:'Solar energy design and performance analysis.',color:'#ffc800'},
    {name:'RETScreen',logo:'retscreen',category:'Simulation',detail:'Renewable energy and efficiency analysis.',color:'#299452'},
    {name:'AutoCAD',logo:'autocad',category:'CAD & PLM',detail:'Technical drawings and design documentation.',color:'#ed2147'},
    {name:'SOLIDWORKS',logo:'solidworks',category:'CAD & PLM',detail:'Mechanical part and assembly design.',color:'#ef272d'},
    {name:'Siemens NX',logo:'siemens-nx',category:'CAD & PLM',detail:'Integrated mechanical design and CAD workflows.',color:'#00cccc'},
    {name:'CATIA',logo:'catia',category:'CAD & PLM',detail:'Mechanical modeling and product design.',color:'#2877bd'},
    {name:'Autodesk Fusion',logo:'fusion',category:'CAD & PLM',detail:'3D design and mechanical modeling.',color:'#f78921'},
    {name:'Teamcenter',logo:'teamcenter',category:'CAD & PLM',detail:'Product data, BOM structures and engineering changes.',color:'#00cccc'},
    {name:'Python',logo:'python',category:'Data & code',detail:'Engineering automation, OpenCV and data analysis.',color:'#ffd343'},
    {name:'C',logo:'c',category:'Data & code',detail:'Programming and computational problem solving.',color:'#6295cb'},
    {name:'Tableau',logo:'tableau',category:'Data & code',detail:'Production data visualization and dashboards.',color:'#e97627'},
    {name:'Microsoft Excel',logo:'excel',category:'Data & code',detail:'Engineering calculations, benchmarking and reporting.',color:'#21a366'},
    {name:'Microsoft Word',logo:'word',category:'Data & code',detail:'Technical documentation and engineering reports.',color:'#185abd'},
    {name:'Microsoft PowerPoint',logo:'powerpoint',category:'Data & code',detail:'Technical reviews and project communication.',color:'#d35230'},
    {name:'Control FPWIN Pro',logo:'fpwin',category:'Automation',detail:'PLC programming and automation software.',color:'#0066b3'}
  ],
  projects,
  publications: [
    {journal:'International Journal of Heat and Mass Transfer',title:'Range improvement in BEV trucks using heat pump for cabin heating instead of PTC heater',date:'Vol. 256 · 2026 · Article 127910',cover:'/TahaErkinTunali/publications/ijhmt.webp',url:'https://doi.org/10.1016/j.ijheatmasstransfer.2025.127910',topic:'Battery electric trucks · Heat pumps',description:'Research on cabin heating and the energy and range implications of replacing a PTC heater with a heat pump.'},
    {journal:'Thermal Science and Engineering Progress',title:'Machine learning-based predictive control of thermal management system in battery electric vehicles',date:'Vol. 67 · 2025 · Article 104104',cover:'/TahaErkinTunali/publications/tsep.jpg',url:'https://doi.org/10.1016/j.tsep.2025.104104',topic:'Machine learning · Predictive control',description:'Research connecting machine learning and predictive control to battery electric vehicle thermal management.'}
  ],
  experience: [
    {period:'AUG 2026 — PRESENT',role:'Powertrain & Engine Brake Systems Engineer',company:'Ford Otosan',detail:'Managing engine component changes and releases through WERS, investigating field quality and warranty issues, and updating Teamcenter product data, BOM structures and CAD models.'},
    {period:'JAN 2024 — JUL 2026',role:'Propulsion Performance & Energy Management Engineer',company:'Ford Otosan',detail:'Developed and optimized propulsion, battery and thermal simulation models. Worked on lubrication and friction, transmission efficiency, extreme-condition calibration, real-time models and Python engineering automation.'},
    {period:'SEP 2022 — AUG 2023',role:'Manufacturing Engineer · Working Student',company:'Siemens',detail:'Production data analysis, process improvement, quality root cause analysis, OpenCV inspection and reporting automation across manufacturing improvement projects.'},
    {period:'2021 — 2023',role:'Engineering internships',company:'Akım Metal & Siemens',detail:'Manufacturing internship at Akım Metal (June–August 2021); construction internship at Siemens (November 2022–January 2023); business and organizational internship at Siemens (March–May 2023).'}
  ],
  education: {university:'Yıldız Technical University',degree:'BSc, Mechanical Engineering',period:'2018 — 2023',gpa:'3.07 / 4.00',activities:['Formula Student · Suspension Support Team (2020–2021)','Leap Event · Case Competition Winner (2022)']},
  academicProjects: ['Mechanical pencil · Technical drawing (2019–2020)','Bicycle conceptual design · Systematic design approach (2021)','Solar energy design & analysis · Konya (2022)'],
  languages: ['English · C1','German · A2','Romanian · A1']
};
