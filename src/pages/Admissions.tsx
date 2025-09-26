import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FileText, Users, CheckCircle, Clock, DollarSign, GraduationCap, Award, ChevronRight, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

const Admissions = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    citizenship: "",
    level: "",
    term: "",
    program: "",
    essay: "",
    ref1: "",
    refEmail: ""
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'paypal' | 'stripe' | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'yearly'>('monthly');
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [counters, setCounters] = useState({ fee: 0, decision: 0, aid: 0, countries: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      // Show secondary nav when scrolling past hero
      setShowSecondaryNav(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const targets = { fee: 0, decision: 14, aid: 92, countries: 70 };
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCounters({
        fee: Math.floor(targets.fee * easeOutQuart),
        decision: Math.floor(targets.decision * easeOutQuart),
        aid: Math.floor(targets.aid * easeOutQuart),
        countries: Math.floor(targets.countries * easeOutQuart)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const admissionProcess = [
    {
      icon: FileText,
      title: "Submit Application",
      description: "Complete our comprehensive application form with all required documents.",
      timeline: "By March 1st"
    },
    {
      icon: Users,
      title: "Campus Interview",
      description: "Meet with our admissions team for a personal interview and campus tour.",
      timeline: "March - April"
    },
    {
      icon: CheckCircle,
      title: "Assessment Review",
      description: "Our committee reviews academic records, recommendations, and achievements.",
      timeline: "April - May"
    },
    {
      icon: GraduationCap,
      title: "Admission Decision",
      description: "Receive your admission decision and enrollment information.",
      timeline: "By May 15th"
    }
  ];

  const requirements = [
    { category: "Academic Records", items: ["Transcripts", "Grade Reports", "Test Scores", "Academic Portfolio"] },
    { category: "Personal Documents", items: ["Application Form", "Personal Statement", "Letters of Recommendation", "Interview"] },
    { category: "Additional", items: ["Extracurricular Activities", "Awards & Achievements", "Community Service", "Special Talents"] }
  ];

  const tuitionInfo = [
    { label: "Annual Tuition", amount: "$28,500", description: "Comprehensive academic program" },
    { label: "Room & Board", amount: "$12,800", description: "On-campus residential experience" },
    { label: "Activity Fees", amount: "$2,200", description: "Sports, clubs, and activities" },
    { label: "Total Investment", amount: "$43,500", description: "Complete Royal Academy experience" }
  ];

  const faqData = [
    { question: "Is there an application fee?", answer: "No—your application is completely free." },
    { question: "Are test scores required?", answer: "No. Scores are optional and never required for scholarship consideration." },
    { question: "Can I apply before all documents arrive?", answer: "Yes. Submit your application and we'll help collect the remaining materials." },
    { question: "What if I need accommodations?", answer: "We work with students individually—contact admissions@royalacademy.edu to get started." },
    { question: "When will I receive my admission decision?", answer: "Expect a decision within 2-3 weeks of completing your application." },
    { question: "Do you offer financial aid?", answer: "Yes, we offer both need-based aid and merit scholarships. Over 92% of students receive some form of financial assistance." }
  ];

  const deadlines = [
    { month: "Nov", day: "15", tag: "Early Action", title: "Fall Intake – Early Action", description: "Non-binding. Priority scholarship consideration.", badges: ["Merit aid", "Priority housing"] },
    { month: "Jan", day: "15", tag: "Regular", title: "Fall Intake – Regular", description: "Full consideration for admission and need-based aid.", badges: ["Need-based aid", "Rolling review"] },
    { month: "Apr", day: "01", tag: "Spring", title: "Spring Intake", description: "Limited programs. Speak with an advisor to confirm availability.", badges: [] },
    { month: "Rolling", day: "+", tag: "Transfer", title: "Transfer Applicants", description: "Evaluated as space permits. Priority given to early submissions.", badges: [] }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get current pricing
  const getCurrentAmount = () => {
    return subscriptionType === 'monthly' ? 1000 : 12000;
  };

  const getCurrentAmountInPaise = () => {
    return getCurrentAmount() * 100; // Convert to paise for Razorpay
  };

  // Payment processing functions
  const processRazorpayPayment = async () => {
    setPaymentProcessing(true);
    try {
      // Razorpay integration
      const options = {
        key: 'rzp_test_1234567890', // Replace with your Razorpay key
        amount: getCurrentAmountInPaise(), // Amount in paise
        currency: 'INR',
        name: 'Royal Academy',
        description: `${subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
        image: '/src/assets/school-logo.png',
        handler: function (response: any) {
          console.log('Razorpay Payment Success:', response);
          setPaymentSuccess(true);
          setPaymentProcessing(false);
          // Handle successful payment
          handleFormSubmission('paid', 'razorpay');
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: 'hsl(var(--gold))'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay Error:', error);
      setPaymentProcessing(false);
    }
  };

  const processPayPalPayment = async () => {
    setPaymentProcessing(true);
    try {
      // PayPal integration would go here
      // This is a simulation
      setTimeout(() => {
        console.log('PayPal Payment Success');
        setPaymentSuccess(true);
        setPaymentProcessing(false);
        handleFormSubmission('paid', 'paypal');
      }, 2000);
    } catch (error) {
      console.error('PayPal Error:', error);
      setPaymentProcessing(false);
    }
  };

  const processStripePayment = async () => {
    setPaymentProcessing(true);
    try {
      // Stripe integration would go here
      // This is a simulation
      setTimeout(() => {
        console.log('Stripe Payment Success');
        setPaymentSuccess(true);
        setPaymentProcessing(false);
        handleFormSubmission('paid', 'stripe');
      }, 2000);
    } catch (error) {
      console.error('Stripe Error:', error);
      setPaymentProcessing(false);
    }
  };

  const handlePayment = () => {
    switch (selectedPaymentMethod) {
      case 'razorpay':
        processRazorpayPayment();
        break;
      case 'paypal':
        processPayPalPayment();
        break;
      case 'stripe':
        processStripePayment();
        break;
      default:
        alert('Please select a payment method');
    }
  };

  // Save admission to localStorage
  const saveAdmission = (paymentStatus: 'paid' | 'test', paymentMethod?: 'razorpay' | 'paypal' | 'stripe' | null) => {
    try {
      const existing = localStorage.getItem('royal-academy-admissions');
      const list = existing ? JSON.parse(existing) : [];
      const record = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        paymentStatus,
        paymentMethod: paymentStatus === 'paid' ? paymentMethod ?? selectedPaymentMethod : 'test',
        subscriptionType,
        ...formData,
      };
      console.log('Saving admission record:', record);
      localStorage.setItem('royal-academy-admissions', JSON.stringify([record, ...list]));
      console.log('Admission saved to localStorage. Total records:', [record, ...list].length);
      // Show a visible confirmation
      alert(`Admission saved! Record ID: ${record.id}\nName: ${record.firstName} ${record.lastName}\nStatus: ${record.paymentStatus}`);
    } catch (err) {
      console.error('Failed to save admission:', err);
      alert('Error saving admission: ' + err);
    }
  };

  const handleFormSubmission = (
    paymentStatus: 'paid' | 'test',
    paymentMethod?: 'razorpay' | 'paypal' | 'stripe' | null
  ) => {
    saveAdmission(paymentStatus, paymentMethod);
    console.log("Application submitted:", { ...formData, paymentStatus, paymentMethod });
    alert('Application submitted successfully! You will receive a confirmation email shortly.');
    setShowModal(false);
    setCurrentStep(0);
    setPaymentSuccess(false);
    setSelectedPaymentMethod(null);
  };

  // Test submission without payment
  const handleTestSubmission = () => {
    console.log('handleTestSubmission called');
    console.log('Current formData:', formData);
    
    // Basic validation for required fields from earlier steps
    const required = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.level,
      formData.term,
      formData.program,
    ];
    
    console.log('Required fields check:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      level: formData.level,
      term: formData.term,
      program: formData.program
    });
    
    if (required.some(v => !v || !v.trim())) {
      alert('Please complete the required fields (Personal Info and Academic Details) before submitting.');
      // Navigate the user to the first incomplete step
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setCurrentStep(0);
      } else if (!formData.level || !formData.term || !formData.program) {
        setCurrentStep(1);
      }
      return;
    }
    
    console.log('Validation passed, calling handleFormSubmission');
    handleFormSubmission('test', null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePayment();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-gold to-crimson z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <Navigation />
      
      {/* Enhanced Secondary Navigation */}
      <AnimatePresence>
        {showSecondaryNav && (
          <motion.nav
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-background/98 via-royal/5 to-background/98 backdrop-blur-xl border-b border-gold/20 shadow-lg"
          >
            <div className="container-wide">
              <div className="flex items-center justify-between py-4 px-4">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  {[
                    { href: "#process", label: "Process" },
                    { href: "#requirements", label: "Requirements" },
                    { href: "#deadlines", label: "Deadlines" },
                    { href: "#tuition", label: "Tuition & Aid" },
                    { href: "#faq", label: "FAQs" }
                  ].map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-gold transition-all duration-300 rounded-lg hover:bg-gold/10 group"
                    >
                      {item.label}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-crimson opacity-0 group-hover:opacity-100 transition-opacity"
                        layoutId="activeTab"
                      />
                    </motion.a>
                  ))}
                </div>

                {/* Mobile Navigation Menu */}
                <div className="md:hidden flex items-center space-x-2 overflow-x-auto scrollbar-none">
                  {[
                    { href: "#process", label: "Process", icon: "📋" },
                    { href: "#requirements", label: "Requirements", icon: "📚" },
                    { href: "#deadlines", label: "Deadlines", icon: "📅" },
                    { href: "#tuition", label: "Tuition", icon: "💰" },
                    { href: "#faq", label: "FAQ", icon: "❓" }
                  ].map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex flex-col items-center min-w-[60px] px-2 py-2 text-xs font-medium text-muted-foreground hover:text-gold transition-all duration-300 rounded-lg hover:bg-gold/10"
                    >
                      <span className="text-lg mb-1">{item.icon}</span>
                      <span className="whitespace-nowrap">{item.label}</span>
                    </motion.a>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="gold" 
                    size="sm" 
                    onClick={() => setShowModal(true)}
                    className="shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="hidden sm:inline">Apply Now</span>
                    <span className="sm:hidden">Apply</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-crimson/20"></div>
        
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gradient-radial from-gold/20 to-transparent blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              x: [0, -8, 0],
              scale: [1, 0.95, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-gradient-radial from-crimson/20 to-transparent blur-xl"
          />
        </div>
        
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                  Admissions that put your <span className="text-gradient-gold">future first</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
                  Join a vibrant, supportive community. Our application is fast, holistic, and designed to highlight what makes you, you.
                </p>
                <div className="flex flex-wrap gap-4 mb-12">
                  <Button variant="hero" size="xl" onClick={() => setShowModal(true)}>
                    Start your application
                  </Button>
                  <Button variant="ghost" size="xl" asChild>
                    <a href="#process">Explore the process</a>
                  </Button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                id="stats-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <div className="card-3d p-4 text-center">
                  <div className="text-3xl font-heading font-bold text-gradient-gold">${counters.fee}</div>
                  <div className="text-sm text-muted-foreground font-medium">Application Fee</div>
                </div>
                <div className="card-3d p-4 text-center">
                  <div className="text-3xl font-heading font-bold text-gradient-gold">{counters.decision} days</div>
                  <div className="text-sm text-muted-foreground font-medium">Avg. Decision Time</div>
                </div>
                <div className="card-3d p-4 text-center">
                  <div className="text-3xl font-heading font-bold text-gradient-gold">{counters.aid}%</div>
                  <div className="text-sm text-muted-foreground font-medium">Students Receive Aid</div>
                </div>
                <div className="card-3d p-4 text-center">
                  <div className="text-3xl font-heading font-bold text-gradient-gold">{counters.countries}+</div>
                  <div className="text-sm text-muted-foreground font-medium">Countries Represented</div>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-card to-muted/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-crimson/10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-crimson/30 blur-sm"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section id="process" className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">How it works</div>
            <h2 className="text-4xl font-heading font-bold mb-6">Your path to admission</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">A clear, supportive process from inquiry to enrollment. Each step unlocks as you're ready.</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-crimson opacity-30 hidden lg:block" />
            
            <div className="space-y-8">
              {admissionProcess.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  {/* Step Number */}
                  <div className="lg:col-span-2 flex justify-center lg:justify-start">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gold to-crimson flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    >
                      {index + 1}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-dashed border-gold/40"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <div className="lg:col-span-10">
                    <div className="card-3d p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-heading font-bold text-gradient-gold">{step.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{step.timeline}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">Secure</span>
                        <span className="px-3 py-1 bg-crimson/10 text-crimson rounded-full text-sm font-medium">Save-as-you-go</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section id="requirements" className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">Requirements</div>
            <h2 className="text-4xl font-heading font-bold mb-6">What you'll need to apply</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We review every application in context. If anything's hard to get, let us know and we'll help you find a path forward.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {requirements.map((req, index) => (
              <motion.div
                key={req.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -10 
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d p-8"
              >
                <h3 className="text-2xl font-heading font-semibold mb-6 text-gradient-gold">{req.category}</h3>
                <div className="space-y-4">
                  {req.items.map((item, idx) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                      className="flex items-center space-x-3 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
                      </motion.div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Requirements Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-3d p-6"
            >
              <h3 className="text-xl font-heading font-semibold mb-4 text-gradient-gold">International Students</h3>
              <p className="text-muted-foreground">English proficiency (IELTS/TOEFL/Duolingo), credential evaluation, financial documentation.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-3d p-6"
            >
              <h3 className="text-xl font-heading font-semibold mb-4 text-gradient-gold">Transfer Applicants</h3>
              <p className="text-muted-foreground">College transcripts and course syllabi for credit evaluation.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-3d p-6"
            >
              <h3 className="text-xl font-heading font-semibold mb-4 text-gradient-gold">Accommodations</h3>
              <p className="text-muted-foreground">We provide reasonable accommodations—contact us to discuss your needs.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deadlines */}
      <section id="deadlines" className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">Important dates</div>
            <h2 className="text-4xl font-heading font-bold mb-6">Application deadlines</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We offer multiple rounds. Applications are reviewed on a rolling basis after each deadline.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deadlines.map((deadline, index) => (
              <motion.div
                key={deadline.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d p-8 flex items-center space-x-6"
              >
                <motion.div
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0 w-24 h-24 rounded-xl bg-gradient-to-br from-gold to-crimson text-white flex flex-col items-center justify-center shadow-lg"
                >
                  <div className="text-xs font-bold uppercase opacity-90">{deadline.month}</div>
                  <div className="text-2xl font-bold">{deadline.day}</div>
                  <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full mt-1">{deadline.tag}</div>
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-semibold mb-2 text-gradient-gold">{deadline.title}</h3>
                  <p className="text-muted-foreground mb-3">{deadline.description}</p>
                  {deadline.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {deadline.badges.map((badge, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tuition & Financial Aid */}
      <section id="tuition" className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">Affordability</div>
            <h2 className="text-4xl font-heading font-bold mb-6">Tuition and financial aid</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We work with every admitted student to build a smart, sustainable plan.</p>
          </motion.div>

          {/* Accordion-style tuition details */}
          <div className="max-w-4xl mx-auto space-y-4 mb-12">
            <motion.details
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-3d p-6 group"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-xl font-heading font-semibold">Tuition & Fees (2025)</span>
                <ChevronRight className="h-5 w-5 text-gold transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-border text-muted-foreground">
                Estimated tuition: $28,500 per year. Fees vary by program and credits. Contact us for a personalized breakdown.
              </div>
            </motion.details>

            <motion.details
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-3d p-6 group"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-xl font-heading font-semibold">Scholarships & Grants</span>
                <ChevronRight className="h-5 w-5 text-gold transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-border text-muted-foreground">
                Automatic merit scholarships are awarded at the time of admission. Need-based grants available via aid application.
              </div>
            </motion.details>

            <motion.details
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-3d p-6 group"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-xl font-heading font-semibold">Payment Plans</span>
                <ChevronRight className="h-5 w-5 text-gold transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-border text-muted-foreground">
                Monthly, interest-free plans available. Third-party sponsorships supported.
              </div>
            </motion.details>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card-3d p-8 bg-gradient-to-r from-gold/5 via-transparent to-crimson/5 border-dashed"
          >
            <div className="text-center">
              <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">See the campus</div>
              <h3 className="text-3xl font-heading font-bold mb-4">Tour, info sessions, and counselor chats</h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't visit? Join a virtual info session or book a 1:1 with our admissions team.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="ghost" size="lg">Contact Admissions</Button>
                <Button variant="gold" size="lg" onClick={() => setShowModal(true)}>Apply Now</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm font-bold text-gold uppercase tracking-wider mb-4">FAQs</div>
            <h2 className="text-4xl font-heading font-bold mb-6">Answers to common questions</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-3d overflow-hidden"
              >
                <motion.button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/5 transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-lg font-heading font-semibold pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="h-5 w-5 text-gold flex-shrink-0" />
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="card-3d p-8"
            >
              <h3 className="text-2xl font-heading font-semibold mb-6 text-gradient-gold">Contact Admissions</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>Email: admissions@royalacademy.edu</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Hours: Mon–Fri, 9am–5pm</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-3d p-8"
            >
              <h3 className="text-2xl font-heading font-semibold mb-6 text-gradient-gold">Mailing Address</h3>
              <div className="text-muted-foreground">
                <p>Royal Academy</p>
                <p>123 Excellence Boulevard</p>
                <p>Academic City, AC 12345</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-gold/5 to-crimson/5">
                <div>
                  <h2 className="text-2xl font-heading font-bold">Start your application</h2>
                  <p className="text-sm text-muted-foreground">3 quick steps. You can save and finish later.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-gold to-crimson h-2 rounded-full"
                    initial={{ width: "25%" }}
                    animate={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span className={currentStep >= 0 ? "text-gold" : ""}>Personal Info</span>
                  <span className={currentStep >= 1 ? "text-gold" : ""}>Academic Details</span>
                  <span className={currentStep >= 2 ? "text-gold" : ""}>Additional Info</span>
                  <span className={currentStep >= 3 ? "text-gold" : ""}>Payment</span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 modal-scroll" style={{ maxHeight: 'calc(95vh - 200px)', minHeight: '400px' }}>
                <div className="p-6">
                  <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="citizenship">Citizenship</Label>
                            <select
                              id="citizenship"
                              name="citizenship"
                              value={formData.citizenship}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-border rounded-lg bg-background"
                            >
                              <option value="">Select...</option>
                              <option value="domestic">Domestic</option>
                              <option value="international">International</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 1 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="level">Entry Level *</Label>
                            <select
                              id="level"
                              name="level"
                              value={formData.level}
                              onChange={handleInputChange}
                              required
                              className="w-full p-3 border border-border rounded-lg bg-background"
                            >
                              <option value="">Select...</option>
                              <option value="undergraduate">Undergraduate</option>
                              <option value="graduate">Graduate</option>
                              <option value="transfer">Transfer</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="term">Intended Term *</Label>
                            <select
                              id="term"
                              name="term"
                              value={formData.term}
                              onChange={handleInputChange}
                              required
                              className="w-full p-3 border border-border rounded-lg bg-background"
                            >
                              <option value="">Select...</option>
                              <option value="fall2025">Fall 2025</option>
                              <option value="spring2026">Spring 2026</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="program">Intended Program/Major *</Label>
                          <Input
                            id="program"
                            name="program"
                            placeholder="e.g., Computer Science, Business Administration"
                            value={formData.program}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="essay">Short Statement</Label>
                          <Textarea
                            id="essay"
                            name="essay"
                            placeholder="Tell us what excites you about studying here..."
                            value={formData.essay}
                            onChange={handleInputChange}
                            rows={4}
                          />
                          <p className="text-sm text-muted-foreground">Optional</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="ref1">Recommender Name</Label>
                            <Input
                              id="ref1"
                              name="ref1"
                              value={formData.ref1}
                              onChange={handleInputChange}
                            />
                            <p className="text-sm text-muted-foreground">Optional</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="refEmail">Recommender Email</Label>
                            <Input
                              id="refEmail"
                              name="refEmail"
                              type="email"
                              value={formData.refEmail}
                              onChange={handleInputChange}
                            />
                            <p className="text-sm text-muted-foreground">Optional</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-heading font-bold mb-2 text-gradient-gold">Subscription Payment</h3>
                          <p className="text-muted-foreground">Choose your subscription plan and complete payment</p>
                        </div>

                        {paymentSuccess ? (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center p-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl"
                          >
                            <div className="text-6xl mb-4">✅</div>
                            <h4 className="text-xl font-bold text-green-400 mb-2">Payment Successful!</h4>
                            <p className="text-muted-foreground">Your {subscriptionType} subscription has been activated successfully.</p>
                          </motion.div>
                        ) : (
                          <div className="space-y-6">
                            {/* Subscription Type Selection */}
                            <div className="space-y-3">
                              <h4 className="font-semibold mb-3">Choose Subscription Plan:</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Monthly Plan */}
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setSubscriptionType('monthly')}
                                  className={`p-6 border-2 rounded-xl transition-all duration-300 text-left ${
                                    subscriptionType === 'monthly' 
                                      ? 'border-gold bg-gold/10' 
                                      : 'border-border hover:border-gold/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="text-lg font-bold">Monthly Plan</div>
                                    <div className={`w-4 h-4 rounded-full border-2 ${
                                      subscriptionType === 'monthly' ? 'border-gold bg-gold' : 'border-muted-foreground'
                                    }`} />
                                  </div>
                                  <div className="text-3xl font-bold text-gradient-gold mb-2">₹1,000</div>
                                  <div className="text-sm text-muted-foreground">Per month • Flexible billing</div>
                                  <div className="mt-3 text-xs text-muted-foreground">
                                    • Cancel anytime
                                    • Monthly billing cycle
                                    • Full access to all features
                                  </div>
                                </motion.button>

                                {/* Yearly Plan */}
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setSubscriptionType('yearly')}
                                  className={`p-6 border-2 rounded-xl transition-all duration-300 text-left relative ${
                                    subscriptionType === 'yearly' 
                                      ? 'border-gold bg-gold/10' 
                                      : 'border-border hover:border-gold/50'
                                  }`}
                                >
                                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gold to-crimson text-white text-xs font-bold px-3 py-1 rounded-full">
                                    SAVE 17%
                                  </div>
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="text-lg font-bold">Yearly Plan</div>
                                    <div className={`w-4 h-4 rounded-full border-2 ${
                                      subscriptionType === 'yearly' ? 'border-gold bg-gold' : 'border-muted-foreground'
                                    }`} />
                                  </div>
                                  <div className="text-3xl font-bold text-gradient-gold mb-2">₹12,000</div>
                                  <div className="text-sm text-muted-foreground">Per year • Best value</div>
                                  <div className="mt-3 text-xs text-muted-foreground">
                                    • Save ₹2,000 annually
                                    • Yearly billing cycle
                                    • Priority support
                                  </div>
                                </motion.button>
                              </div>
                            </div>

                            {/* Current Selection Display */}
                            <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
                              <div className="text-3xl font-bold text-gradient-gold mb-2">₹{getCurrentAmount().toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">
                                {subscriptionType === 'monthly' ? 'Monthly subscription fee' : 'Yearly subscription fee'}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-semibold mb-3">Choose Payment Method:</h4>
                              
                              {/* Razorpay Option */}
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedPaymentMethod('razorpay')}
                                className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                                  selectedPaymentMethod === 'razorpay' 
                                    ? 'border-gold bg-gold/10' 
                                    : 'border-border hover:border-gold/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center border border-border overflow-hidden">
                                      <svg viewBox="0 0 100 40" className="w-full h-full">
                                        <rect width="100" height="40" fill="#3395FF"/>
                                        <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Razorpay</text>
                                      </svg>
                                    </div>
                                    <div className="text-left">
                                      <div className="font-semibold">Razorpay</div>
                                      <div className="text-sm text-muted-foreground">UPI, Cards, Net Banking</div>
                                    </div>
                                  </div>
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    selectedPaymentMethod === 'razorpay' ? 'border-gold bg-gold' : 'border-muted-foreground'
                                  }`} />
                                </div>
                              </motion.button>

                              {/* PayPal Option */}
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedPaymentMethod('paypal')}
                                className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                                  selectedPaymentMethod === 'paypal' 
                                    ? 'border-gold bg-gold/10' 
                                    : 'border-border hover:border-gold/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center border border-border overflow-hidden">
                                      <svg viewBox="0 0 100 40" className="w-full h-full">
                                        <rect width="100" height="40" fill="#0070BA"/>
                                        <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">PayPal</text>
                                      </svg>
                                    </div>
                                    <div className="text-left">
                                      <div className="font-semibold">PayPal</div>
                                      <div className="text-sm text-muted-foreground">International payments</div>
                                    </div>
                                  </div>
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    selectedPaymentMethod === 'paypal' ? 'border-gold bg-gold' : 'border-muted-foreground'
                                  }`} />
                                </div>
                              </motion.button>

                              {/* Stripe Option */}
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedPaymentMethod('stripe')}
                                className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${
                                  selectedPaymentMethod === 'stripe' 
                                    ? 'border-gold bg-gold/10' 
                                    : 'border-border hover:border-gold/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center border border-border overflow-hidden">
                                      <svg viewBox="0 0 100 40" className="w-full h-full">
                                        <rect width="100" height="40" fill="#635BFF"/>
                                        <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Stripe</text>
                                      </svg>
                                    </div>
                                    <div className="text-left">
                                      <div className="font-semibold">Stripe</div>
                                      <div className="text-sm text-muted-foreground">Credit/Debit Cards</div>
                                    </div>
                                  </div>
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    selectedPaymentMethod === 'stripe' ? 'border-gold bg-gold' : 'border-muted-foreground'
                                  }`} />
                                </div>
                              </motion.button>
                            </div>

                            <div className="text-xs text-muted-foreground text-center mt-4 p-3 bg-muted/10 rounded-lg">
                              🔒 Your payment information is secure and encrypted. We do not store your payment details.
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Modal Footer */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0 || paymentProcessing}
                      className={currentStep === 0 ? "invisible" : ""}
                    >
                      Back
                    </Button>
                    
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        variant="gold"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Next
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleTestSubmission}
                          disabled={paymentProcessing || paymentSuccess}
                        >
                          Submit without Payment (Test)
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            console.log('Force test save clicked');
                            const testData = {
                              firstName: 'Test',
                              lastName: 'User',
                              email: 'test@example.com',
                              phone: '1234567890',
                              citizenship: 'domestic',
                              level: 'undergraduate',
                              term: 'fall2025',
                              program: 'Computer Science',
                              essay: 'Test essay',
                              ref1: '',
                              refEmail: ''
                            };
                            setFormData(testData);
                            setTimeout(() => {
                              saveAdmission('test', null);
                            }, 100);
                          }}
                          className="text-xs"
                        >
                          Force Test Save
                        </Button>
                        <Button 
                          type="submit" 
                          variant="gold"
                          disabled={!selectedPaymentMethod || paymentProcessing || paymentSuccess}
                          className="min-w-[120px]"
                        >
                          {paymentProcessing ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : paymentSuccess ? (
                            'Complete'
                          ) : (
                            'Pay & Submit'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default Admissions;