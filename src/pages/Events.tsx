import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Star, Trophy, Music, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button-variants";

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Science Fair",
      date: "March 15, 2024",
      time: "9:00 AM - 4:00 PM",
      location: "Main Auditorium",
      category: "Academic",
      description: "Students showcase their innovative research projects and scientific discoveries.",
      attendees: 500,
      icon: BookOpen,
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      id: 2,
      title: "Spring Concert",
      date: "March 22, 2024",
      time: "7:00 PM - 9:00 PM",
      location: "Performing Arts Center",
      category: "Arts",
      description: "Our talented students perform in the annual spring musical concert.",
      attendees: 300,
      icon: Music,
      color: "from-pink-500/20 to-purple-500/20"
    },
    {
      id: 3,
      title: "Athletic Championship",
      date: "April 5, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Athletic Complex",
      category: "Sports",
      description: "Inter-school championship featuring multiple sports competitions.",
      attendees: 800,
      icon: Trophy,
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      id: 4,
      title: "Alumni Gala Dinner",
      date: "April 20, 2024",
      time: "6:00 PM - 11:00 PM",
      location: "Grand Ballroom",
      category: "Social",
      description: "Celebrating our distinguished alumni and their achievements.",
      attendees: 400,
      icon: Star,
      color: "from-yellow-500/20 to-orange-500/20"
    }
  ];

  const pastEvents = [
    {
      title: "Winter Art Exhibition",
      date: "February 10, 2024",
      description: "Showcasing student artwork from various disciplines",
      highlights: ["50+ Art Pieces", "Student Awards", "Community Engagement"]
    },
    {
      title: "Academic Achievement Awards",
      date: "January 25, 2024",
      description: "Recognizing outstanding academic performance",
      highlights: ["Honor Roll Students", "Scholarship Recipients", "Faculty Recognition"]
    },
    {
      title: "Holiday Concert",
      date: "December 15, 2023",
      description: "Festive performances by our music department",
      highlights: ["Choir Performance", "Orchestra Concert", "Holiday Spirit"]
    }
  ];

  const eventCategories = [
    { name: "All Events", color: "bg-gold" },
    { name: "Academic", color: "bg-blue-500" },
    { name: "Sports", color: "bg-orange-500" },
    { name: "Arts", color: "bg-pink-500" },
    { name: "Social", color: "bg-yellow-500" }
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
              Events & <span className="text-gradient-gold">News</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Stay connected with the vibrant life at Royal Academy through our exciting events, achievements, and community activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {eventCategories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className={`px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${category.color}`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-6">Upcoming Events</h2>
            <p className="text-xl text-muted-foreground">Don't miss these exciting upcoming activities</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: 5 
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d overflow-hidden group cursor-pointer"
              >
                <div className={`h-48 ${event.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-6 left-6 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
                  >
                    <event.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1">
                    <span className="text-white text-sm font-medium">{event.category}</span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">{event.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-gold" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-gold" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-gold" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Users className="h-4 w-4 text-gold" />
                      <span>{event.attendees} Expected</span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button variant="gold" className="w-full">
                      Learn More
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events & News */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-6">Recent Highlights</h2>
            <p className="text-xl text-muted-foreground">Celebrating our recent achievements and events</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10 
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gold">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-heading font-semibold">{event.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gold">Highlights:</h4>
                    {event.highlights.map((highlight, idx) => (
                      <motion.div
                        key={highlight}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-gold"></div>
                        <span className="text-sm text-muted-foreground">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-gradient-to-r from-royal/10 via-crimson/5 to-royal/10 p-16 rounded-2xl border border-border cursor-pointer"
          >
            <h3 className="text-4xl font-heading font-bold mb-6">Stay Updated</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Subscribe to our newsletter to receive updates about upcoming events, academic achievements, and school news.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gold px-6 py-3 font-semibold rounded-lg"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;