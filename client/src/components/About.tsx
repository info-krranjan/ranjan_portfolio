import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SkillItem, ExperienceItem } from "../lib/types";

const skills: SkillItem[] = [
  { name: "JavaScript / React.js", percentage: 90, color: "from-primary to-accent" },
  { name: "Node.js / Express.js", percentage: 85, color: "from-secondary to-primary" },
  { name: "MongoDB / MySQL", percentage: 80, color: "from-accent to-secondary" },
  { name: "HTML / CSS / Tailwind", percentage: 95, color: "from-primary to-accent" },
  { name: "Git / GitHub", percentage: 88, color: "from-secondary to-accent" },
  { name: "C++ / Java", percentage: 75, color: "from-accent to-primary" },
];

const experiences: ExperienceItem[] = [
  {
    title: "Master of Computer Application (MCA)",
    company: "Dayananda Sagar College of Arts, Science and Commerce",
    period: "Pursuing (2024 - Present)",
    description: "Currently pursuing advanced studies in computer applications with focus on modern software development.",
    type: "education",
    color: "border-primary"
  },
  {
    title: "Full Stack Developer Intern",
    company: "Techstern Solutions",
    period: "Jan 2024 - Apr 2024",
    description: "Developed a comprehensive College Management System using MERN stack, implementing features for student records, course management, attendance tracking, and report generation.",
    type: "experience",
    color: "border-secondary"
  },
  {
    title: "Bachelor of Computer Application (BCA)",
    company: "Sai Nath University",
    period: "2021 - 2024 | 84.72%",
    description: "Graduated with distinction, building a strong foundation in computer science and programming.",
    type: "education",
    color: "border-accent"
  },
];

const techStack = [
  "React.js", "Node.js", "MongoDB", "Express.js", "JavaScript", "REST APIs",
  "HTML/CSS", "Tailwind CSS", "Git/GitHub", "MySQL", "C++", "Java"
];

function SkillBar({ skill, index }: { skill: SkillItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      data-testid={`skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
    >
      <div className="flex justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <span className={`font-semibold text-primary`}>{skill.percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.percentage}%` } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
        />
      </div>
    </motion.div>
  );
}

function TimelineItem({ experience, index }: { experience: ExperienceItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-center ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      data-testid={`timeline-item-${index}`}
    >
      <div className={`w-full md:w-5/12 ${isLeft ? '' : 'md:ml-auto'}`}>
        <motion.div
          className={`bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border-l-4 ${experience.color} card-hover`}
          whileHover={{ y: -5 }}
        >
          <span className={`text-sm font-semibold ${experience.type === 'education' ? 'text-primary' : 'text-secondary'}`}>
            {experience.period}
          </span>
          <h4 className="text-xl font-bold mt-2">{experience.title}</h4>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{experience.company}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            {experience.description}
          </p>
        </motion.div>
      </div>
      
      {/* Timeline dot */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 ${experience.type === 'education' ? 'bg-primary' : 'bg-secondary'} rounded-full border-4 border-white dark:border-gray-800 hidden md:block`} />
    </motion.div>
  );
}

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text" data-testid="about-title">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* About Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="about-content"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I'm a passionate Full Stack Developer currently pursuing my Master of Computer Application (MCA) at 
              Dayananda Sagar College. With a strong foundation in the MERN stack, I specialize in building 
              dynamic, scalable web applications that solve real-world problems.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              My journey in tech began with a Bachelor's degree in Computer Application from Sai Nath University, 
              where I graduated with 84.72%. Since then, I've worked on diverse projects ranging from hotel 
              booking platforms to college management systems, always focusing on creating intuitive user 
              experiences and robust backend architectures.
            </p>

            <div className="flex flex-wrap gap-3 pt-4" data-testid="tech-stack">
              {techStack.map((tech, index) => (
                <motion.span
                  key={tech}
                  className="px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  data-testid={`tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Skills Chart */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            data-testid="skills-chart"
          >
            <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Experience Timeline */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          data-testid="experience-timeline"
        >
          <h3 className="text-3xl font-bold text-center mb-12">Experience & Education</h3>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-accent to-secondary hidden md:block" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <TimelineItem key={index} experience={experience} index={index} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
