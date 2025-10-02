import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Download, GraduationCap, Briefcase, Code, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const resumeData = {
  education: [
    {
      degree: "Master of Computer Application (MCA)",
      institution: "Dayananda Sagar College of Arts, Science and Commerce",
      period: "Pursuing",
      description: "Currently pursuing advanced studies in computer applications with focus on modern software development."
    },
    {
      degree: "Bachelor of Computer Application (BCA)",
      institution: "Sai Nath University",
      period: "2021-2024 | 84.72%",
      description: "Graduated with distinction, building a strong foundation in computer science and programming."
    }
  ],
  experience: [
    {
      title: "Full Stack Developer Intern",
      company: "Techstern Solutions",
      period: "Jan 2024 - Apr 2024",
      description: "Developed a comprehensive College Management System using MERN stack, implementing features for student records, course management, attendance tracking, and report generation."
    }
  ],
  skills: [
    "MongoDB", "Express.js", "React.js", "Node.js", "JavaScript", "HTML/CSS",
    "Tailwind CSS", "Git/GitHub", "MySQL", "REST APIs", "C++", "Java"
  ],
  projects: [
    {
      name: "Wanderlust",
      description: "Full Stack Hotel Booking Platform with user authentication and reviews"
    },
    {
      name: "College Management System",
      description: "Academic Institution Management Platform with comprehensive features"
    }
  ]
};

function ResumeCard({ 
  icon: Icon, 
  title, 
  items, 
  color,
  delay = 0 
}: { 
  icon: any; 
  title: string; 
  items: any[]; 
  color: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      data-testid={`resume-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="space-y-2">
                {item.degree || item.title ? (
                  <>
                    <p className="font-semibold">
                      {item.degree || item.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.institution || item.company} • {item.period}
                    </p>
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </>
                ) : item.name ? (
                  <>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </>
                ) : (
                  <Badge variant="secondary" className="mr-2 mb-2">
                    {item}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Resume() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleDownloadResume = async () => {
    try {
      const response = await fetch("/api/resume/download");
      const data = await response.json();
      
      if (data.downloadUrl) {
        // In production, this would trigger actual PDF download
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = 'Ranjan_Kumar_Verma_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback for demo - you would replace this with actual PDF handling
        alert('Resume download functionality will be implemented with the actual PDF file.');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Error downloading resume. Please try again later.');
    }
  };

  return (
    <section id="resume" className="py-20 bg-gray-50 dark:bg-gray-900" data-testid="resume-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text" data-testid="resume-title">
            Resume / CV
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6" />
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-testid="resume-description">
            Download my complete resume or view the highlights below
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Resume Download Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
            data-testid="resume-download-card"
          >
            <Card className="glass-effect">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" data-testid="resume-filename">
                        Ranjan_Resume.pdf
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last updated: January 2024
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleDownloadResume}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-2xl"
                    data-testid="button-download-resume"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resume Highlights */}
          <div className="grid md:grid-cols-2 gap-6" data-testid="resume-highlights">
            <ResumeCard
              icon={GraduationCap}
              title="Education"
              items={resumeData.education}
              color="bg-primary/10 text-primary"
              delay={0.3}
            />

            <ResumeCard
              icon={Briefcase}
              title="Experience"
              items={resumeData.experience}
              color="bg-secondary/10 text-secondary"
              delay={0.4}
            />

            <ResumeCard
              icon={Code}
              title="Technical Skills"
              items={resumeData.skills}
              color="bg-accent/10 text-accent"
              delay={0.5}
            />

            <ResumeCard
              icon={Folder}
              title="Key Projects"
              items={resumeData.projects}
              color="bg-primary/10 text-primary"
              delay={0.6}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
