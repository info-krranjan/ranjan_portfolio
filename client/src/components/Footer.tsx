import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

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
];

export function Footer() {
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
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-testid="footer-brand"
          >
            <h3 className="text-2xl font-bold gradient-text mb-4">Ranjan Kumar Verma</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Full Stack Developer passionate about creating seamless digital experiences.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            data-testid="footer-links"
          >
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <motion.button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-left"
                    whileHover={{ x: 5 }}
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            data-testid="footer-contact"
          >
            <h4 className="font-bold mb-4">Get In Touch</h4>
            <ul className="space-y-2 mb-4">
              <li>
                <a
                  href="mailto:info.krranjan@gmail.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  data-testid="footer-email"
                >
                  info.krranjan@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919709245792"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  data-testid="footer-phone"
                >
                  +91 9709245792
                </a>
              </li>
            </ul>

            <div className="flex gap-4" data-testid="footer-social">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:text-white transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`footer-social-${social.label.toLowerCase()}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-gray-200 dark:border-gray-700 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          data-testid="footer-copyright"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              &copy; 2024 Ranjan Kumar Verma. Built with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              using React & TailwindCSS
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Designed for excellence, built for performance
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
