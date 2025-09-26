import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  Eye,
  EyeOff,
  Edit,
  Users,
  Award,
  Target,
  Heart,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AboutPageData {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  
  // History Section
  historyTitle: string;
  historyContent: string;
  foundedYear: string;
  
  // Mission & Vision
  missionTitle: string;
  missionContent: string;
  visionTitle: string;
  visionContent: string;
  
  // Core Values
  values: {
    excellence: { title: string; description: string };
    innovation: { title: string; description: string };
    integrity: { title: string; description: string };
    community: { title: string; description: string };
  };
  
  // Leadership Section
  leadershipTitle: string;
  leadershipDescription: string;
  
  // Statistics
  stats: {
    students: { number: string; label: string };
    faculty: { number: string; label: string };
    programs: { number: string; label: string };
    years: { number: string; label: string };
  };
  
  // Achievements
  achievements: string[];
  
  // Contact Info
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

const AboutPageManager = () => {
  const [aboutData, setAboutData] = useState<AboutPageData>({
    heroTitle: "About Royal Academy",
    heroSubtitle: "Excellence in Education Since 1875",
    heroDescription: "Royal Academy has been a beacon of educational excellence for over 148 years, nurturing minds and shaping the future of countless students through innovative teaching and character development.",
    
    historyTitle: "Our Rich History",
    historyContent: "Founded in 1875 by visionary educators, Royal Academy began as a small institution with big dreams. Over nearly 150 years, we have grown into one of the nation's premier educational establishments, combining time-honored traditions with innovative approaches to learning.\n\nOur journey has been marked by continuous growth, adaptation, and unwavering commitment to educational excellence. From our humble beginnings with just 50 students, we now serve over 2,500 students across multiple programs and disciplines.",
    foundedYear: "1875",
    
    missionTitle: "Our Mission",
    missionContent: "To provide exceptional education that empowers students to achieve their highest potential, fostering critical thinking, creativity, and moral leadership in a rapidly changing world. We are committed to developing well-rounded individuals who will make meaningful contributions to society.",
    
    visionTitle: "Our Vision", 
    visionContent: "To be the world's leading educational institution, recognized for academic excellence, innovative teaching, and the development of ethical leaders who will shape a better future for humanity.",
    
    values: {
      excellence: {
        title: "Excellence",
        description: "We strive for the highest standards in everything we do, from academic achievement to character development."
      },
      innovation: {
        title: "Innovation", 
        description: "We embrace new ideas, technologies, and teaching methods to enhance the learning experience."
      },
      integrity: {
        title: "Integrity",
        description: "We uphold the highest ethical standards and promote honesty, respect, and responsibility."
      },
      community: {
        title: "Community",
        description: "We foster a supportive, inclusive environment where everyone can thrive and contribute."
      }
    },
    
    leadershipTitle: "Leadership & Governance",
    leadershipDescription: "Our institution is guided by experienced educators and administrators who bring decades of expertise in academic leadership, student development, and educational innovation.",
    
    stats: {
      students: { number: "2,500+", label: "Students" },
      faculty: { number: "180+", label: "Faculty Members" },
      programs: { number: "45+", label: "Academic Programs" },
      years: { number: "148+", label: "Years of Excellence" }
    },
    
    achievements: [
      "Ranked #1 Private School in the Region for 5 consecutive years",
      "98% Graduate Employment Rate within 6 months",
      "Over 50 National Academic Awards in the last decade",
      "Alumni network spanning 75+ countries worldwide",
      "State-of-the-art facilities and technology integration",
      "Comprehensive scholarship programs serving 40% of students"
    ],
    
    contactInfo: {
      address: "123 Education Boulevard, Academic City, AC 12345",
      phone: "+1 (555) 123-4567",
      email: "info@royalacademy.edu",
      website: "www.royalacademy.edu"
    }
  });

  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('royal-academy-about');
    if (savedData) {
      setAboutData(JSON.parse(savedData));
    }
  }, []);

  const saveData = () => {
    localStorage.setItem('royal-academy-about', JSON.stringify(aboutData));
    setMessage("About page updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const updateField = (path: string, value: any) => {
    setAboutData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addAchievement = () => {
    const newAchievement = prompt("Enter new achievement:");
    if (newAchievement && newAchievement.trim()) {
      setAboutData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
    }
  };

  const removeAchievement = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">About Page Manager</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Customize your school's about page content and information</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={saveData} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Hero Section
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Page Title</label>
                <Input
                  value={aboutData.heroTitle}
                  onChange={(e) => updateField('heroTitle', e.target.value)}
                  placeholder="About Royal Academy"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subtitle</label>
                <Input
                  value={aboutData.heroSubtitle}
                  onChange={(e) => updateField('heroSubtitle', e.target.value)}
                  placeholder="Excellence in Education Since 1875"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={aboutData.heroDescription}
                  onChange={(e) => updateField('heroDescription', e.target.value)}
                  placeholder="Brief description about the school"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              History Section
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Founded Year</label>
                <Input
                  value={aboutData.foundedYear}
                  onChange={(e) => updateField('foundedYear', e.target.value)}
                  placeholder="1875"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">History Title</label>
                <Input
                  value={aboutData.historyTitle}
                  onChange={(e) => updateField('historyTitle', e.target.value)}
                  placeholder="Our Rich History"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">History Content</label>
                <Textarea
                  value={aboutData.historyContent}
                  onChange={(e) => updateField('historyContent', e.target.value)}
                  placeholder="Write about the school's history and journey"
                  rows={6}
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Mission & Vision
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mission Title</label>
                <Input
                  value={aboutData.missionTitle}
                  onChange={(e) => updateField('missionTitle', e.target.value)}
                  placeholder="Our Mission"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Mission Content</label>
                <Textarea
                  value={aboutData.missionContent}
                  onChange={(e) => updateField('missionContent', e.target.value)}
                  placeholder="Describe the school's mission"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Vision Title</label>
                <Input
                  value={aboutData.visionTitle}
                  onChange={(e) => updateField('visionTitle', e.target.value)}
                  placeholder="Our Vision"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Vision Content</label>
                <Textarea
                  value={aboutData.visionContent}
                  onChange={(e) => updateField('visionContent', e.target.value)}
                  placeholder="Describe the school's vision"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(aboutData.stats).map(([key, stat]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium block capitalize">{key}</label>
                  <Input
                    value={stat.number}
                    onChange={(e) => updateField(`stats.${key}.number`, e.target.value)}
                    placeholder="2,500+"
                    className="text-center"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => updateField(`stats.${key}.label`, e.target.value)}
                    placeholder="Students"
                    className="text-center text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Core Values
            </h3>
            <div className="space-y-4">
              {Object.entries(aboutData.values).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium block capitalize">{key}</label>
                  <Input
                    value={value.title}
                    onChange={(e) => updateField(`values.${key}.title`, e.target.value)}
                    placeholder="Excellence"
                  />
                  <Textarea
                    value={value.description}
                    onChange={(e) => updateField(`values.${key}.description`, e.target.value)}
                    placeholder="Description of this value"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Achievements
            </h3>
            <div className="space-y-3">
              {aboutData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={achievement}
                    onChange={(e) => {
                      const newAchievements = [...aboutData.achievements];
                      newAchievements[index] = e.target.value;
                      setAboutData(prev => ({ ...prev, achievements: newAchievements }));
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addAchievement}
                className="w-full"
              >
                + Add Achievement
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <Textarea
                  value={aboutData.contactInfo.address}
                  onChange={(e) => updateField('contactInfo.address', e.target.value)}
                  placeholder="School address"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input
                  value={aboutData.contactInfo.phone}
                  onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  value={aboutData.contactInfo.email}
                  onChange={(e) => updateField('contactInfo.email', e.target.value)}
                  placeholder="info@royalacademy.edu"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Website</label>
                <Input
                  value={aboutData.contactInfo.website}
                  onChange={(e) => updateField('contactInfo.website', e.target.value)}
                  placeholder="www.royalacademy.edu"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Link */}
      {showPreview && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="font-semibold text-foreground">Live Preview</h3>
              <p className="text-sm text-muted-foreground">View how the about page looks to visitors</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="/about" target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Open About Page
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPageManager;
