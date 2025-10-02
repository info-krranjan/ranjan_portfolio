import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, Github, Linkedin, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ContactFormData } from "../lib/types";
import { apiRequest } from "@/lib/queryClient";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info.krranjan@gmail.com",
    href: "mailto:info.krranjan@gmail.com",
    color: "text-primary"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9709245792",
    href: "tel:+919709245792",
    color: "text-secondary"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Bangalore, Karnataka, India",
    href: null,
    color: "text-accent"
  },
];

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/info-krranjan",
    color: "hover:from-primary hover:to-accent"
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/info-krranjan",
    color: "hover:from-secondary hover:to-primary"
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:info.krranjan@gmail.com",
    color: "hover:from-accent hover:to-secondary"
  },
];

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", data);
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
        duration: 5000,
      });
      
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact me directly via email.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-800" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text" data-testid="contact-title">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6" />
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-testid="contact-description">
            Have a project in mind or want to collaborate? I'd love to hear from you! 
            Drop me a message and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="contact-form-container"
          >
            <Card className="glass-effect">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6" data-testid="form-title">Send Me a Message</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                  <div>
                    <Input
                      {...register("name")}
                      placeholder="Your Name"
                      className={`${errors.name ? "border-red-500" : ""}`}
                      data-testid="input-name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1" data-testid="error-name">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Your Email"
                      className={`${errors.email ? "border-red-500" : ""}`}
                      data-testid="input-email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1" data-testid="error-email">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      {...register("subject")}
                      placeholder="Subject"
                      className={`${errors.subject ? "border-red-500" : ""}`}
                      data-testid="input-subject"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1" data-testid="error-subject">
                        <AlertCircle className="w-4 h-4" />
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      {...register("message")}
                      placeholder="Tell me about your project..."
                      rows={5}
                      className={`resize-none ${errors.message ? "border-red-500" : ""}`}
                      data-testid="input-message"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1" data-testid="error-message">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-accent text-white hover:shadow-2xl disabled:opacity-50"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            data-testid="contact-info-container"
          >
            {/* Contact Information */}
            <Card className="glass-effect">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6" data-testid="contact-info-title">Contact Information</h3>
                
                <div className="space-y-6">
                  {contactInfo.map((info) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 ${info.color} flex-shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{info.label}</h4>
                          <span className="text-gray-600 dark:text-gray-400">
                            {info.value}
                          </span>
                        </div>
                      </div>
                    );

                    return info.href ? (
                      <motion.a
                        key={info.label}
                        href={info.href}
                        className="block hover:text-primary transition-colors"
                        whileHover={{ x: 5 }}
                        data-testid={`contact-${info.label.toLowerCase()}`}
                      >
                        {content}
                      </motion.a>
                    ) : (
                      <div key={info.label} data-testid={`contact-${info.label.toLowerCase()}`}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="glass-effect">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6" data-testid="social-links-title">Connect With Me</h3>
                
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gradient-to-r hover:text-white transition-all duration-300 ${social.color}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-testid={`social-${social.label.toLowerCase()}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{social.label}</span>
                      </motion.a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Availability Status */}
            <motion.div
              className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-accent/10"
              whileHover={{ scale: 1.02 }}
              data-testid="availability-status"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <p className="font-semibold">Available for freelance projects</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                I'm currently open to new opportunities and exciting projects. Let's build something amazing together!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
