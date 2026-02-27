export interface PersonalData {
  photo: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  CurrentCity: string;
  phone: string;
  about: string;

  experienceLevel: "fresher" | "experienced";
  experienceYears?: number;
  experienceMonths?: number;
}

export interface Experience {
  title: string;
  CurrentCity: string;
  from: string;
  to: string;
  current: boolean;
  summary: string;
  company: string;
  subtext: string;
}

export interface Education {
  school: string;
  degree: string;
  from: string;
  to: string;
  current: boolean;
  summary: string;
}

export interface Project {
  title: string;
  link: string;
  from: string;
  to: string;
  current: boolean;
  summary: string;
}

export interface ResumeData {
  personal: any;
  experience: Experience[];

  education: Education[];
  projects: Project[];
  
skills: {
  technical: string[];
  soft: string[];
  languages: string[];
  interests: string[];

  showTechnical: boolean;
  showSoft: boolean;
  showLanguages: boolean;
  showInterests: boolean;
};

  social: {
    linkedin: string;
    twitter: string;
    github: string;
    website: string;
    show: boolean;
  };
  
}
