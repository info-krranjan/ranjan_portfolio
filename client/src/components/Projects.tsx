import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink, Folder, Star, GitFork } from "lucide-react";
// import { useGitHubProjects } from "../hooks/useGitHubProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const featuredProjects = [
  {
    name: "Wanderlust",
    description: "A full-stack hotel booking platform with user authentication, reviews & ratings, category filtering, and responsive design. Built with MERN stack.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    technologies: ["React", "Node.js", "MongoDB", "Express.js"],
    githubUrl: "https://github.com/info-krranjan",
    liveUrl: "#",
    type: "featured"
  },
  {
    name: "College Management System",
    description: "Comprehensive platform for managing student records, courses, attendance, and report generation. Developed during internship at Techstern Solutions.",
    image: "/cms.png",
    technologies: ["React", "Node.js", "MongoDB", "REST API"],
    githubUrl: "https://github.com/info-krranjan",
    liveUrl: "#",
    type: "featured"
  }
];

function ProjectSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-18" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project, index, type = "github" }: { 
  project: any; 
  index: number; 
  type?: "featured" | "github";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const getTechColor = (tech: string) => {
    const colorMap: { [key: string]: string } = {
      "React": "bg-primary/10 text-primary",
      "Node.js": "bg-secondary/10 text-secondary", 
      "MongoDB": "bg-accent/10 text-accent",
      "Express.js": "bg-primary/10 text-primary",
      "JavaScript": "bg-secondary/10 text-secondary",
      "TypeScript": "bg-accent/10 text-accent",
      "HTML": "bg-primary/10 text-primary",
      "CSS": "bg-secondary/10 text-secondary",
    };
    return colorMap[tech] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      data-testid={`project-card-${project.name || project.githubId}`}
    >
      <Card className="group overflow-hidden shadow-xl card-hover bg-white dark:bg-gray-800">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {type === "github" && (
            <div className="absolute top-4 right-4 flex gap-2">
              {project.stargazersCount && parseInt(project.stargazersCount) > 0 && (
                <Badge variant="secondary" className="bg-black/20 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  {project.stargazersCount}
                </Badge>
              )}
              {project.forksCount && parseInt(project.forksCount) > 0 && (
                <Badge variant="secondary" className="bg-black/20 text-white">
                  <GitFork className="w-3 h-3 mr-1" />
                  {project.forksCount}
                </Badge>
              )}
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Folder className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold" data-testid={`project-title-${project.name}`}>
              {project.name}
            </h3>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4" data-testid={`project-description-${project.name}`}>
            {project.description || "No description available"}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4" data-testid={`project-tech-${project.name}`}>
            {type === "featured" ? (
              project.technologies?.map((tech: string) => (
                <Badge key={tech} className={getTechColor(tech)}>
                  {tech}
                </Badge>
              ))
            ) : (
              <>
                {project.language && (
                  <Badge className={getTechColor(project.language)}>
                    {project.language}
                  </Badge>
                )}
                {project.topics?.slice(0, 3).map((topic: string) => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:text-primary"
              data-testid={`button-github-${project.name}`}
            >
              <a 
                href={project.githubUrl || project.htmlUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-2" />
                Code
              </a>
            </Button>
            
            {project.liveUrl && project.liveUrl !== "#" && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:text-secondary"
                data-testid={`button-live-${project.name}`}
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  // const { data: githubProjects, isLoading, error } = useGitHubProjects();

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900" data-testid="projects-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text" data-testid="projects-title">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6" />
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-testid="projects-description">
            Explore my latest work and personal projects. Each project showcases different technologies and solutions.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" data-testid="featured-projects">
          {featuredProjects.map((project, index) => (
            <ProjectCard 
              key={project.name} 
              project={project} 
              index={index} 
              type="featured"
            />
          ))}
        </div>

        {/* GitHub Projects */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-center mb-8" data-testid="github-projects-title">
            Latest from GitHub
          </h3>

          {error && (
            <div className="text-center py-8" data-testid="projects-error">
              <p className="text-red-500 dark:text-red-400 mb-4">
                Failed to load GitHub projects: {error.message}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Please check your internet connection or try again later.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="projects-loading">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProjectSkeleton key={index} />
              ))}
            </div>
          )}

          {githubProjects && githubProjects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="github-projects">
              {githubProjects.slice(0, 6).map((project, index) => (
                <ProjectCard 
                  key={project.githubId} 
                  project={project} 
                  index={index + featuredProjects.length}
                  type="github"
                />
              ))}
            </div>
          )}

          {githubProjects && githubProjects.length === 0 && !isLoading && !error && (
            <div className="text-center py-8" data-testid="no-projects">
              <p className="text-gray-600 dark:text-gray-400">
                No GitHub projects found. Check back later for updates.
              </p>
            </div>
          )}
        </motion.div> */}

        {/* View More Projects Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          data-testid="view-all-projects"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-2xl"
          >
            <a 
              href="https://github.com/info-krranjan" 
              target="_blank" 
              rel="noopener noreferrer"
              data-testid="button-view-all-github"
            >
              <Github className="w-5 h-5 mr-2" />
              View All Projects on GitHub
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
