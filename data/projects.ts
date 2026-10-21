export type PortfolioProject = {
  id:string;title:string;subtitle:string;category:string;period:string;group:'Industry'|'University';
  visual:'thermal'|'manufacturing'|'hydrogen'|'base'|'bicycle'|'solar';image:string;imageAlt:string;visualCaption:string;
  role:string;description:string;contributionSummary:string;outcomeSummary:string;outcomeLabel:string;
  challenge:string;approach:string;outcome:string;metric:string;metricLabel:string;tools:string[];logo:string;
  context:string;url:string;urlLabel:string;
};

// CV-backed studies, with BASE contribution grounded in the user's project notes.
// Artwork is illustrative; it does not reproduce confidential models or prototypes.
export const projects:PortfolioProject[] = [
  {
    id:'01',title:'Vehicle simulation & thermal management',subtitle:'Ford Otosan · Virtual validation',category:'Ford Otosan',period:'2024–2026',group:'Industry',visual:'thermal',
    image:'/TahaErkinTunali/projects/thermal.svg',imageAlt:'Illustrative truck thermal system with a battery, cooling circuit and electric drive',visualCaption:'System illustration',logo:'/TahaErkinTunali/career/ford-otosan.png',
    role:'Propulsion Performance & Energy Management Engineer',
    description:'Using virtual vehicle models to understand cooling, energy use and propulsion performance before physical tests.',
    contributionSummary:'Built GT-SUITE models and supported component selection, calibration and real-time validation.',
    outcomeSummary:'Thermal simulation across 15+ vehicle variants; approximately 50% less calibration time and effort.',outcomeLabel:'Reported results',
    challenge:'Evaluate engine, battery and thermal systems across vehicle variants, high-altitude operation and extreme ambient conditions.',
    approach:'Developed GT-SUITE simulation models, supported component selection and calibration, and created real-time HiL, SiL and MiL models with Simulink and Python.',
    outcome:'My CV records thermal simulations for more than 15 vehicle variants, a 3% reduction in mechanical losses through lubrication optimisation, and approximately 50% less calibration time and effort from real-time models. These results cover several engineering activities, rather than one vehicle programme.',
    metric:'15+',metricLabel:'vehicle variants',tools:['GT-SUITE','MATLAB','Simulink','Python'],context:'A selection of my propulsion and thermal engineering work at Ford Otosan.',url:'',urlLabel:''
  },
  {
    id:'02',title:'Manufacturing data & visual inspection',subtitle:'Siemens · Production improvement',category:'Siemens',period:'2022–2023',group:'Industry',visual:'manufacturing',
    image:'/TahaErkinTunali/projects/manufacturing.svg',imageAlt:'Illustrative production line with camera inspection and highlighted component checks',visualCaption:'Workflow illustration',logo:'/TahaErkinTunali/career/siemens.png',
    role:'Manufacturing Engineer · Working Student',
    description:'Turning production data and camera images into clearer quality checks and better process decisions.',
    contributionSummary:'Analysed production data, developed OpenCV inspection algorithms and automated reporting.',
    outcomeSummary:'Supported 5+ improvement projects, approximately 7% shorter cycle times and 15% better defect detection.',outcomeLabel:'Reported results',
    challenge:'Identify process inefficiencies and improve quality visibility across manufacturing projects.',
    approach:'Analysed production data in Excel, Python and Tableau; developed image-processing algorithms for visual inspection; supported root-cause investigations and automated reporting workflows.',
    outcome:'Supported more than five improvement projects, with approximately 7% shorter cycle times and approximately 15% better defect detection, as recorded in my CV.',
    metric:'~7%',metricLabel:'shorter cycle times',tools:['Python','OpenCV','Excel','Tableau'],context:'My part-time manufacturing engineering work at Siemens, alongside my university studies.',url:'',urlLabel:''
  },
  {
    id:'03',title:'Battery + fuel cell hybrid truck',subtitle:'BTruck · Undergraduate thesis',category:'Yıldız Technical University',period:'February–June 2023',group:'University',visual:'hydrogen',
    image:'/TahaErkinTunali/projects/hydrogen.svg',imageAlt:'Concept illustration of a truck using a battery and hydrogen fuel cell, with renewable hydrogen supply',visualCaption:'Thesis concept illustration',logo:'/TahaErkinTunali/career/yildiz.png',
    role:'Mechanical Engineering student · Graduation thesis',
    description:'My graduation thesis explored how batteries and hydrogen fuel cells could work together in long-distance freight transport.',
    contributionSummary:'Studied hybrid truck energy systems and renewable-powered hydrogen production stations.',
    outcomeSummary:'Compared battery and fuel cell trade-offs and proposed a hybrid approach to range and charging challenges.',outcomeLabel:'Study outcome',
    challenge:'Investigate sustainable heavy-duty transport while addressing the range and charging constraints of long-distance freight.',
    approach:'Researched hybrid battery-electric and fuel cell truck systems; designed and analysed renewable-powered hydrogen production stations; evaluated the advantages and limitations of both energy technologies.',
    outcome:'Proposed a hybrid heavy-duty transport approach supported by an assessment of energy supply, range and charging trade-offs. This was an academic design and analysis study.',
    metric:'BEV + FCEV',metricLabel:'hybrid transport study',tools:['Energy systems','Hydrogen','Renewables'],context:'BTruck (Hybrid Battery Electric / Fuel Cell Electric) and Investigation of Hydrogen Production Stations — my undergraduate thesis at Yıldız Technical University.',url:'',urlLabel:''
  },
  {
    id:'04',title:'BASE · Battery & vehicle modelling',subtitle:'Horizon Europe · WP7 / UC2',category:'Ford Otosan',period:'Horizon Europe collaboration',group:'Industry',visual:'base',
    image:'/TahaErkinTunali/projects/base.svg',imageAlt:'Illustrative battery pack linked to battery ageing, thermal modelling and virtual validation studies',visualCaption:'Modelling concept illustration',logo:'/TahaErkinTunali/career/ford-otosan.png',
    role:'Battery & integrated vehicle modelling · WP7 / UC2 contributor',
    description:'My work in BASE focused on battery ageing, thermal behaviour and an integrated virtual vehicle demonstrator.',
    contributionSummary:'Worked on ageing and thermal models, worst-case scenarios and vehicle–battery–cooling integration.',
    outcomeSummary:'Model-based insight into battery life, thermal safety and virtual calibration; technical input to the UC2 demonstrator.',outcomeLabel:'Engineering contribution',
    challenge:'Understand how battery ageing, thermal behaviour and vehicle operation affect performance, life and safety in the UC2 demonstrator.',
    approach:'Worked on battery ageing models and test correlation, pack-level thermal and propagation scenarios, worst-case analysis, and an integrated drivetrain–battery–cooling–control model. Supported virtual demonstrations of energy use and range across driving profiles, UC2 planning and technical reporting.',
    outcome:'Contributed modelling knowledge for virtual validation and calibration, battery-life estimation and thermal-safety analysis. These are my engineering contributions within WP7 / UC2; they are distinct from the wider consortium’s Digital Battery Passport work.',
    metric:'WP7 / UC2',metricLabel:'virtual demonstrator',tools:['1D simulation','Battery ageing','Thermal models','Virtual validation'],
    context:'BASE is a Horizon Europe project developing a Digital Battery Passport for battery traceability, performance and circularity. Ford Otosan is a project participant. The official project link describes the consortium scope; the contribution above describes my own work.',
    url:'https://base-batterypassport.com/',urlLabel:'Official BASE project'
  },
  {
    id:'05',title:'A new bicycle concept',subtitle:'University · Systematic design',category:'Yıldız Technical University',period:'2021',group:'University',visual:'bicycle',
    image:'/TahaErkinTunali/projects/bicycle.svg',imageAlt:'Illustrative bicycle frame concept with design construction lines',visualCaption:'Concept illustration',logo:'/TahaErkinTunali/career/yildiz.png',
    role:'Mechanical Engineering student · Concept design',
    description:'A university project exploring a new bicycle concept through a systematic design approach.',
    contributionSummary:'Worked on the bicycle conceptual design study using a structured design method.',
    outcomeSummary:'An academic concept design study, recorded among the university projects in my CV.',outcomeLabel:'Study outcome',
    challenge:'Explore a bicycle concept through a systematic design approach.',
    approach:'Completed academic conceptual design work for “A New Bicycle Conceptual Design with Systematic Design Approach”.',
    outcome:'A university concept design project completed in 2021. The illustration presents the subject of the study, rather than an original CAD model or a manufactured prototype.',
    metric:'2021',metricLabel:'concept design project',tools:['Concept design','Systematic design'],context:'A New Bicycle Conceptual Design with Systematic Design Approach — a university project listed in my CV.',url:'',urlLabel:''
  },
  {
    id:'06',title:'Solar energy design in Konya',subtitle:'University · Renewable energy',category:'Yıldız Technical University',period:'2022',group:'University',visual:'solar',
    image:'/TahaErkinTunali/projects/solar.svg',imageAlt:'Illustrative photovoltaic panels and sunlight representing a solar energy design study in Konya',visualCaption:'Study illustration',logo:'/TahaErkinTunali/career/yildiz.png',
    role:'Mechanical Engineering student · Solar energy study',
    description:'A university solar-energy design and analysis project focused on Konya.',
    contributionSummary:'Worked on the design and analysis of a solar energy study for Konya.',
    outcomeSummary:'An academic renewable-energy study, recorded in my CV.',outcomeLabel:'Study outcome',
    challenge:'Study solar energy design and analysis for a Konya-based academic project.',
    approach:'Completed the “Solar Energy Design and Analysis Konya” university project in 2022.',
    outcome:'An academic solar energy design and analysis study. The drawing illustrates the project topic, rather than a photograph of an installed system.',
    metric:'2022',metricLabel:'solar energy study',tools:['Solar energy','Energy analysis'],context:'Solar Energy Design and Analysis Konya — a university project listed in my CV.',url:'',urlLabel:''
  }
];
