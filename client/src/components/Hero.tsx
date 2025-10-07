import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, ChevronDown } from "lucide-react";

const socialLinks = [
  { 
    icon: Github, 
    href: "https://github.com/info-krranjan", 
    label: "GitHub",
    color: "hover:bg-primary"
  },
  { 
    icon: Linkedin, 
    href: "https://linkedin.com/in/info-krranjan", 
    label: "LinkedIn",
    color: "hover:bg-secondary"
  },
  { 
    icon: Mail, 
    href: "mailto:info.krranjan@gmail.com", 
    label: "Email",
    color: "hover:bg-accent"
  },
  { 
    icon: Phone, 
    href: "tel:+919709245792", 
    label: "Phone",
    color: "hover:bg-primary"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function Hero() {
  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" data-testid="hero-section">
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-4 mt-4"
            data-testid="hero-greeting"
          >
            Hi, I'm
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 gradient-text"
            data-testid="hero-name"
          >
            {/* ............. */}
            {/* Profile Picture */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <img
              src="/ranjan1.jpg" // Place your image in the public folder as 'profile.jpg'
              alt="Ranjan Kumar Verma"
              className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg"
              data-testid="hero-profile-pic"
            />
          </motion.div>
            {/* .............. */}
            Ranjan Kumar Verma
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-8"
            data-testid="hero-title"
          >
            Full Stack Developer | MERN Stack Specialist
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
            data-testid="hero-description"
          >
            Crafting seamless digital experiences with MongoDB, Express.js, React.js, and Node.js. 
            Passionate about building scalable web applications that make a difference.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
            data-testid="hero-buttons"
          >
            <motion.button
              onClick={() => scrollToSection("#projects")}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-view-work"
            >
              View My Work
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("#contact")}
              className="px-8 py-4 bg-transparent border-2 border-primary text-primary dark:text-white font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-contact"
            >
              Get In Touch
            </motion.button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-6 mb-12"
            data-testid="hero-social-links"
          >
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:text-white transition-all duration-300 ${social.color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`link-${social.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          data-testid="scroll-indicator"
        >
          <motion.button
            onClick={() => scrollToSection("#about")}
            className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            whileHover={{ scale: 1.1 }}
            data-testid="button-scroll-down"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
