import { DEMO_CREDENTIALS } from '../utils/demoMode';

const STORAGE_KEYS = {
  jobs: 'smartrecruit_demo_jobs',
  applications: 'smartrecruit_demo_applications',
  users: 'smartrecruit_demo_users',
  seeded: 'smartrecruit_demo_seeded_v1',
};

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const uuid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `demo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const JOB_IDS = {
  frontend: '11111111-1111-4111-8111-111111111111',
  product: '22222222-2222-4222-8222-222222222222',
  ux: '33333333-3333-4333-8333-333333333333',
  devops: '44444444-4444-4444-8444-444444444444',
  marketing: '55555555-5555-4555-8555-555555555555',
  ml: '66666666-6666-4666-8666-666666666666',
  security: '77777777-7777-4777-8777-777777777777',
  sales: '88888888-8888-4888-8888-888888888888',
  qa: '99999999-9999-4999-8999-999999999999',
  mobile: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  writer: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  hrTech: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
};

function seedJobs() {
  const today = new Date();
  const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  };
  const daysFromNow = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: JOB_IDS.frontend,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      company: 'TechVision',
      employmentType: 'Full-time',
      description:
        'Build responsive UIs with React, TypeScript, and modern state management. 4+ years experience preferred.',
      postingDate: daysAgo(18),
      expirationDate: daysFromNow(42),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.product,
      title: 'Technical Product Manager',
      department: 'Product',
      location: 'New York, NY',
      company: 'InnovateX',
      employmentType: 'Full-time',
      description:
        'Lead cross-functional teams shipping AI-powered SaaS products. Strong technical background required.',
      postingDate: daysAgo(14),
      expirationDate: daysFromNow(30),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.ux,
      title: 'UX Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      company: 'DesignHub',
      employmentType: 'Full-time',
      description:
        'Own end-to-end product design from research through high-fidelity prototypes in Figma.',
      postingDate: daysAgo(12),
      expirationDate: daysFromNow(35),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.devops,
      title: 'Cloud Infrastructure Engineer',
      department: 'DevOps',
      location: 'Seattle, WA',
      company: 'CloudNova',
      employmentType: 'Full-time',
      description:
        'Design and operate AWS/GCP infrastructure with Terraform and Kubernetes.',
      postingDate: daysAgo(10),
      expirationDate: daysFromNow(40),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.marketing,
      title: 'Digital Marketing Lead',
      department: 'Marketing',
      location: 'Chicago, IL',
      company: 'GrowthMasters',
      employmentType: 'Part-time',
      description:
        'Plan and run multi-channel campaigns with a strong analytics focus.',
      postingDate: daysAgo(9),
      expirationDate: daysFromNow(25),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.ml,
      title: 'Machine Learning Engineer',
      department: 'Data Science',
      location: 'San Francisco, CA',
      company: 'DeepMind Labs',
      employmentType: 'Full-time',
      description:
        'Build and deploy ML models with Python/TensorFlow. NLP experience preferred.',
      postingDate: daysAgo(8),
      expirationDate: daysFromNow(50),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.security,
      title: 'Cybersecurity Analyst',
      department: 'Security',
      location: 'Austin, TX',
      company: 'SecureNet',
      employmentType: 'Contract',
      description:
        'Monitor network security and implement threat prevention. CISSP preferred.',
      postingDate: daysAgo(7),
      expirationDate: daysFromNow(20),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.sales,
      title: 'Sales Engineering Lead',
      department: 'Sales',
      location: 'Austin, TX',
      company: 'SaaS Pioneers',
      employmentType: 'Full-time',
      description:
        'Technical pre-sales for enterprise SaaS. Strong presentation skills required.',
      postingDate: daysAgo(6),
      expirationDate: daysFromNow(28),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.qa,
      title: 'QA Automation Engineer',
      department: 'Testing',
      location: 'Raleigh, NC',
      company: 'QualityAssured',
      employmentType: 'Full-time',
      description:
        'Build Selenium/Cypress automation frameworks and integrate with CI/CD.',
      postingDate: daysAgo(5),
      expirationDate: daysFromNow(45),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.mobile,
      title: 'Mobile Developer',
      department: 'Engineering',
      location: 'Seattle, WA',
      company: 'AppForge',
      employmentType: 'Full-time',
      description:
        'Ship React Native and native iOS/Android features for a consumer product.',
      postingDate: daysAgo(4),
      expirationDate: daysFromNow(38),
      status: 'Active',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.writer,
      title: 'Technical Writer',
      department: 'Content',
      location: 'Remote',
      company: 'DocuTech',
      employmentType: 'Part-time',
      description:
        'Create API docs and developer guides. Swagger/OpenAPI experience required.',
      postingDate: daysAgo(22),
      expirationDate: daysAgo(2),
      status: 'Closed',
      applicationCount: 0,
    },
    {
      id: JOB_IDS.hrTech,
      title: 'HR Technology Specialist',
      department: 'HR',
      location: 'Remote',
      company: 'PeopleFirst',
      employmentType: 'Contract',
      description:
        'Implement and optimize HRIS systems. Workday certification preferred.',
      postingDate: daysAgo(30),
      expirationDate: daysAgo(5),
      status: 'Closed',
      applicationCount: 0,
    },
  ];
}

function seedApplications() {
  const daysAgoIso = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };
  const dateOnly = (n) => daysAgoIso(n).split('T')[0];

  const apps = [
    {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      jobId: JOB_IDS.frontend,
      position: 'Senior Frontend Developer',
      company: 'TechVision',
      status: 'Under Review',
      phone: '+1 (512) 555-0142',
      coverLetter: 'Excited to bring my Vue and React experience to TechVision.',
      skills: ['React', 'TypeScript', 'Webpack'],
      resumePath: 'demo/michael_chen_resume.pdf',
      timeline: [
        { date: dateOnly(12), status: 'Application Received' },
        { date: dateOnly(10), status: 'Screening' },
        { date: dateOnly(7), status: 'Under Review' },
      ],
      appliedDate: daysAgoIso(12),
    },
    {
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      jobId: JOB_IDS.frontend,
      position: 'Senior Frontend Developer',
      company: 'TechVision',
      status: 'Interview',
      phone: '+1 (415) 555-0198',
      coverLetter: 'Full-stack engineer focused on React and GraphQL.',
      skills: ['React', 'Node.js', 'GraphQL'],
      resumePath: 'demo/emma_wilson_resume.pdf',
      timeline: [
        { date: dateOnly(11), status: 'Application Received' },
        { date: dateOnly(8), status: 'Code Challenge' },
        { date: dateOnly(5), status: 'Interview' },
      ],
      appliedDate: daysAgoIso(11),
    },
    {
      name: 'Alex Martinez',
      email: 'alex.martinez@example.com',
      jobId: JOB_IDS.ux,
      position: 'UX Designer',
      company: 'DesignHub',
      status: 'Offer',
      phone: '+1 (312) 555-0166',
      coverLetter: 'Accessibility-first designer with strong Figma craft.',
      skills: ['Figma', 'CSS', 'Accessibility'],
      resumePath: 'demo/alex_martinez_resume.pdf',
      timeline: [
        { date: dateOnly(14), status: 'Application Received' },
        { date: dateOnly(11), status: 'Portfolio Review' },
        { date: dateOnly(6), status: 'Design Challenge' },
        { date: dateOnly(2), status: 'Offer' },
      ],
      appliedDate: daysAgoIso(14),
    },
    {
      name: 'Jordan Taylor',
      email: 'jordan.taylor@example.com',
      jobId: JOB_IDS.devops,
      position: 'Cloud Infrastructure Engineer',
      company: 'CloudNova',
      status: 'Interview',
      phone: '+1 (617) 555-0133',
      coverLetter: 'DevOps engineer specializing in AWS and Terraform.',
      skills: ['AWS', 'Docker', 'Terraform'],
      resumePath: 'demo/jordan_taylor_resume.pdf',
      timeline: [
        { date: dateOnly(9), status: 'Application Received' },
        { date: dateOnly(6), status: 'Technical Screening' },
        { date: dateOnly(3), status: 'Interview' },
      ],
      appliedDate: daysAgoIso(9),
    },
    {
      name: 'Sophia Kim',
      email: 'sophia.kim@example.com',
      jobId: JOB_IDS.mobile,
      position: 'Mobile Developer',
      company: 'AppForge',
      status: 'Under Review',
      phone: '+1 (206) 555-0177',
      coverLetter: 'Mobile developer with React Native and native experience.',
      skills: ['React Native', 'Swift', 'Kotlin'],
      resumePath: 'demo/sophia_kim_resume.pdf',
      timeline: [
        { date: dateOnly(8), status: 'Application Received' },
        { date: dateOnly(5), status: 'Take-home Assignment' },
        { date: dateOnly(3), status: 'Under Review' },
      ],
      appliedDate: daysAgoIso(8),
    },
    {
      name: 'Noah Patel',
      email: 'noah.patel@example.com',
      jobId: JOB_IDS.product,
      position: 'Technical Product Manager',
      company: 'InnovateX',
      status: 'Received',
      phone: '+1 (212) 555-0111',
      coverLetter: 'PM with 6 years shipping B2B SaaS.',
      skills: ['Roadmapping', 'SQL', 'A/B Testing'],
      resumePath: 'demo/noah_patel_resume.pdf',
      timeline: [{ date: dateOnly(2), status: 'Application Received' }],
      appliedDate: daysAgoIso(2),
    },
    {
      name: 'Olivia Brooks',
      email: 'olivia.brooks@example.com',
      jobId: JOB_IDS.product,
      position: 'Technical Product Manager',
      company: 'InnovateX',
      status: 'Hired',
      phone: '+1 (646) 555-0188',
      coverLetter: 'Former engineer turned product leader.',
      skills: ['Agile', 'Jira', 'Stakeholder Management'],
      resumePath: 'demo/olivia_brooks_resume.pdf',
      timeline: [
        { date: dateOnly(20), status: 'Application Received' },
        { date: dateOnly(16), status: 'Under Review' },
        { date: dateOnly(12), status: 'Interview' },
        { date: dateOnly(7), status: 'Offer' },
        { date: dateOnly(4), status: 'Hired' },
      ],
      appliedDate: daysAgoIso(20),
    },
    {
      name: 'Liam Nguyen',
      email: 'liam.nguyen@example.com',
      jobId: JOB_IDS.ml,
      position: 'Machine Learning Engineer',
      company: 'DeepMind Labs',
      status: 'Assessment',
      phone: '+1 (408) 555-0144',
      coverLetter: 'ML engineer focused on NLP production systems.',
      skills: ['Python', 'TensorFlow', 'NLP'],
      resumePath: 'demo/liam_nguyen_resume.pdf',
      timeline: [
        { date: dateOnly(7), status: 'Application Received' },
        { date: dateOnly(4), status: 'Assessment' },
      ],
      appliedDate: daysAgoIso(7),
    },
    {
      name: 'Ava Rodriguez',
      email: 'ava.rodriguez@example.com',
      jobId: JOB_IDS.marketing,
      position: 'Digital Marketing Lead',
      company: 'GrowthMasters',
      status: 'Shortlisted',
      phone: '+1 (773) 555-0122',
      coverLetter: 'Growth marketer with paid social expertise.',
      skills: ['SEO', 'Google Ads', 'Analytics'],
      resumePath: 'demo/ava_rodriguez_resume.pdf',
      timeline: [
        { date: dateOnly(6), status: 'Application Received' },
        { date: dateOnly(3), status: 'Shortlisted' },
      ],
      appliedDate: daysAgoIso(6),
    },
    {
      name: 'Ethan Wright',
      email: 'ethan.wright@example.com',
      jobId: JOB_IDS.security,
      position: 'Cybersecurity Analyst',
      company: 'SecureNet',
      status: 'Rejected',
      phone: '+1 (512) 555-0190',
      coverLetter: 'Security analyst with SOC experience.',
      skills: ['SIEM', 'Threat Hunting', 'CISSP'],
      resumePath: 'demo/ethan_wright_resume.pdf',
      timeline: [
        { date: dateOnly(10), status: 'Application Received' },
        { date: dateOnly(5), status: 'Under Review' },
        { date: dateOnly(2), status: 'Rejected' },
      ],
      appliedDate: daysAgoIso(10),
    },
    {
      name: 'Mia Thompson',
      email: 'mia.thompson@example.com',
      jobId: JOB_IDS.qa,
      position: 'QA Automation Engineer',
      company: 'QualityAssured',
      status: 'Interview',
      phone: '+1 (919) 555-0155',
      coverLetter: 'Automation engineer with Cypress and CI/CD focus.',
      skills: ['Cypress', 'Selenium', 'CI/CD'],
      resumePath: 'demo/mia_thompson_resume.pdf',
      timeline: [
        { date: dateOnly(5), status: 'Application Received' },
        { date: dateOnly(2), status: 'Interview' },
      ],
      appliedDate: daysAgoIso(5),
    },
    {
      name: 'Lucas Silva',
      email: 'lucas.silva@example.com',
      jobId: JOB_IDS.sales,
      position: 'Sales Engineering Lead',
      company: 'SaaS Pioneers',
      status: 'Received',
      phone: '+1 (737) 555-0109',
      coverLetter: 'Sales engineer for enterprise SaaS deals.',
      skills: ['Pre-sales', 'Demos', 'Solution Architecture'],
      resumePath: 'demo/lucas_silva_resume.pdf',
      timeline: [{ date: dateOnly(1), status: 'Application Received' }],
      appliedDate: daysAgoIso(1),
    },
    {
      name: 'Isabella Garcia',
      email: 'isabella.garcia@example.com',
      jobId: JOB_IDS.ux,
      position: 'UX Designer',
      company: 'DesignHub',
      status: 'Under Review',
      phone: '+1 (415) 555-0171',
      coverLetter: 'Product designer with research and systems design background.',
      skills: ['User Research', 'Design Systems', 'Prototyping'],
      resumePath: 'demo/isabella_garcia_resume.pdf',
      timeline: [
        { date: dateOnly(4), status: 'Application Received' },
        { date: dateOnly(2), status: 'Under Review' },
      ],
      appliedDate: daysAgoIso(4),
    },
    {
      name: 'Benjamin Lee',
      email: 'benjamin.lee@example.com',
      jobId: JOB_IDS.devops,
      position: 'Cloud Infrastructure Engineer',
      company: 'CloudNova',
      status: 'Hired',
      phone: '+1 (206) 555-0139',
      coverLetter: 'SRE with deep Kubernetes experience.',
      skills: ['Kubernetes', 'GCP', 'Observability'],
      resumePath: 'demo/benjamin_lee_resume.pdf',
      timeline: [
        { date: dateOnly(25), status: 'Application Received' },
        { date: dateOnly(20), status: 'Interview' },
        { date: dateOnly(12), status: 'Offer' },
        { date: dateOnly(8), status: 'Hired' },
      ],
      appliedDate: daysAgoIso(25),
    },
    {
      name: 'Charlotte Adams',
      email: 'charlotte.adams@example.com',
      jobId: JOB_IDS.ml,
      position: 'Machine Learning Engineer',
      company: 'DeepMind Labs',
      status: 'Offer',
      phone: '+1 (650) 555-0160',
      coverLetter: 'Applied ML engineer shipping recommendation systems.',
      skills: ['PyTorch', 'MLOps', 'Feature Stores'],
      resumePath: 'demo/charlotte_adams_resume.pdf',
      timeline: [
        { date: dateOnly(15), status: 'Application Received' },
        { date: dateOnly(10), status: 'Assessment' },
        { date: dateOnly(5), status: 'Interview' },
        { date: dateOnly(1), status: 'Offer' },
      ],
      appliedDate: daysAgoIso(15),
    },
    {
      name: 'Henry Clark',
      email: 'henry.clark@example.com',
      jobId: JOB_IDS.frontend,
      position: 'Senior Frontend Developer',
      company: 'TechVision',
      status: 'Rejected',
      phone: '+1 (503) 555-0148',
      coverLetter: 'Frontend engineer with design-system experience.',
      skills: ['Vue', 'JavaScript', 'CSS'],
      resumePath: 'demo/henry_clark_resume.pdf',
      timeline: [
        { date: dateOnly(13), status: 'Application Received' },
        { date: dateOnly(9), status: 'Under Review' },
        { date: dateOnly(6), status: 'Rejected' },
      ],
      appliedDate: daysAgoIso(13),
    },
    {
      name: 'Amelia Foster',
      email: 'amelia.foster@example.com',
      jobId: JOB_IDS.qa,
      position: 'QA Automation Engineer',
      company: 'QualityAssured',
      status: 'Received',
      phone: '+1 (704) 555-0127',
      coverLetter: 'QA engineer passionate about shift-left testing.',
      skills: ['Playwright', 'API Testing', 'Jest'],
      resumePath: 'demo/amelia_foster_resume.pdf',
      timeline: [{ date: dateOnly(0), status: 'Application Received' }],
      appliedDate: daysAgoIso(0),
    },
    {
      name: 'Daniel Ortiz',
      email: 'daniel.ortiz@example.com',
      jobId: JOB_IDS.mobile,
      position: 'Mobile Developer',
      company: 'AppForge',
      status: 'Interview',
      phone: '+1 (503) 555-0182',
      coverLetter: 'iOS-focused engineer expanding into React Native.',
      skills: ['SwiftUI', 'React Native', 'Firebase'],
      resumePath: 'demo/daniel_ortiz_resume.pdf',
      timeline: [
        { date: dateOnly(6), status: 'Application Received' },
        { date: dateOnly(3), status: 'Interview' },
      ],
      appliedDate: daysAgoIso(6),
    },
    {
      name: 'Grace Bennett',
      email: 'grace.bennett@example.com',
      jobId: JOB_IDS.marketing,
      position: 'Digital Marketing Lead',
      company: 'GrowthMasters',
      status: 'Under Review',
      phone: '+1 (312) 555-0193',
      coverLetter: 'Content and lifecycle marketing specialist.',
      skills: ['HubSpot', 'Email', 'Content Strategy'],
      resumePath: 'demo/grace_bennett_resume.pdf',
      timeline: [
        { date: dateOnly(3), status: 'Application Received' },
        { date: dateOnly(1), status: 'Under Review' },
      ],
      appliedDate: daysAgoIso(3),
    },
    {
      name: 'William Hayes',
      email: 'william.hayes@example.com',
      jobId: JOB_IDS.sales,
      position: 'Sales Engineering Lead',
      company: 'SaaS Pioneers',
      status: 'Shortlisted',
      phone: '+1 (512) 555-0117',
      coverLetter: 'Enterprise SE with complex deal experience.',
      skills: ['Salesforce', 'Discovery', 'POC Delivery'],
      resumePath: 'demo/william_hayes_resume.pdf',
      timeline: [
        { date: dateOnly(4), status: 'Application Received' },
        { date: dateOnly(2), status: 'Shortlisted' },
      ],
      appliedDate: daysAgoIso(4),
    },
  ];

  return apps.map((app) => ({ id: uuid(), ...app }));
}

function seedUsers() {
  return [
    {
      id: 'user-admin-demo-0001',
      email: DEMO_CREDENTIALS.admin.email,
      password: DEMO_CREDENTIALS.admin.password,
      role: DEMO_CREDENTIALS.admin.role,
      firstName: 'Demo',
      lastName: 'Admin',
      jobTitle: 'Head of Talent',
      department: 'People',
      companyName: 'SmartRecruit Demo',
      website: 'https://smartrecruit.demo',
      address: '100 Demo Street, Austin, TX',
      companySize: '51-200',
      passwordResetRequired: false,
      twoFactorEnabled: false,
      newApplicationNotifications: true,
      statusChangeNotifications: true,
      interviewReminderNotifications: true,
      weeklyDigestNotifications: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-hr-demo-0002',
      email: DEMO_CREDENTIALS.hr.email,
      password: DEMO_CREDENTIALS.hr.password,
      role: DEMO_CREDENTIALS.hr.role,
      firstName: 'Demo',
      lastName: 'Recruiter',
      jobTitle: 'HR Administrator',
      department: 'People',
      companyName: 'SmartRecruit Demo',
      website: 'https://smartrecruit.demo',
      address: '100 Demo Street, Austin, TX',
      companySize: '51-200',
      passwordResetRequired: false,
      twoFactorEnabled: false,
      newApplicationNotifications: true,
      statusChangeNotifications: true,
      interviewReminderNotifications: true,
      weeklyDigestNotifications: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function syncApplicationCounts(jobs, applications) {
  return jobs.map((job) => ({
    ...job,
    applicationCount: applications.filter((a) => a.jobId === job.id).length,
  }));
}

function ensureSeeded() {
  if (typeof localStorage === 'undefined') return;

  if (localStorage.getItem(STORAGE_KEYS.seeded) === 'true') {
    // Keep counts in sync if data already exists
    const jobs = read(STORAGE_KEYS.jobs, []);
    const applications = read(STORAGE_KEYS.applications, []);
    if (jobs.length) {
      write(STORAGE_KEYS.jobs, syncApplicationCounts(jobs, applications));
    }
    return;
  }

  const jobs = seedJobs();
  const applications = seedApplications();
  const users = seedUsers();

  write(STORAGE_KEYS.jobs, syncApplicationCounts(jobs, applications));
  write(STORAGE_KEYS.applications, applications);
  write(STORAGE_KEYS.users, users);
  localStorage.setItem(STORAGE_KEYS.seeded, 'true');
}

ensureSeeded();

function getJobs() {
  ensureSeeded();
  return read(STORAGE_KEYS.jobs, []);
}

function setJobs(jobs) {
  write(STORAGE_KEYS.jobs, jobs);
}

function getApplications() {
  ensureSeeded();
  return read(STORAGE_KEYS.applications, []);
}

function setApplications(applications) {
  write(STORAGE_KEYS.applications, applications);
  setJobs(syncApplicationCounts(getJobs(), applications));
}

function getUsers() {
  ensureSeeded();
  return read(STORAGE_KEYS.users, []);
}

function setUsers(users) {
  write(STORAGE_KEYS.users, users);
}

function matchesFilters(job, filters = {}) {
  return Object.entries(filters).every(([key, value]) => {
    if (!value) return true;
    if (key === 'postedWithin') {
      const days = Number(value);
      if (!days) return true;
      const posted = new Date(job.postingDate).getTime();
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      return posted >= cutoff;
    }
    const field = String(job[key] ?? '').toLowerCase();
    return field === String(value).toLowerCase();
  });
}

export const demoStore = {
  async login(email, password) {
    await delay();
    const user = getUsers().find(
      (u) =>
        u.email.toLowerCase() === String(email).toLowerCase() &&
        u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...safeUser } = user;
    void _;
    const access_token = `demo-token-${safeUser.id}`;
    return {
      access_token,
      user: {
        id: safeUser.id,
        email: safeUser.email,
        role: safeUser.role,
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
      },
    };
  },

  async requestPasswordReset(email) {
    await delay();
    // Silent success whether or not the email exists (mirrors backend)
    void email;
  },

  async getAllJobs(filters = {}) {
    await delay();
    return getJobs().filter((job) => matchesFilters(job, filters));
  },

  async getPublicJobs(filters = {}) {
    await delay();
    return getJobs()
      .filter((job) => job.status === 'Active')
      .filter((job) => matchesFilters(job, filters));
  },

  async getJob(id) {
    await delay();
    const job = getJobs().find((j) => j.id === id);
    if (!job) throw new Error('Job not found');
    return job;
  },

  async getJobApplicants(jobId) {
    await delay();
    return getApplications().filter((a) => a.jobId === jobId);
  },

  async createJob(jobData) {
    await delay();
    const job = {
      id: uuid(),
      status: 'Active',
      applicationCount: 0,
      ...jobData,
    };
    const jobs = [...getJobs(), job];
    setJobs(jobs);
    return job;
  },

  async updateJob(id, jobData) {
    await delay();
    const jobs = getJobs();
    const index = jobs.findIndex((j) => j.id === id);
    if (index === -1) throw new Error('Job not found');
    jobs[index] = { ...jobs[index], ...jobData };
    setJobs(jobs);
    return jobs[index];
  },

  async deleteJob(id) {
    await delay();
    setJobs(getJobs().filter((j) => j.id !== id));
    setApplications(getApplications().filter((a) => a.jobId !== id));
  },

  async closePosition(id) {
    return this.updateJob(id, { status: 'Closed' });
  },

  async getApplications() {
    await delay();
    return getApplications();
  },

  async submitApplication(applicationData, resumeFile) {
    await delay(400);
    if (!resumeFile) throw new Error('Resume file is required');

    const application = {
      id: uuid(),
      name: applicationData.name,
      email: applicationData.email,
      jobId: applicationData.jobId,
      position: applicationData.position,
      company: applicationData.company,
      coverLetter: applicationData.coverLetter || '',
      phone: applicationData.phone || null,
      skills: applicationData.skills || [],
      status: 'Received',
      resumePath: `demo/${resumeFile.name}`,
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          status: 'Application Received',
        },
      ],
      appliedDate: new Date().toISOString(),
    };

    setApplications([application, ...getApplications()]);
    return application;
  },

  async updateApplicationStatus(id, status) {
    await delay();
    const applications = getApplications();
    const index = applications.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const timeline = [
      ...(applications[index].timeline || []),
      { date: new Date().toISOString().split('T')[0], status },
    ];

    applications[index] = { ...applications[index], status, timeline };
    setApplications(applications);
    return applications[index];
  },

  async deleteApplication(id) {
    await delay();
    setApplications(getApplications().filter((a) => a.id !== id));
  },

  async downloadResume(id) {
    await delay();
    const application = getApplications().find((a) => a.id === id);
    if (!application) throw new Error('Application not found');

    const content = [
      `SmartRecruit Demo Resume`,
      `=======================`,
      `Name: ${application.name}`,
      `Email: ${application.email}`,
      `Position: ${application.position}`,
      `Company: ${application.company}`,
      `Skills: ${(application.skills || []).join(', ')}`,
      '',
      'This is a demo resume file. No real document is stored in demo mode.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${application.name.replace(/\s+/g, '_').toLowerCase()}_resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  },

  async getDashboardStats() {
    await delay();
    const applications = getApplications();
    const jobs = getJobs();

    const totalApplications = applications.length;
    const totalUnderReview = applications.filter((a) => a.status === 'Under Review').length;
    const totalInterviews = applications.filter((a) => a.status === 'Interview').length;
    const totalOffers = applications.filter((a) => a.status === 'Offer').length;
    const totalHired = applications.filter((a) => a.status === 'Hired').length;
    const totalRejected = applications.filter((a) => a.status === 'Rejected').length;

    const hiredApplications = applications.filter((a) => a.status === 'Hired');
    const avgTimeToHire =
      hiredApplications.length > 0
        ? hiredApplications.reduce((acc, app) => {
            const days = Math.ceil(
              (Date.now() - new Date(app.appliedDate).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return acc + days;
          }, 0) / hiredApplications.length
        : 0;

    const openPositions = jobs
      .filter((j) => j.status === 'Active')
      .slice(0, 5)
      .map((job) => ({
        title: job.title,
        department: job.department,
        count: applications.filter((a) => a.jobId === job.id).length,
        days: job.expirationDate
          ? Math.ceil(
              (new Date(job.expirationDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          : 30,
      }));

    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    const pipelineData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count: String(count),
    }));

    return {
      stats: {
        totalApplications,
        totalUnderReview,
        totalInterviews,
        totalOffers,
        totalHired,
        totalRejected,
        avgTimeToHire: Math.round(avgTimeToHire),
        costPerHire: 5000,
        offerAcceptanceRate:
          totalOffers > 0 ? Math.round((totalHired / totalOffers) * 100) : 0,
      },
      openPositions,
      pipelineData,
    };
  },

  async getUsers() {
    await delay();
    return getUsers().map(({ password, ...user }) => {
      void password;
      return user;
    });
  },

  async createUser(userData) {
    await delay();
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }
    const user = {
      id: uuid(),
      passwordResetRequired: true,
      firstName: '',
      lastName: '',
      jobTitle: '',
      department: '',
      companyName: 'SmartRecruit Demo',
      createdAt: new Date().toISOString(),
      ...userData,
    };
    setUsers([...users, user]);
    const { password, ...safe } = user;
    void password;
    return safe;
  },

  async updateUser(id, userData) {
    await delay();
    const users = getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...userData };
    setUsers(users);
    const { password, ...safe } = users[index];
    void password;
    return safe;
  },

  async deleteUser(id) {
    await delay();
    setUsers(getUsers().filter((u) => u.id !== id));
  },

  async getSettings(userId) {
    await delay();
    const user = getUsers().find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    const { password, ...safe } = user;
    void password;
    return safe;
  },

  async updateProfile(userId, profileData) {
    return this.updateUser(userId, profileData);
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    await delay();
    const users = getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    if (users[index].password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    users[index] = {
      ...users[index],
      password: newPassword,
      passwordResetRequired: false,
    };
    setUsers(users);
    return { message: 'Password updated successfully' };
  },

  async updateNotifications(userId, notificationSettings) {
    return this.updateUser(userId, notificationSettings);
  },

  async enable2FA(userId) {
    await delay();
    await this.updateUser(userId, { twoFactorEnabled: false, twoFactorSecret: 'DEMOSECRET' });
    return { secret: 'DEMOSECRET', qrCodeUrl: null, message: 'Demo 2FA secret generated' };
  },

  async verify2FA(userId, code) {
    await delay();
    if (String(code) !== '123456') {
      throw new Error('Invalid code. In demo mode use 123456.');
    }
    return this.updateUser(userId, { twoFactorEnabled: true });
  },

  async disable2FA(userId) {
    return this.updateUser(userId, { twoFactorEnabled: false, twoFactorSecret: null });
  },

  resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.jobs);
    localStorage.removeItem(STORAGE_KEYS.applications);
    localStorage.removeItem(STORAGE_KEYS.users);
    localStorage.removeItem(STORAGE_KEYS.seeded);
    ensureSeeded();
  },
};

export default demoStore;
