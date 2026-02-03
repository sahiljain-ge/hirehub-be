import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig, Client } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
// Constants inlined to avoid ESM import issues in seed script
const skills = [
  'TypeScript', 'JavaScript', 'Python', 'React', 'Node.js',
  'PostgreSQL', 'Docker', 'AWS', 'UI/UX Design', 'SEO',
  'Project Management', 'Machine Learning', 'GraphQL', 'Kubernetes'
  ,
  'Distributed Systems', 'Event-Driven Architecture', 'Domain-Driven Design',
  'CQRS', 'Event Sourcing', 'High Availability', 'Scalability Engineering',
  'Load Balancing', 'Caching Strategies', 'Fault Tolerance',

  // APIs & Integration
  'API Gateway', 'API Versioning', 'Rate Limiting', 'Webhooks',
  'OpenAPI Specification', 'Swagger', 'Postman', 'Insomnia',
  'Third-Party Integrations', 'Payment Gateway Integration',

  // Messaging & Streaming
  'Apache Kafka', 'RabbitMQ', 'ActiveMQ', 'Amazon SQS',
  'Amazon SNS', 'Google Pub/Sub', 'Apache Pulsar',
  'Message Queues', 'Stream Processing',

  // Observability & Reliability
  'Logging', 'Monitoring', 'Alerting', 'Tracing',
  'Prometheus', 'Grafana', 'Datadog', 'New Relic',
  'Sentry', 'Elastic APM', 'Site Reliability Engineering',

  // Build & Tooling
  'Webpack', 'Vite', 'Rollup', 'Parcel',
  'Babel', 'ESLint', 'Prettier',
  'Husky', 'Lint-Staged', 'NPM', 'Yarn', 'PNPM',

  // OS & Networking
  'Linux', 'Unix', 'Windows Server',
  'Shell Scripting', 'Bash', 'Zsh',
  'TCP/IP', 'HTTP/HTTPS', 'DNS',
  'CDN Management', 'Nginx', 'Apache',

  // CMS & E-commerce
  'WordPress', 'Headless CMS', 'Strapi',
  'Contentful', 'Sanity', 'Ghost',
  'Shopify', 'WooCommerce', 'Magento',
  'BigCommerce', 'Payment Processing',

  // Game & Graphics
  'Unity', 'Unreal Engine', 'Game Development',
  '2D Game Design', '3D Modeling',
  'OpenGL', 'WebGL', 'Shader Programming',
  'Physics Engines',
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'R', 'MATLAB', 'Scala', 'Perl',
  'Haskell', 'Lua',

  // Frontend
  'HTML5', 'CSS3', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap', 'Material UI',
  'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'Svelte', 'Redux',
  'Zustand', 'MobX', 'jQuery', 'Web Components', 'Storybook',

  // Backend
  'Node.js', 'Express.js', 'NestJS', 'Fastify', 'Django', 'Flask', 'FastAPI',
  'Spring Boot', 'ASP.NET', 'Laravel', 'Symfony', 'Ruby on Rails',
  'GraphQL', 'REST APIs', 'gRPC', 'Microservices',

  // Databases
  'PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'MongoDB', 'Cassandra',
  'Redis', 'DynamoDB', 'Firebase', 'Firestore', 'Elasticsearch',
  'Neo4j', 'InfluxDB',

  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud Platform', 'Docker', 'Docker Compose',
  'Kubernetes', 'Helm', 'Terraform', 'Pulumi', 'Ansible', 'Jenkins',
  'GitHub Actions', 'GitLab CI', 'CircleCI', 'ArgoCD', 'Serverless',

  // Mobile
  'React Native', 'Flutter', 'SwiftUI', 'UIKit', 'Android SDK',
  'Jetpack Compose', 'Ionic', 'Xamarin',

  // Data & AI
  'Machine Learning', 'Deep Learning', 'Data Science', 'Data Analysis',
  'Pandas', 'NumPy', 'SciPy', 'Scikit-learn', 'TensorFlow', 'PyTorch',
  'Keras', 'OpenCV', 'Natural Language Processing', 'Computer Vision',
  'MLOps', 'Data Visualization', 'Power BI', 'Tableau',

  // Testing & Quality
  'Unit Testing', 'Integration Testing', 'End-to-End Testing',
  'Jest', 'Mocha', 'Chai', 'Vitest', 'Cypress', 'Playwright',
  'Selenium', 'Testing Library', 'QA Automation',

  // Security
  'Web Security', 'OWASP', 'Authentication', 'Authorization',
  'OAuth', 'JWT', 'SSO', 'Penetration Testing', 'Cryptography',
  'Network Security', 'Application Security',

  // Design & Product
  'UI Design', 'UX Design', 'User Research', 'Wireframing',
  'Prototyping', 'Figma', 'Sketch', 'Adobe XD', 'Design Systems',
  'Accessibility', 'Usability Testing',

  // Dev Tools & Practices
  'Git', 'GitFlow', 'Monorepos', 'Nx', 'Turborepo', 'Agile',
  'Scrum', 'Kanban', 'CI/CD', 'Code Review', 'Refactoring',
  'Clean Code', 'System Design',

  // Business & Soft Skills
  'Project Management', 'Product Management', 'Stakeholder Management',
  'Technical Writing', 'Documentation', 'Mentoring', 'Leadership',
  'Problem Solving', 'Critical Thinking', 'Communication',
  'Time Management', 'Team Collaboration', 'Remote Work',

  // Marketing & Growth
  'SEO', 'SEM', 'Google Analytics', 'A/B Testing',
  'Conversion Rate Optimization', 'Content Strategy',
  'Email Marketing', 'Social Media Marketing'
  ,

  // Blockchain & Web3
  'Blockchain', 'Smart Contracts',
  'Solidity', 'Ethereum', 'Polygon',
  'Web3.js', 'Ethers.js',
  'NFT Development', 'DeFi', 'Cryptography Protocols',

  // AI & Automation
  'Prompt Engineering', 'AI Model Fine-Tuning',
  'Chatbot Development', 'Recommendation Systems',
  'Robotic Process Automation', 'Workflow Automation',
  'AutoML', 'Feature Engineering',

  // Data Engineering
  'ETL Pipelines', 'ELT Pipelines',
  'Apache Airflow', 'Apache Spark',
  'Hadoop', 'Data Warehousing',
  'Snowflake', 'BigQuery', 'Redshift',
  'Data Governance',

  // Compliance & Standards
  'GDPR Compliance', 'HIPAA Compliance',
  'SOC 2', 'ISO 27001',
  'Data Privacy', 'Risk Assessment',
  'Regulatory Reporting',

  // Performance & Optimization
  'Performance Tuning', 'Memory Optimization',
  'CPU Profiling', 'Network Optimization',
  'Lighthouse Audits', 'Core Web Vitals',

  // Collaboration & Process
  'Cross-Functional Collaboration',
  'Requirements Gathering',
  'Technical Interviews',
  'Sprint Planning',
  'Backlog Grooming',
  'Release Management',
  'Change Management',

  // Support & Operations
  'Production Support',
  'Incident Management',
  'Root Cause Analysis',
  'On-Call Rotation',
  'Service Desk Operations'
];

