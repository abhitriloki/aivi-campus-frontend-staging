/**
 * 🎙️ AIVI Interviewer Persona & Voice Data Registry
 * Pre-configured industry interviewers with tailored behavioral traits, voices, and rubrics.
 */

export interface InterviewerPersona {
  id: "ananya" | "vikram" | "priya" | "kabir";
  name: string;
  roleTitle: string;
  styleBadge: string;
  avatarUrl: string;
  accent: string;
  voiceId: "Aoede" | "Fenrir" | "Kore" | "Puck";
  voiceGender: "Female" | "Male";
  description: string;
  questioningStyle: string;
  sampleAudioText: string;
  bestFor: string;
  tagColor: string;
}

export interface CompanyDriveTemplate {
  id: string;
  companyName: string;
  roleTitle: string;
  logo: string;
  suggestedPersona: "ananya" | "vikram" | "priya" | "kabir";
  techStack: string[];
  benchmarkScore: number;
}

export const INTERVIEWER_PERSONAS: InterviewerPersona[] = [
  {
    id: "ananya",
    name: "Ananya",
    roleTitle: "IT Services Technical Lead",
    styleBadge: "Structured & Balanced",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    accent: "Indian English (Sarvam Bulbul v3 • Kavya)",
    voiceId: "Aoede",
    voiceGender: "Female",
    description: "Evaluates core Java/OOP fundamentals, database SQL queries, and structured communication.",
    questioningStyle: "Checks fundamental depth, asks clarifying questions, and guides candidates smoothly.",
    sampleAudioText: "Hello! I'm Ananya. I'll be leading your technical interview today. Let's start with your foundational knowledge and core projects.",
    bestFor: "Accenture, TCS Digital, Infosys DSE, Wipro Turbo",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "vikram",
    name: "Vikram",
    roleTitle: "Product SDE Bar Raiser",
    styleBadge: "Rigorous & Deep Probing",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    accent: "Indian English (Sarvam Bulbul v3 • Aditya)",
    voiceId: "Fenrir",
    voiceGender: "Male",
    description: "Probes system design edge cases, concurrency, algorithmic time-complexities, and code architecture.",
    questioningStyle: "Direct, challenges shallow answers, and asks 'why this over that' trade-off questions.",
    sampleAudioText: "Hi, I'm Vikram. We'll be testing your code scalability and engineering problem-solving today. Let's jump right into your architecture.",
    bestFor: "Amazon, Flipkart, Google, High-Growth Startups",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "priya",
    name: "Priya",
    roleTitle: "HR & Cultural Fit Director",
    styleBadge: "Behavioral & STAR Method",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    accent: "Indian English (Sarvam Bulbul v3 • Priya)",
    voiceId: "Kore",
    voiceGender: "Female",
    description: "Evaluates teamwork, ethics, crisis management, leadership traits, and situational judgment.",
    questioningStyle: "Asks situational STAR questions ('Tell me about a time when...') and tests executive presence.",
    sampleAudioText: "Hello! I'm Priya. Today we'll explore your interpersonal experiences, teamwork, and how you handle tight project deadlines.",
    bestFor: "Deloitte USI, PwC, EY, Global In-House Centers",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "kabir",
    name: "Kabir",
    roleTitle: "Bilingual Tech Mentor",
    styleBadge: "Hinglish / Conversational",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    accent: "Hindi & Hinglish (Sarvam Bulbul v3 • Kabir)",
    voiceId: "Puck",
    voiceGender: "Male",
    description: "Friendly mentor mode allowing candidates to explain complex logic in natural Hinglish.",
    questioningStyle: "Conversational, reduces interview anxiety, and focuses on core conceptual logic.",
    sampleAudioText: "Namaste! Main Kabir hoon. Aaj hum bilkul comfortable tareeqe se aapka technical discussion karenge. Ready hain?",
    bestFor: "Tier-2/3 Students, Campus Freshers, Confidence Building",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

export const COMPANY_DRIVE_TEMPLATES: CompanyDriveTemplate[] = [
  {
    id: "accenture-java-sde",
    companyName: "Accenture ADC",
    roleTitle: "Associate Software Engineer (Java)",
    logo: "https://logo.clearbit.com/accenture.com",
    suggestedPersona: "ananya",
    techStack: ["Java 17", "Spring Boot", "REST APIs", "SQL", "Git"],
    benchmarkScore: 72,
  },
  {
    id: "tcs-digital-sde",
    companyName: "TCS Digital",
    roleTitle: "Systems Engineer (Full Stack)",
    logo: "https://logo.clearbit.com/tcs.com",
    suggestedPersona: "ananya",
    techStack: ["Data Structures", "OOP", "DBMS", "React", "Python"],
    benchmarkScore: 70,
  },
  {
    id: "deloitte-usi-analyst",
    companyName: "Deloitte USI",
    roleTitle: "Technology Consulting Analyst",
    logo: "https://logo.clearbit.com/deloitte.com",
    suggestedPersona: "priya",
    techStack: ["Cloud Basics", "Agile", "Business Analytics", "SQL", "STAR"],
    benchmarkScore: 75,
  },
  {
    id: "flipkart-sde-1",
    companyName: "Flipkart",
    roleTitle: "Software Development Engineer 1",
    logo: "https://logo.clearbit.com/flipkart.com",
    suggestedPersona: "vikram",
    techStack: ["DSA", "Low Level Design", "Multi-Threading", "Kafka", "MySQL"],
    benchmarkScore: 82,
  },
];
