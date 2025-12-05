import { Experience, Project, Skill, ResumeData } from './types';

export const RESUME_DATA: ResumeData = {
  name: "Panos Georgakopoulos",
  title: "CS Student & Aspiring Software Engineer",
  summary: "Computer Science student with strong full-stack and AI/ML skills, experienced in developing ML models, web applications, and interactive software, with hands-on hackathon and professional experience.",
  location: "Nikea, Attica, Greece",
  email: "pangegeorg@gmail.com",
  socials: {
    github: "github.com/panosgeorgakopoulos",
    linkedin: "linkedin.com/in/panagiotis-sergios-georgakopoulos/",
    twitter: "https://x.com/panosgeorgakop7"
  }
};

export const EXPERIENCES: Experience[] = [
  {
    id: "1",
    role: "Machine Learning Engineer",
    company: "Institut Français / French Hackathon",
    period: "2025",
    description:
      "Developed an ML model for predicting marine heatwaves using multi-year ocean temperature datasets. Conducted data cleaning, preprocessing, anomaly detection, and trained predictive algorithms tailored to climate patterns.",
    techStack: ["Python", "Xarray", "NumPy", "Pandas", "Machine Learning"]
  },
  {
    id: "2",
    role: "Software Developer",
    company: "Department of Informatics, University",
    period: "2024 - 2025",
    description:
      "Developed a complete Java web application (JavaBasicsWeb) using Servlets, JSP, and a MySQL backend. Implemented authentication, CRUD operations, database design, and deployed the system on Apache Tomcat.",
    techStack: ["Java", "Maven", "Tomcat", "MySQL", "HTML/CSS"]
  },
  {
    id: "3",
    role: "Secrétaire Administratif",
    company: "Institut Français de Grèce",
    period: "2025 (2 months)",
    description:
      "Handled administrative tasks, coordinated communication with students and staff, assisted in event preparation, and managed documentation workflows to support daily operations.",
    techStack: ["Administration", "Communication", "Organization"]
  }
];

export const SKILLS: Skill[] = [
  { name: "Java", level: 92, category: "Backend" },
  { name: "Python", level: 88, category: "AI/ML" },
  { name: "TensorFlow/PyTorch", level: 82, category: "AI/ML" },
  { name: "C# / WinForms", level: 80, category: "Software Development" },
  { name: "MySQL", level: 85, category: "Databases" },
  { name: "Tomcat / Servlets", level: 78, category: "Backend" },
  { name: "Docker", level: 70, category: "DevOps" },
  { name: "React", level: 65, category: "Frontend" }
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Marine Heatwave AI",
    description:
      "Machine learning model developed during the French Hackathon to detect and predict marine heatwaves using ocean temperature and depth-layer climate datasets.",
    imageUrl: "https://picsum.photos/seed/ocean/600/400",
    tags: ["Python", "ML", "Xarray", "Climate Data"],
    link: "https://github.com/panosgeorgakopoulos"
  },
  {
    id: "p2",
    title: "JavaBasicsWeb",
    description:
      "A complete Java web application built with Maven, Servlets, JSP, and Tomcat, featuring full CRUD operations and a MySQL database backend.",
    imageUrl: "https://picsum.photos/seed/code/600/400",
    tags: ["Java", "Maven", "Tomcat", "MySQL"],
    link: "https://github.com/panosgeorgakopoulos"
  },
  {
    id: "p3",
    title: "Battleship (WinForms)",
    description:
      "A classic Battleship game built in C# using Windows Forms, featuring grid-based gameplay, game logic, and a structured UI.",
    imageUrl: "https://picsum.photos/seed/game/600/400",
    tags: ["C#", "Windows Forms", "Game Dev"],
    link: "https://github.com/panosgeorgakopoulos"
  }
];