const jobCategory = [
  // Engineering & Technology
  'Web Development',
  'Mobile Development',
  'Backend Engineering',
  'Frontend Engineering',
  'Full Stack Development',
  'Game Development',
  'Embedded Systems',
  'Systems Engineering',
  'Platform Engineering',
  'DevOps & Infrastructure',

  // Data & AI
  'Data Engineering',
  'Machine Learning Engineering',
  'Artificial Intelligence',
  'Business Intelligence',
  'Data Analytics',
  'Big Data',
  'MLOps',
  'Applied Research',
  'Quantitative Analysis',

  // Cloud & Security
  'Cloud Computing',
  'Cloud Architecture',
  'Cybersecurity',
  'Information Security',
  'Network Engineering',
  'Site Reliability Engineering',
  'IT Operations',
  'IT Support',
  'IT Governance',

  // Product & Strategy
  'Product Management',
  'Product Strategy',
  'Program Management',
  'Project Management',
  'Technical Program Management',
  'Business Analysis',
  'Digital Transformation',
  'Innovation Management',

  // Design & Creative
  'UX Research',
  'UI Design',
  'Interaction Design',
  'Product Design',
  'Visual Design',
  'Graphic Design',
  'Motion Design',
  'Brand Design',
  'Content Design',

  // Marketing & Growth
  'Growth Marketing',
  'Performance Marketing',
  'Content Marketing',
  'Email Marketing',
  'Social Media Marketing',
  'Search Engine Optimization',
  'Search Engine Marketing',
  'Marketing Analytics',
  'Brand Management',
  'Public Relations',

  // Sales & Revenue
  'Business Development',
  'Enterprise Sales',
  'Inside Sales',
  'Sales Operations',
  'Account Management',
  'Customer Success',
  'Partnerships',
  'Revenue Operations',
  'Channel Sales',

  // Operations & Support
  'Customer Experience',
  'Customer Operations',
  'Technical Support',
  'Service Operations',
  'Field Support',
  'Incident Management',
  'Service Delivery',

  // People & Culture
  'Talent Acquisition',
  'People Operations',
  'Employee Experience',
  'Learning & Development',
  'Organizational Development',
  'Compensation & Benefits',
  'Workforce Planning',
  'Diversity & Inclusion',

  // Finance & Legal
  'Financial Planning & Analysis',
  'Accounting',
  'Payroll',
  'Treasury',
  'Risk Management',
  'Compliance',
  'Audit',
  'Taxation',
  'Legal Operations',
  'Contract Management',

  // E-commerce & Business
  'E-commerce',
  'Marketplace Operations',
  'Supply Chain',
  'Logistics',
  'Procurement',
  'Vendor Management',
  'Operations Management',

  // Education & Research
  'EdTech',
  'Corporate Training',
  'Instructional Design',
  'Academic Research',
  'Technical Writing',
  'Knowledge Management',

  // Media & Communication
  'Content Creation',
  'Copywriting',
  'Editorial',
  'Journalism',
  'Media Production',
  'Video Production',
  'Podcasting',
  'Community Management'
];
dotenv.config();
neonConfig.webSocketConstructor = ws;

const client = new Client(process.env.DIRECT_URL);
const adapter = new PrismaNeon(client);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding categories...');
  const categories = jobCategory

  for (const name of categories) {
    await prisma.jobCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('🌱 Seeding skills...');
  const sk = skills

  for (const name of sk) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });