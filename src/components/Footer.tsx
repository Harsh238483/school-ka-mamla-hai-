import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  GraduationCap,
  Award,
  Users,
  BookOpen
} from "lucide-react";
import schoolLogo from "@/assets/school-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Admissions", path: "/admissions" },
    { name: "Facilities", path: "/facilities" },
    { name: "Gallery", path: "/gallery" },
    { name: "Events", path: "/events" },
    { name: "Contact", path: "/contact" }
  ];

  const programs = [
    { name: "Undergraduate", path: "/undergraduate" },
    { name: "Graduate", path: "/graduate" },
    { name: "PhD Programs", path: "/phd-programs" },
    { name: "Online Learning", path: "/online-learning" }
  ];

  const resources = [
    { name: "Faculty", path: "/our-teachers" },
    { name: "Alumni Network", path: "/alumni-network" },
    { name: "Library", path: "/library" },
    { name: "Career Services", path: "/career-services" }
  ];

  const academicPrograms = [
    { name: "Primary Education", path: "/primary-education" },
    { name: "Secondary Education", path: "/secondary-education" },
    { name: "Higher Secondary", path: "/higher-secondary" },
    { name: "Science Stream", path: "/science-stream" },
    { name: "Commerce Stream", path: "/commerce-stream" },
    { name: "Arts Stream", path: "/arts-stream" }
  ];

  const achievements = [
    { icon: Award, text: "148+ Years of Excellence" },
    { icon: GraduationCap, text: "50,000+ Alumni Worldwide" },
    { icon: Users, text: "Expert Faculty Team" },
    { icon: BookOpen, text: "Comprehensive Curriculum" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-background via-muted/20 to-card text-foreground overflow-hidden border-t border-border transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-royal/30 to-gold/30 dark:from-royal/20 dark:to-gold/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gold/20 dark:bg-gold/10 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-royal/20 dark:bg-royal/10 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-crimson/10 dark:bg-crimson/5 blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container-wide section-padding">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-6 xl:gap-8">
            
            {/* School Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 pr-4"
            >
              <Link to="/" className="flex items-start space-x-4 mb-8 group max-w-full">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  src={schoolLogo}
                  alt="Royal Academy"
                  className="h-16 w-16 flex-shrink-0 animate-glow"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xl font-heading font-bold text-gradient-gold leading-tight">
                    Royal Academy
                  </span>
                  <span className="text-xs text-black dark:text-muted-foreground tracking-wider mt-1">
                    Excellence in Education
                  </span>
                </div>
              </Link>
              
              <p className="text-black dark:text-muted-foreground leading-relaxed mb-6">
                Nurturing minds, shaping futures. For over 148 years, Royal Academy has been 
                committed to providing world-class education and developing tomorrow's leaders.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-black dark:text-muted-foreground hover:text-gold transition-colors"
                >
                  <MapPin className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">123 Excellence Boulevard, Academic City, AC 12345</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-black dark:text-muted-foreground hover:text-gold transition-colors"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-black dark:text-muted-foreground hover:text-gold transition-colors"
                >
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">info@royalacademy.edu</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="pl-0 lg:pl-4"
            >
              <h3 className="text-xl font-heading font-bold mb-6 text-gradient-gold">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className="text-black dark:text-muted-foreground hover:text-gold transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="text-sm group-hover:font-medium"
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Programs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pl-0 lg:pl-4"
            >
              <h3 className="text-xl font-heading font-bold mb-6 text-gradient-gold">Programs</h3>
              <ul className="space-y-3">
                {programs.map((program, index) => (
                  <motion.li
                    key={program.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={program.path}
                      className="text-black dark:text-muted-foreground hover:text-gold transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="text-sm group-hover:font-medium"
                      >
                        {program.name}
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pl-0 lg:pl-4"
            >
              <h3 className="text-xl font-heading font-bold mb-6 text-gradient-gold">Resources</h3>
              <ul className="space-y-3">
                {resources.map((resource, index) => (
                  <motion.li
                    key={resource.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={resource.path}
                      className="text-black dark:text-muted-foreground hover:text-gold transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="text-sm group-hover:font-medium"
                      >
                        {resource.name}
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Academic Programs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pl-0 lg:pl-4"
            >
              <h3 className="text-xl font-heading font-bold mb-6 text-gradient-gold">Academic Levels</h3>
              <ul className="space-y-3">
                {academicPrograms.slice(0, 4).map((program, index) => (
                  <motion.li
                    key={program.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={program.path}
                      className="text-black dark:text-muted-foreground hover:text-gold transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="text-sm group-hover:font-medium"
                      >
                        {program.name}
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Achievements & Social */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pl-0 lg:pl-4"
            >
              <h3 className="text-xl font-heading font-bold mb-6 text-gradient-gold">Our Achievements</h3>
              <div className="space-y-4 mb-8">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/10 backdrop-blur-sm border border-border hover:bg-muted/20 transition-all"
                  >
                    <achievement.icon className="h-5 w-5 text-gold flex-shrink-0" />
                    <span className="text-sm text-black dark:text-muted-foreground">{achievement.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gradient-gold">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, color: "hover:text-blue-400" },
                    { icon: Twitter, color: "hover:text-sky-400" },
                    { icon: Instagram, color: "hover:text-pink-400" },
                    { icon: Linkedin, color: "hover:text-blue-500" },
                    { icon: Youtube, color: "hover:text-red-500" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.2, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-full bg-muted/10 backdrop-blur-sm border border-border text-black dark:text-muted-foreground ${social.color} transition-all duration-300 hover:bg-muted/20`}
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-border bg-muted/10 backdrop-blur-sm"
        >
          <div className="container-wide py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-black dark:text-muted-foreground text-sm">
                  © {currentYear} Royal Academy. All rights reserved.
                </p>
                <p className="text-black dark:text-muted-foreground/80 text-xs mt-1">
                  Empowering minds since 1875 • Building tomorrow's leaders today
                </p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <Link to="/privacy" className="text-black dark:text-muted-foreground hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-black dark:text-muted-foreground hover:text-gold transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-black dark:text-muted-foreground hover:text-gold transition-colors">
                  Cookie Policy
                </Link>
                <Link to="/sitemap" className="text-black dark:text-muted-foreground hover:text-gold transition-colors">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
