import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Shield, Target, Eye, Heart, Users, Award, BookOpen, Globe } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Excellence",
      description: "Committed to the highest standards in education and character development.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Embracing cutting-edge teaching methods and technological advancement.",
    },
    {
      icon: Eye,
      title: "Vision",
      description: "Preparing students to become global leaders and responsible citizens.",
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building strong bonds within our diverse and inclusive school family.",
    },
  ];

  const achievements = [
    { icon: Users, value: "50,000+", label: "Alumni Worldwide" },
    { icon: Award, value: "200+", label: "Academic Awards" },
    { icon: BookOpen, value: "98%", label: "University Acceptance" },
    { icon: Globe, value: "45", label: "Countries Represented" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-crimson/20"></div>
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              About <span className="text-gradient-gold">Royal Academy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Established in 1875, Royal Academy has been a beacon of educational excellence for over 148 years,
              nurturing minds and shaping the future of countless students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History & Mission */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-4xl font-heading font-semibold">Our Legacy</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Founded by visionary educators, Royal Academy began as a small institution with big dreams.
                  Today, we stand as one of the nation's premier educational establishments, combining time-honored
                  traditions with innovative approaches to learning.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our commitment to excellence extends beyond academics. We believe in developing well-rounded
                  individuals who are prepared to make meaningful contributions to society.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-semibold text-gradient-royal">Our Mission</h3>
                <div className="text-lg text-muted-foreground italic bg-card/50 p-6 rounded-lg border border-border">
                  "To provide exceptional education that empowers students to achieve their highest potential,
                  fostering critical thinking, creativity, and moral leadership in a rapidly changing world."
                </div>
              </div>
            </motion.div>

            {/* Values Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="card-3d p-6 group cursor-pointer"
                >
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center"
                    >
                      <value.icon className="h-6 w-6 text-gold" />
                    </motion.div>
                    <h4 className="text-xl font-heading font-semibold">{value.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-6">Our Achievements</h2>
            <p className="text-xl text-muted-foreground">Numbers that reflect our commitment to excellence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -10,
                  rotateY: 15 
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d p-8 text-center group cursor-pointer"
              >
                <div className="flex flex-col items-center space-y-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center animate-pulse-slow"
                  >
                    <achievement.icon className="h-8 w-8 text-gold" />
                  </motion.div>
                  <div className="space-y-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 300 }}
                      className="text-4xl font-heading font-bold text-gradient-gold"
                    >
                      {achievement.value}
                    </motion.div>
                    <p className="text-muted-foreground text-lg">{achievement.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-gradient-to-r from-royal/10 via-crimson/5 to-royal/10 p-12 rounded-2xl border border-border cursor-pointer"
          >
            <h3 className="text-3xl font-heading font-semibold mb-6">Our Vision</h3>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To be the world's leading educational institution, recognized for academic excellence,
              innovative teaching, and the development of ethical leaders who will shape a better future for humanity.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;