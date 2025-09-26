import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: [
        "Personal information such as name, email address, phone number, and mailing address when you contact us or apply for admission.",
        "Academic records and educational history for enrolled students.",
        "Payment information for tuition and fees (processed securely through third-party providers).",
        "Website usage data including IP addresses, browser information, and pages visited."
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To process applications and provide educational services.",
        "To communicate with students, parents, and prospective families.",
        "To improve our website and educational programs.",
        "To comply with legal and regulatory requirements.",
        "To send important updates about school activities and events."
      ]
    },
    {
      icon: Lock,
      title: "Information Security",
      content: [
        "We implement industry-standard security measures to protect your personal information.",
        "All sensitive data is encrypted during transmission and storage.",
        "Access to personal information is restricted to authorized personnel only.",
        "We regularly update our security protocols and conduct security audits."
      ]
    },
    {
      icon: Database,
      title: "Data Retention",
      content: [
        "Student records are maintained according to educational regulations and accreditation requirements.",
        "Marketing and communication data is retained for 3 years unless you opt out.",
        "Website analytics data is retained for 2 years.",
        "You may request deletion of your personal data subject to legal requirements."
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Right to access your personal information we hold.",
        "Right to correct inaccurate or incomplete information.",
        "Right to request deletion of your personal data.",
        "Right to opt out of marketing communications.",
        "Right to file a complaint with relevant data protection authorities."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient-gold">Privacy Policy</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-wide section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Introduction */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-royal to-gold mb-6"
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-4xl font-heading font-bold mb-4 text-gradient-gold">
              Your Privacy Matters
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              At Royal Academy, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 bg-gradient-to-r from-royal/10 to-gold/10 border border-border rounded-lg p-8 text-center"
          >
            <Mail className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold mb-4 text-gradient-gold">
              Questions About Privacy?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or how we handle your personal information, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a href="mailto:privacy@royalacademy.edu" className="text-gold hover:text-gold/80 transition-colors">
                privacy@royalacademy.edu
              </a>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <a href="tel:+15551234567" className="text-gold hover:text-gold/80 transition-colors">
                +1 (555) 123-4567
              </a>
            </div>
          </motion.div>

          {/* Back to Top */}
          <div className="text-center mt-12">
            <Link to="/">
              <Button className="bg-gradient-to-r from-royal to-gold hover:from-royal/80 hover:to-gold/80 text-white">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
