import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  LogOut, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  FileText, 
  BarChart3,
  Bell,
  Edit,
  Eye,
  Plus,
  Search,
  X,
  Trophy,
  UserPlus,
  IdCard,
  DollarSign,
  Clock,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import TeacherManager from "@/components/TeacherManager";
import HomepageEditor from "@/components/HomepageEditor";
import AnnouncementManager from "@/components/AnnouncementManager";
import GalleryManagerSimple from "@/components/GalleryManagerSimple";
import AboutPageManager from "@/components/AboutPageManager";
import CourseManager from "@/components/CourseManager";
import TopScorersManager from "@/components/TopScorersManager";
import AdmissionsPageManager from "@/components/AdmissionsPageManager";

// Admission record type for localStorage sync with Admissions page
interface AdmissionRecord {
  id: string;
  createdAt: string;
  paymentStatus: 'paid' | 'test';
  paymentMethod?: 'razorpay' | 'paypal' | 'stripe' | 'test' | null;
  subscriptionType: 'monthly' | 'yearly';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  citizenship: string;
  level: string;
  term: string;
  program: string;
  essay: string;
  ref1: string;
  refEmail: string;
  // Additional properties for student records
  class?: string;
  rollNumber?: string;
  studentPhoto?: string | null;
  aadhaarCard?: string | null;
  birthCertificate?: string | null;
}

// Teacher record used for Principal teacher management
interface TeacherRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  employeeId?: string;
  phone?: string;
  assignedClass?: string;
  assignedSection?: string;
  classes?: string[]; // e.g. ["8A", "9B"]
  password?: string;
  status: 'active' | 'banned';
  joinDate?: string;
  createdAt?: string;
}

const PrincipalDashboard = () => {
  const [principalEmail, setPrincipalEmail] = useState("");
  const [activeSection, setActiveSection] = useState<"dashboard" | "teachers" | "homepage" | "courses" | "gallery" | "about" | "announcements" | "admissions" | "topscorers" | "createteacherid" | "manageteachers" | "manageteacherid" | "pricemanagement" | "timetable" | "admissionsmanager">("dashboard");
  
  // Teacher creation form state
  const [teacherForm, setTeacherForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    employeeId: "",
    phone: "",
    assignedClass: "",
    assignedSection: "",
    password: "",
    sendCredentials: false
  });
  
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [admissionsSearch, setAdmissionsSearch] = useState("");
  
  // Timetable management state
  const [selectedTimetableClass, setSelectedTimetableClass] = useState("1");
  const [selectedTimetableSection, setSelectedTimetableSection] = useState("A");
  const [currentTimetable, setCurrentTimetable] = useState<any[]>([]);
  const [editingPeriod, setEditingPeriod] = useState<any>(null);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  
  const navigate = useNavigate();
  // Teachers state (for Manage Teachers section)
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [teacherSearch, setTeacherSearch] = useState("");
  // Price management state
  const [pricing, setPricing] = useState({
    monthly: 5000,
    yearly: 50000
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState("");
  const [teacherStatusFilter, setTeacherStatusFilter] = useState("");
  const [editTeacher, setEditTeacher] = useState<TeacherRecord | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Teacher Application",
      message: "John Smith has applied for the Mathematics position",
      time: "2 minutes ago",
      type: "info",
      unread: true
    },
    {
      id: 2,
      title: "Homepage Updated",
      message: "Banner images have been successfully updated",
      time: "1 hour ago",
      type: "success",
      unread: true
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "Scheduled maintenance tonight from 2:00 AM - 4:00 AM",
      time: "3 hours ago",
      type: "warning",
      unread: false
    },
    {
      id: 4,
      title: "New Student Enrollment",
      message: "25 new students enrolled for the upcoming semester",
      time: "1 day ago",
      unread: false
    }
  ]);

  // Handle teacher account creation
  const handleCreateTeacher = async () => {
    // Validation
    if (!teacherForm.fullName || !teacherForm.email || !teacherForm.subject || !teacherForm.assignedClass || !teacherForm.assignedSection) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const teacherId = teacherForm.employeeId || `TCH${Date.now().toString().slice(-6)}`;
      const defaultPassword = `${teacherForm.fullName.split(' ')[0].toLowerCase()}123`;
      const newTeacher: TeacherRecord = {
        id: teacherId,
        name: teacherForm.fullName,
        email: teacherForm.email,
        subject: teacherForm.subject,
        employeeId: teacherId,
        phone: teacherForm.phone,
        assignedClass: teacherForm.assignedClass,
        assignedSection: teacherForm.assignedSection,
        password: defaultPassword,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      const existingTeachers: TeacherRecord[] = JSON.parse(localStorage.getItem('royal-academy-teachers') || '[]');
      localStorage.setItem('royal-academy-teachers', JSON.stringify([...existingTeachers, newTeacher]));
      const existingAuthTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const authTeacher = { ...newTeacher, username: teacherForm.fullName, teacherId, type: 'teacher' } as any;
      localStorage.setItem('royal-academy-auth-teachers', JSON.stringify([...existingAuthTeachers, authTeacher]));
      alert(`Teacher account created successfully!\n\nLogin Credentials:\nEmail: ${teacherForm.email}\nPassword: ${defaultPassword}\nTeacher ID: ${teacherId}`);
      setTeachers(prev => [...prev, newTeacher]);
      setActiveSection('manageteachers');
      setTeacherForm({ fullName: "", email: "", subject: "", employeeId: "", phone: "", assignedClass: "", assignedSection: "", password: "", sendCredentials: false });
    } catch (error) {
      alert("Failed to create teacher account. Please try again.");
      console.error("Error creating teacher:", error);
    }
  };

  // Save edited teacher (updates both teachers and auth lists)
  const handleSaveTeacherEdit = () => {
    if (!editTeacher) return;
    setTeachers(prev => {
      const updated = prev.map(t => (t.id === editTeacher.id ? editTeacher : t));
      localStorage.setItem('royal-academy-teachers', JSON.stringify(updated));
      try {
        const auth = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
        const updatedAuth = (auth || []).map((a: any) =>
          (a.id === editTeacher.id || a.teacherId === editTeacher.id)
            ? { ...a, username: editTeacher.name, name: editTeacher.name, email: editTeacher.email, subject: editTeacher.subject, phone: editTeacher.phone, assignedClass: editTeacher.assignedClass, assignedSection: editTeacher.assignedSection, status: editTeacher.status }
            : a
        );
        localStorage.setItem('royal-academy-auth-teachers', JSON.stringify(updatedAuth));
      } catch {}
      return updated;
    });
    setEditTeacher(null);
  };

  // Load teachers from localStorage
  const loadTeachers = () => {
    try {
      const saved = localStorage.getItem('royal-academy-teachers');
      const parsed: TeacherRecord[] = saved ? JSON.parse(saved) : [];
      setTeachers(parsed);
    } catch (e) {
      console.error('Error loading teachers:', e);
      setTeachers([]);
    }
  };

  // Toggle ban/unban teacher
  const handleToggleBan = (teacherId: string) => {
    setTeachers(prev => {
      const updated: TeacherRecord[] = prev.map(t =>
        t.id === teacherId ? { ...t, status: (t.status === 'active' ? 'banned' : 'active') as 'active' | 'banned' } : t
      );
      localStorage.setItem('royal-academy-teachers', JSON.stringify(updated));
      return updated;
    });
  };

  // Delete teacher
  const handleDeleteTeacher = (teacherId: string) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    setTeachers(prev => {
      const updated: TeacherRecord[] = prev.filter(t => t.id !== teacherId);
      localStorage.setItem('royal-academy-teachers', JSON.stringify(updated));
      try {
        const existingAuth = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
        const updatedAuth = existingAuth.filter((t: any) => t.id !== teacherId && t.teacherId !== teacherId);
        localStorage.setItem('royal-academy-auth-teachers', JSON.stringify(updatedAuth));
      } catch {}
      return updated;
    });
  };

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("principalAuth");
    const email = localStorage.getItem("principalEmail");
    
    console.log("Auth check:", { isAuth, email });
    
    if (!isAuth || isAuth !== "true") {
      console.log("Not authenticated, setting default for testing");
      // For testing - set default credentials
      localStorage.setItem("principalAuth", "true");
      localStorage.setItem("principalEmail", "principal.1025@gmail.com");
      setPrincipalEmail("principal.1025@gmail.com");
      return;
    }

    if (email) {
      setPrincipalEmail(email);
    }
    
    console.log("Authentication successful, email set:", email);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('[data-notification-container]')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Load admissions from localStorage
  const loadAdmissions = () => {
    try {
      const saved = localStorage.getItem('royal-academy-admissions');
      const parsed = saved ? JSON.parse(saved) : [];
      console.log('Loading admissions from localStorage:', parsed);
      setAdmissions(parsed);
      console.log('Admissions state updated. Count:', parsed.length);
    } catch (e) {
      console.error('Error loading admissions:', e);
      setAdmissions([]);
    }
  };

  useEffect(() => {
    try {
      loadAdmissions();
      loadTeachers();
      
      // Load pricing from localStorage
      const savedPricing = localStorage.getItem('royal-academy-pricing');
      if (savedPricing) {
        setPricing(JSON.parse(savedPricing));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      setError('Failed to load dashboard data');
      setIsLoading(false);
    }
    
    const onStorage = (e: StorageEvent) => {
      try {
        if (e.key === 'royal-academy-admissions') {
          loadAdmissions();
        }
        if (e.key === 'royal-academy-teachers') {
          loadTeachers();
        }
      } catch (error) {
        console.error('Error handling storage event:', error);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Reload admissions when the Admissions section opens
  useEffect(() => {
    if (activeSection === 'admissions') {
      loadAdmissions();
    }
  }, [activeSection]);

  const handleLogout = () => {
    localStorage.removeItem("principalAuth");
    localStorage.removeItem("principalEmail");
    navigate("/");
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const stats = [
    { icon: Users, label: "Total Students", value: "1,247", change: "+12 this month" },
    { icon: BookOpen, label: "Active Courses", value: "45", change: "+3 new courses" },
    { icon: Calendar, label: "Upcoming Events", value: "8", change: "Next: Science Fair" },
    { icon: BarChart3, label: "Average Grade", value: "87.5%", change: "+2.3% improvement" }
  ];

  const quickActions = [
    { icon: Plus, label: "Add New Student", color: "from-blue-500 to-blue-600", action: () => {} },
    { icon: Edit, label: "Edit Course Content", color: "from-green-500 to-green-600", action: () => {} },
    { icon: Calendar, label: "Schedule Event", color: "from-purple-500 to-purple-600", action: () => {} },
    { icon: FileText, label: "Generate Report", color: "from-orange-500 to-orange-600", action: () => {} },
    { icon: Bell, label: "Send Announcement", color: "from-red-500 to-red-600", action: () => setActiveSection("announcements") },
    { icon: Clock, label: "Manage Timetable", color: "from-indigo-500 to-indigo-600", action: () => setActiveSection("timetable") },
    { icon: GraduationCap, label: "Edit Admissions Page", color: "from-purple-500 to-purple-600", action: () => setActiveSection("admissionsmanager") },
    { icon: Settings, label: "System Settings", color: "from-gray-500 to-gray-600", action: () => {} }
  ];

  const recentActivities = [
    { action: "New student enrollment", details: "John Smith enrolled in Grade 10", time: "2 hours ago" },
    { action: "Course updated", details: "Mathematics curriculum revised", time: "4 hours ago" },
    { action: "Event scheduled", details: "Parent-Teacher meeting on Dec 15", time: "1 day ago" },
    { action: "Report generated", details: "Monthly performance report", time: "2 days ago" }
  ];

  // Precompute filtered teachers list for Manage Teachers
  const filteredTeachers = teachers
    .filter(t => (teacherSubjectFilter ? (t.subject || '').toLowerCase() === teacherSubjectFilter.toLowerCase() : true))
    .filter(t => (teacherStatusFilter ? t.status === (teacherStatusFilter as 'active' | 'banned') : true))
    .filter(t => {
      const q = teacherSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        (t.name || '').toLowerCase().includes(q) ||
        (t.email || '').toLowerCase().includes(q) ||
        (t.subject || '').toLowerCase().includes(q)
      );
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Principal Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ Error</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50"
      >
        <div className="container-wide py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                  Principal Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Welcome back, {principalEmail}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-48 lg:w-64"
                />
              </div>
              
              {/* Notification Bell */}
              <div className="relative" data-notification-container>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs"
                          >
                            Mark all as read
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                              notification.unread ? 'bg-muted/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className={`text-sm font-medium ${
                                    notification.unread ? 'text-foreground' : 'text-muted-foreground'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  {notification.unread && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {notification.time}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                {notification.unread && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => setShowNotifications(false)}
                        >
                          View All Notifications
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container-wide py-4 sm:py-8 px-4 sm:px-6">
        {/* Main Dashboard Content */}
        {activeSection === "dashboard" && (
          <>
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8"
            >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-card/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-6 border border-border/50 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-royal/20 to-gold/20 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-royal" />
                </div>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm font-medium text-foreground mb-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">{stat.change}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border/50">
              <h2 className="text-base sm:text-lg font-heading font-bold text-foreground mb-4 sm:mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.action}
                    className="p-3 sm:p-4 rounded-lg bg-gradient-to-r hover:shadow-lg transition-all duration-200 text-white group touch-manipulation"
                  >
                    <div className={`bg-gradient-to-r ${action.color} p-3 sm:p-4 rounded-lg`}>
                      <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white mb-2 sm:mb-3 mx-auto" />
                      <p className="text-xs sm:text-sm font-medium text-white text-center leading-tight">
                        {action.label}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border/50">
              <h2 className="text-base sm:text-lg font-heading font-bold text-foreground mb-4 sm:mb-6">
                Recent Activities
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground mb-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm">View All Activities</span>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Management Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 sm:mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border/50">
            <h2 className="text-base sm:text-lg font-heading font-bold text-foreground mb-4 sm:mb-6">
              Content Management
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4">
              {[
                { title: "Edit Homepage", desc: "Update main page content", icon: Edit, action: () => setActiveSection("homepage") },
                { title: "Manage Teachers", desc: "Add/edit teacher profiles", icon: Users, action: () => setActiveSection("teachers") },
                { title: "Send Announcements", desc: "Create and manage announcements", icon: Bell, action: () => setActiveSection("announcements") },
                { title: "Manage Courses", desc: "Add/edit academic programs", icon: BookOpen, action: () => setActiveSection("courses") },
                { title: "Update Gallery", desc: "Manage photo galleries", icon: Eye, action: () => setActiveSection("gallery") },
                { title: "Edit About Page", desc: "Update school information", icon: FileText, action: () => setActiveSection("about") },
                { title: "View Admissions", desc: "Review submitted applications", icon: FileText, action: () => setActiveSection("admissions") },
                { title: "Manage Top Scorers", desc: "Edit students, rankings, and categories", icon: Trophy, action: () => setActiveSection("topscorers") },
                { title: "Create New Teacher ID", desc: "Generate teacher login credentials", icon: UserPlus, action: () => setActiveSection("createteacherid") },
                { title: "Manage Teacher IDs", desc: "View and manage teacher login credentials", icon: IdCard, action: () => setActiveSection("manageteacherid") },
                { title: "Price Management", desc: "Update admission fees and pricing", icon: DollarSign, action: () => setActiveSection("pricemanagement") }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  onClick={item.action}
                  className="p-3 sm:p-4 rounded-lg border border-border/30 hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer group touch-manipulation"
                >
                  <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gold mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
          </>
        )}

        {/* Conditional Content Sections */}
        {activeSection === "teachers" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 sm:mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
                  Teacher Management
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Back to Dashboard
                </Button>
              </div>
              <TeacherManager />
            </div>
          </motion.div>
        )}

        {activeSection === "homepage" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 sm:mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
                  Homepage Management
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Back to Dashboard
                </Button>
              </div>
              <HomepageEditor />
            </div>
          </motion.div>
        )}

        {activeSection === "announcements" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 sm:mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-base sm:text-lg font-heading font-bold text-foreground">
                  Announcement Management
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Back to Dashboard
                </Button>
              </div>
              <AnnouncementManager />
            </div>
          </motion.div>
        )}

        {activeSection === "courses" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-bold text-foreground">
                  Course Management
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  size="sm"
                >
                  Back to Dashboard
                </Button>
              </div>
              <CourseManager />
            </div>
          </motion.div>
        )}

        {activeSection === "gallery" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-bold text-foreground">
                  Gallery Management
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  size="sm"
                >
                  Back to Dashboard
                </Button>
              </div>
              <GalleryManagerSimple />
            </div>
          </motion.div>
        )}

        {activeSection === "about" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-bold text-foreground">
                  Update School Information
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  size="sm"
                >
                  Back to Dashboard
                </Button>
              </div>
              <AboutPageManager />
            </div>
          </motion.div>
        )}

        {activeSection === "admissions" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <div>
                  <h2 className="text-lg font-heading font-bold text-foreground">Admissions</h2>
                  <p className="text-sm text-muted-foreground">
                    Total: {admissions.length} • Paid: {admissions.filter(a => a.paymentStatus === 'paid').length} • Test: {admissions.filter(a => a.paymentStatus === 'test').length}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    placeholder="Search by name, email, or program..."
                    value={admissionsSearch}
                    onChange={(e) => setAdmissionsSearch(e.target.value)}
                    className="w-full sm:w-72"
                  />
                  <Button variant="outline" onClick={loadAdmissions}>
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={() => setActiveSection("dashboard")}>Back</Button>
                </div>
              </div>

              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-border/50">
                      <th className="py-3 pr-4">Student</th>
                      <th className="py-3 pr-4">Contact</th>
                      <th className="py-3 pr-4">Class/Roll</th>
                      <th className="py-3 pr-4">Plan</th>
                      <th className="py-3 pr-4">Payment</th>
                      <th className="py-3 pr-4">Documents</th>
                      <th className="py-3 pr-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions
                      .filter(a => {
                        const q = admissionsSearch.trim().toLowerCase();
                        if (!q) return true;
                        const name = `${a.firstName} ${a.lastName}`.toLowerCase();
                        return (
                          name.includes(q) ||
                          (a.email || '').toLowerCase().includes(q) ||
                          (a.program || '').toLowerCase().includes(q)
                        );
                      })
                      .map((a) => (
                        <tr key={a.id} className="border-b border-border/30 hover:bg-muted/20">
                          <td className="py-3 pr-4">
                            <div>
                              <div className="font-medium text-foreground">{a.firstName} {a.lastName}</div>
                              {a.studentPhoto && typeof a.studentPhoto === 'object' && (
                                <img 
                                  src={URL.createObjectURL(a.studentPhoto)} 
                                  alt="Student" 
                                  className="w-8 h-8 rounded-full mt-1 object-cover border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="text-muted-foreground">
                              <div>{a.email}</div>
                              {a.phone && <div className="text-xs">{a.phone}</div>}
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            <div>Class {a.class || 'N/A'}</div>
                            <div className="text-xs">Roll: {a.rollNumber || 'N/A'}</div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              a.subscriptionType === 'yearly' 
                                ? 'bg-gold/10 text-gold border border-gold/30' 
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            }`}>
                              {a.subscriptionType === 'yearly' ? 'Yearly' : 'Monthly'}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            {a.paymentStatus === 'paid' ? (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                                Paid{a.paymentMethod && a.paymentMethod !== 'test' ? ` (${a.paymentMethod})` : ''}
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">Test</span>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex gap-1">
                              {a.aadhaarCard && typeof a.aadhaarCard === 'object' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    try {
                                      if (a.aadhaarCard && (a.aadhaarCard as any instanceof File || a.aadhaarCard as any instanceof Blob)) {
                                        const url = URL.createObjectURL(a.aadhaarCard as unknown as Blob);
                                        window.open(url, '_blank');
                                      } else if (typeof a.aadhaarCard === 'string') {
                                        window.open(a.aadhaarCard, '_blank');
                                      }
                                    } catch (error) {
                                      console.error('Error opening Aadhaar card:', error);
                                    }
                                  }}
                                  title="View Aadhaar Card"
                                  className="h-6 px-2 text-xs"
                                >
                                  Aadhaar
                                </Button>
                              )}
                              {a.birthCertificate && typeof a.birthCertificate === 'object' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    try {
                                      if (a.birthCertificate && (a.birthCertificate as any instanceof File || a.birthCertificate as any instanceof Blob)) {
                                        const url = URL.createObjectURL(a.birthCertificate as unknown as Blob);
                                        window.open(url, '_blank');
                                      } else if (typeof a.birthCertificate === 'string') {
                                        window.open(a.birthCertificate, '_blank');
                                      }
                                    } catch (error) {
                                      console.error('Error opening birth certificate:', error);
                                    }
                                  }}
                                  title="View Birth Certificate"
                                  className="h-6 px-2 text-xs"
                                >
                                  Birth Cert
                                </Button>
                              )}
                              {a.studentPhoto && typeof a.studentPhoto === 'object' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    try {
                                      if (a.studentPhoto && (a.studentPhoto as any instanceof File || a.studentPhoto as any instanceof Blob)) {
                                        const url = URL.createObjectURL(a.studentPhoto as unknown as Blob);
                                        window.open(url, '_blank');
                                      } else if (typeof a.studentPhoto === 'string') {
                                        window.open(a.studentPhoto, '_blank');
                                      }
                                    } catch (error) {
                                      console.error('Error opening student photo:', error);
                                    }
                                  }}
                                  title="View Student Photo"
                                  className="h-6 px-2 text-xs"
                                >
                                  Photo
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground text-xs">{new Date(a.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    {admissions.length === 0 && (
                      <tr>
                        <td className="py-6 text-center text-muted-foreground" colSpan={7}>No admissions yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === "topscorers" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-bold text-foreground">
                  Top Scorers Management
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  size="sm"
                >
                  Back to Dashboard
                </Button>
              </div>
              <TopScorersManager />
            </div>
          </motion.div>
        )}

        {activeSection === "manageteachers" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-heading font-bold text-foreground">
                    Teacher Management System
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    View, edit, ban/unban, and delete teacher accounts
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  size="sm"
                >
                  Back to Dashboard
                </Button>
              </div>

              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search teachers by name, email, or subject..."
                      value={teacherSearch}
                      onChange={(e) => setTeacherSearch(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={teacherSubjectFilter}
                    onChange={(e) => setTeacherSubjectFilter(e.target.value)}
                    className="px-4 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="">All Subjects</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="english literature">English Literature</option>
                    <option value="hindi">Hindi</option>
                    <option value="history">History</option>
                    <option value="geography">Geography</option>
                    <option value="civics/political science">Civics/Political Science</option>
                    <option value="economics">Economics</option>
                    <option value="computer science">Computer Science</option>
                    <option value="information technology">Information Technology</option>
                    <option value="physical education">Physical Education</option>
                    <option value="arts & crafts">Arts & Crafts</option>
                    <option value="music">Music</option>
                    <option value="dance">Dance</option>
                    <option value="drawing & painting">Drawing & Painting</option>
                    <option value="home science">Home Science</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="commerce">Commerce</option>
                    <option value="accountancy">Accountancy</option>
                    <option value="business studies">Business Studies</option>
                    <option value="psychology">Psychology</option>
                    <option value="sociology">Sociology</option>
                    <option value="philosophy">Philosophy</option>
                    <option value="sanskrit">Sanskrit</option>
                    <option value="urdu">Urdu</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="spanish">Spanish</option>
                  </select>
                  <select
                    value={teacherStatusFilter}
                    onChange={(e) => setTeacherStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>

                {/* Teachers List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeachers.map((teacher) => (
                    <motion.div
                      key={teacher.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-card to-card/80 rounded-xl p-6 border border-border/50 shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                            <Users className="h-6 w-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{teacher.name}</h3>
                            <p className="text-sm text-muted-foreground">{teacher.id}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          teacher.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {teacher.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm"><span className="font-medium">Subject:</span> {teacher.subject}</p>
                        <p className="text-sm"><span className="font-medium">Email:</span> {teacher.email}</p>
                        <p className="text-sm"><span className="font-medium">Phone:</span> {teacher.phone}</p>
                        <p className="text-sm"><span className="font-medium">Classes:</span> {teacher.classes && teacher.classes.length > 0 ? teacher.classes.join(", ") : (teacher.assignedClass && teacher.assignedSection ? `${teacher.assignedClass}${teacher.assignedSection}` : "-")}</p>
                        <p className="text-sm"><span className="font-medium">Joined:</span> {teacher.joinDate}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditTeacher(teacher)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={`flex-1 ${
                            teacher.status === 'active' 
                              ? 'text-red-400 hover:text-red-300' 
                              : 'text-green-400 hover:text-green-300'
                          }`}
                          onClick={() => handleToggleBan(teacher.id)}
                        >
                          {teacher.status === 'active' ? (
                            <>
                              <X className="h-3 w-3 mr-1" />
                              Ban
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Unban
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteTeacher(teacher.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {filteredTeachers.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">No one is teacher for now.</div>
                  )}
                </div>

                {/* Add New Teacher Button */}
                <div className="text-center">
                  <Button
                    onClick={() => setActiveSection("createteacherid")}
                    className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Teacher
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Teacher Modal */}
        {editTeacher && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditTeacher(null)}>
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-heading font-bold">Edit Teacher</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditTeacher(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input value={editTeacher.name} onChange={(e) => setEditTeacher({ ...editTeacher, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input type="email" value={editTeacher.email} onChange={(e) => setEditTeacher({ ...editTeacher, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <Input value={editTeacher.subject || ''} onChange={(e) => setEditTeacher({ ...editTeacher, subject: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input value={editTeacher.phone || ''} onChange={(e) => setEditTeacher({ ...editTeacher, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <Input value={editTeacher.assignedClass || ''} onChange={(e) => setEditTeacher({ ...editTeacher, assignedClass: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Section</label>
                    <Input value={editTeacher.assignedSection || ''} onChange={(e) => setEditTeacher({ ...editTeacher, assignedSection: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={editTeacher.status}
                      onChange={(e) => setEditTeacher({ ...editTeacher, status: e.target.value as 'active' | 'banned' })}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    >
                      <option value="active">Active</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
                <Button variant="outline" onClick={() => setEditTeacher(null)}>Cancel</Button>
                <Button onClick={handleSaveTeacherEdit} className="bg-gradient-to-r from-gold to-yellow-500 text-black">Save Changes</Button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "createteacherid" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-heading font-bold text-foreground">
                    Create New Teacher ID
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate login credentials for teachers to access their dashboard
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  size="sm"
                >
                  Back to Dashboard
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Teacher ID Creation Form */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gold/10 to-yellow-500/10 border border-gold/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                        <IdCard className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-heading font-bold text-gradient-gold">
                          Teacher Registration
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Create secure login credentials for new teachers
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <Input 
                          value={teacherForm.fullName}
                          onChange={(e) => setTeacherForm({...teacherForm, fullName: e.target.value})}
                          placeholder="Enter teacher's full name" 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                        <Input 
                          type="email" 
                          value={teacherForm.email}
                          onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                          placeholder="teacher@royalacademy.edu" 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Subject/Department *</label>
                        <select 
                          value={teacherForm.subject}
                          onChange={(e) => setTeacherForm({...teacherForm, subject: e.target.value})}
                          className="w-full p-3 border border-border rounded-lg bg-background"
                        >
                          <option value="">Select Department</option>
                          <option value="mathematics">Mathematics</option>
                          <option value="science">Science</option>
                          <option value="physics">Physics</option>
                          <option value="chemistry">Chemistry</option>
                          <option value="biology">Biology</option>
                          <option value="english">English Literature</option>
                          <option value="hindi">Hindi</option>
                          <option value="history">History</option>
                          <option value="geography">Geography</option>
                          <option value="civics">Civics/Political Science</option>
                          <option value="economics">Economics</option>
                          <option value="computer-science">Computer Science</option>
                          <option value="information-technology">Information Technology</option>
                          <option value="physical-education">Physical Education</option>
                          <option value="arts">Arts & Crafts</option>
                          <option value="music">Music</option>
                          <option value="dance">Dance</option>
                          <option value="drawing">Drawing & Painting</option>
                          <option value="home-science">Home Science</option>
                          <option value="agriculture">Agriculture</option>
                          <option value="commerce">Commerce</option>
                          <option value="accountancy">Accountancy</option>
                          <option value="business-studies">Business Studies</option>
                          <option value="psychology">Psychology</option>
                          <option value="sociology">Sociology</option>
                          <option value="philosophy">Philosophy</option>
                          <option value="sanskrit">Sanskrit</option>
                          <option value="urdu">Urdu</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="spanish">Spanish</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Employee ID</label>
                        <Input 
                          value={teacherForm.employeeId}
                          onChange={(e) => setTeacherForm({...teacherForm, employeeId: e.target.value})}
                          placeholder="Auto-generated (optional custom ID)" 
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Leave blank for auto-generation
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input 
                          type="tel" 
                          value={teacherForm.phone}
                          onChange={(e) => setTeacherForm({...teacherForm, phone: e.target.value})}
                          placeholder="+1 (555) 123-4567" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Assigned Classes</label>
                          <select 
                            value={teacherForm.assignedClass}
                            onChange={(e) => setTeacherForm({...teacherForm, assignedClass: e.target.value})}
                            className="w-full p-3 border border-border rounded-lg bg-background"
                          >
                            <option value="">Select Class</option>
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                            <option value="4">Class 4</option>
                            <option value="5">Class 5</option>
                            <option value="6">Class 6</option>
                            <option value="7">Class 7</option>
                            <option value="8">Class 8</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Assigned Sections</label>
                          <select 
                            value={teacherForm.assignedSection}
                            onChange={(e) => setTeacherForm({...teacherForm, assignedSection: e.target.value})}
                            className="w-full p-3 border border-border rounded-lg bg-background"
                          >
                            <option value="">Select Section</option>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
                            <option value="D">Section D</option>
                            <option value="E">Section E</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="sendCredentials" 
                          checked={teacherForm.sendCredentials}
                          onChange={(e) => setTeacherForm({...teacherForm, sendCredentials: e.target.checked})}
                          className="rounded" 
                        />
                        <label htmlFor="sendCredentials" className="text-sm">
                          Send login credentials via email
                        </label>
                      </div>

                      <Button 
                        onClick={handleCreateTeacher}
                        className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Teacher Account
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Information Panel */}
                <div className="space-y-6">
                  <div className="bg-royal/10 border border-royal/30 rounded-xl p-6">
                    <h3 className="text-lg font-heading font-bold text-royal mb-4">
                      Teacher Dashboard Features
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Take student attendance",
                        "Manage class schedules",
                        "Grade assignments and exams",
                        "Communicate with students and parents",
                        "Access student performance analytics",
                        "Upload course materials",
                        "Generate progress reports"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-royal"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-heading font-bold text-green-400 mb-4">
                      Security Features
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Secure password generation",
                        "Two-factor authentication support",
                        "Role-based access control",
                        "Activity logging and monitoring",
                        "Automatic session timeout",
                        "Password reset functionality"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-heading font-bold text-amber-400 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/manage-teachers')}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View All Teachers
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Permissions
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Export Teacher List
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {activeSection === "manageteacherid" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-heading font-bold text-foreground">
                    Manage Teacher IDs
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    View and manage teacher login credentials and access control
                  </p>
                </div>
                <Button
                  onClick={() => setActiveSection("dashboard")}
                  variant="outline"
                  size="sm"
                >
                  Back to Dashboard
                </Button>
              </div>

              {/* Redirect to Manage Teacher ID page */}
              <div className="text-center py-8">
                <IdCard className="h-16 w-16 mx-auto mb-4 text-gold" />
                <h3 className="text-xl font-bold mb-2">Teacher ID Management</h3>
                <p className="text-muted-foreground mb-6">
                  Access the comprehensive teacher ID management system to view, edit, and control teacher login credentials.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => window.open('/manage-teacher-id', '_blank')}
                    className="bg-gradient-to-r from-gold to-yellow-500 text-black hover:from-gold/90 hover:to-yellow-500/90"
                  >
                    <IdCard className="h-4 w-4 mr-2" />
                    Open Teacher ID Manager
                  </Button>
                  <Button
                    onClick={() => setActiveSection("createteacherid")}
                    variant="outline"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create New Teacher ID
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {(() => {
                      try {
                        const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
                        return authTeachers.length;
                      } catch {
                        return 0;
                      }
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Teacher IDs</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(() => {
                      try {
                        const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
                        return authTeachers.filter((t: any) => t.status === 'active' || !t.status).length;
                      } catch {
                        return 0;
                      }
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">Active IDs</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(() => {
                      try {
                        const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
                        return authTeachers.filter((t: any) => t.status === 'banned').length;
                      } catch {
                        return 0;
                      }
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">Banned IDs</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {(() => {
                      try {
                        const authTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
                        return authTeachers.filter((t: any) => (t.loginAttempts || 0) > 3).length;
                      } catch {
                        return 0;
                      }
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">Login Issues</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 p-4 bg-muted/10 rounded-lg">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/manage-teacher-id', '_blank')}
                  >
                    View All Teacher IDs
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveSection("createteacherid")}
                  >
                    Create New ID
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveSection("manageteachers")}
                  >
                    Manage Teachers
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === "pricemanagement" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-heading font-bold text-foreground">
                    Price Management
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Update admission fees and subscription pricing
                  </p>
                </div>
                <Button
                  onClick={() => setActiveSection("dashboard")}
                  variant="outline"
                  size="sm"
                >
                  Back to Dashboard
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Monthly Plan */}
                <div className="p-6 border border-border/50 rounded-xl">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-2">Monthly Plan</h3>
                    <div className="text-3xl font-bold text-gold mb-2">₹{pricing.monthly.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Per month</p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Monthly Price (₹)</label>
                    <Input
                      type="number"
                      value={pricing.monthly}
                      onChange={(e) => setPricing(prev => ({ ...prev, monthly: parseInt(e.target.value) || 0 }))}
                      min="0"
                      step="100"
                    />
                    <Button
                      onClick={() => {
                        localStorage.setItem('royal-academy-pricing', JSON.stringify(pricing));
                        alert('Monthly pricing updated successfully!');
                      }}
                      className="w-full"
                    >
                      Update Monthly Price
                    </Button>
                  </div>
                </div>

                {/* Yearly Plan */}
                <div className="p-6 border border-border/50 rounded-xl">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-2">Yearly Plan</h3>
                    <div className="text-3xl font-bold text-gold mb-2">₹{pricing.yearly.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Per year</p>
                    <p className="text-xs text-green-600">
                      Save ₹{((pricing.monthly * 12) - pricing.yearly).toLocaleString()}!
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Yearly Price (₹)</label>
                    <Input
                      type="number"
                      value={pricing.yearly}
                      onChange={(e) => setPricing(prev => ({ ...prev, yearly: parseInt(e.target.value) || 0 }))}
                      min="0"
                      step="1000"
                    />
                    <Button
                      onClick={() => {
                        localStorage.setItem('royal-academy-pricing', JSON.stringify(pricing));
                        alert('Yearly pricing updated successfully!');
                      }}
                      className="w-full"
                    >
                      Update Yearly Price
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bulk Update */}
              <div className="mt-6 p-4 bg-muted/10 rounded-lg">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      localStorage.setItem('royal-academy-pricing', JSON.stringify(pricing));
                      alert('All pricing updated successfully!');
                    }}
                  >
                    Save All Changes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const saved = localStorage.getItem('royal-academy-pricing');
                      if (saved) {
                        setPricing(JSON.parse(saved));
                        alert('Pricing loaded from saved settings!');
                      }
                    }}
                  >
                    Load Saved Pricing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPricing({ monthly: 5000, yearly: 50000 });
                      alert('Pricing reset to defaults!');
                    }}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>

              {/* Current Statistics */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {admissions.filter(a => a.subscriptionType === 'monthly').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Subscribers</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {admissions.filter(a => a.subscriptionType === 'yearly').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Yearly Subscribers</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gold">
                    ₹{(
                      admissions.filter(a => a.subscriptionType === 'monthly').length * pricing.monthly +
                      admissions.filter(a => a.subscriptionType === 'yearly').length * pricing.yearly
                    ).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Timetable Management Section */}
        {activeSection === "timetable" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">Timetable Management</h2>
                  <p className="text-sm text-muted-foreground">Create and manage class timetables for different sections</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Class and Section Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Class</label>
                  <select
                    value={selectedTimetableClass}
                    onChange={(e) => setSelectedTimetableClass(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Section</label>
                  <select
                    value={selectedTimetableSection}
                    onChange={(e) => setSelectedTimetableSection(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                    <option value="E">Section E</option>
                  </select>
                </div>
              </div>

              {/* Timetable Creation Interface */}
              <div className="bg-gradient-to-r from-royal/10 to-gold/10 rounded-lg p-6 border border-border/30">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Timetable for Class {selectedTimetableClass}{selectedTimetableSection}
                </h3>
                
                {/* Days of the week */}
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                    <div key={day} className="bg-card rounded-lg p-4 border border-border/30">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gold" />
                          {day}
                        </h4>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Add new period logic here
                              setEditingPeriod({ day, time: '', subject: '', teacher: '', room: '' });
                              setShowPeriodModal(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Period
                          </Button>
                          
                          {(() => {
                            // Check if day has periods to show delete button
                            const timetableKey = `royal-academy-timetable-${selectedTimetableClass}${selectedTimetableSection}`;
                            const storedTimetable = localStorage.getItem(timetableKey);
                            let hasPeriods = false;
                            
                            if (storedTimetable) {
                              const timetableData = JSON.parse(storedTimetable);
                              const daySchedule = timetableData.schedule?.find((d: any) => d.day === day);
                              hasPeriods = daySchedule?.periods?.length > 0;
                            }
                            
                            if (hasPeriods) {
                              return (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    if (confirm(`Delete all periods for ${day}?`)) {
                                      const timetableKey = `royal-academy-timetable-${selectedTimetableClass}${selectedTimetableSection}`;
                                      const existingTimetable = localStorage.getItem(timetableKey);
                                      
                                      if (existingTimetable) {
                                        const timetableData = JSON.parse(existingTimetable);
                                        const daySchedule = timetableData.schedule?.find((d: any) => d.day === day);
                                        
                                        if (daySchedule) {
                                          daySchedule.periods = [];
                                          localStorage.setItem(timetableKey, JSON.stringify(timetableData));
                                          alert(`All periods deleted for ${day}!`);
                                          // Force re-render
                                          setSelectedTimetableClass(selectedTimetableClass);
                                        }
                                      }
                                    }
                                  }}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Clear Day
                                </Button>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                      
                      {/* Time slots for the day */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(() => {
                          // Load actual timetable data for this day
                          const timetableKey = `royal-academy-timetable-${selectedTimetableClass}${selectedTimetableSection}`;
                          const storedTimetable = localStorage.getItem(timetableKey);
                          let dayPeriods = [];
                          
                          if (storedTimetable) {
                            const timetableData = JSON.parse(storedTimetable);
                            const daySchedule = timetableData.schedule?.find((d: any) => d.day === day);
                            dayPeriods = daySchedule?.periods || [];
                          }
                          
                          // If no periods exist, show empty state
                          if (dayPeriods.length === 0) {
                            return (
                              <div className="col-span-full text-center py-8 text-muted-foreground">
                                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No periods scheduled for {day}</p>
                                <p className="text-sm">Click "Add Period" to create the schedule</p>
                              </div>
                            );
                          }
                          
                          return dayPeriods.map((period: any, index: number) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border transition-colors relative group ${
                                period.subject === 'Break' || period.subject === 'Lunch Break'
                                  ? 'bg-muted/20 border-muted/30' 
                                  : 'bg-background border-border/30 hover:border-gold/50'
                              }`}
                            >
                              {/* Delete Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete ${period.subject} period at ${period.time}?`)) {
                                    // Delete period from timetable
                                    const timetableKey = `royal-academy-timetable-${selectedTimetableClass}${selectedTimetableSection}`;
                                    const existingTimetable = localStorage.getItem(timetableKey);
                                    
                                    if (existingTimetable) {
                                      const timetableData = JSON.parse(existingTimetable);
                                      const daySchedule = timetableData.schedule?.find((d: any) => d.day === day);
                                      
                                      if (daySchedule) {
                                        // Remove the period at the specified index
                                        daySchedule.periods.splice(index, 1);
                                        localStorage.setItem(timetableKey, JSON.stringify(timetableData));
                                        alert('Period deleted successfully!');
                                        // Force re-render
                                        setSelectedTimetableClass(selectedTimetableClass);
                                      }
                                    }
                                  }
                                }}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                title="Delete Period"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              
                              {/* Period Content - Click to Edit */}
                              <div
                                onClick={() => {
                                  setEditingPeriod({ day, ...period, index });
                                  setShowPeriodModal(true);
                                }}
                                className="cursor-pointer"
                              >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                {period.time}
                              </span>
                              {period.room && (
                                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                                  {period.room}
                                </span>
                              )}
                            </div>
                            
                            <h5 className={`font-semibold mb-1 ${
                              period.subject === 'Break' 
                                ? 'text-muted-foreground' 
                                : 'text-foreground'
                            }`}>
                              {period.subject}
                            </h5>
                            
                            {period.teacher && (
                              <p className="text-sm text-muted-foreground">
                                {period.teacher}
                              </p>
                            )}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button 
                    className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                    onClick={() => {
                      // Save timetable to localStorage
                      const timetableKey = `royal-academy-timetable-${selectedTimetableClass}${selectedTimetableSection}`;
                      const timetableData = {
                        class: selectedTimetableClass,
                        section: selectedTimetableSection,
                        schedule: [
                          { day: "Monday", periods: [
                            { time: "9:00-9:45", subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
                            { time: "9:45-10:30", subject: "Physics", teacher: "Prof. Johnson", room: "Lab-1" },
                            { time: "10:30-10:45", subject: "Break", teacher: "", room: "" },
                            { time: "10:45-11:30", subject: "Chemistry", teacher: "Dr. Brown", room: "Lab-2" },
                            { time: "11:30-12:15", subject: "English", teacher: "Ms. Davis", room: "102" },
                            { time: "12:15-1:00", subject: "Computer Science", teacher: "Mr. Wilson", room: "Computer Lab" },
                            { time: "1:00-2:00", subject: "Lunch Break", teacher: "", room: "" },
                            { time: "2:00-2:45", subject: "Biology", teacher: "Dr. Taylor", room: "Lab-3" },
                            { time: "2:45-3:30", subject: "Physical Education", teacher: "Coach Miller", room: "Playground" }
                          ]},
                          { day: "Tuesday", periods: [
                            { time: "9:00-9:45", subject: "Physics", teacher: "Prof. Johnson", room: "Lab-1" },
                            { time: "9:45-10:30", subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
                            { time: "10:30-10:45", subject: "Break", teacher: "", room: "" },
                            { time: "10:45-11:30", subject: "English", teacher: "Ms. Davis", room: "102" },
                            { time: "11:30-12:15", subject: "Chemistry", teacher: "Dr. Brown", room: "Lab-2" },
                            { time: "12:15-1:00", subject: "Hindi", teacher: "Mrs. Sharma", room: "103" },
                            { time: "1:00-2:00", subject: "Lunch Break", teacher: "", room: "" },
                            { time: "2:00-2:45", subject: "Computer Science", teacher: "Mr. Wilson", room: "Computer Lab" },
                            { time: "2:45-3:30", subject: "Art", teacher: "Ms. Anderson", room: "Art Room" }
                          ]},
                          { day: "Wednesday", periods: [
                            { time: "9:00-9:45", subject: "Chemistry", teacher: "Dr. Brown", room: "Lab-2" },
                            { time: "9:45-10:30", subject: "Biology", teacher: "Dr. Taylor", room: "Lab-3" },
                            { time: "10:30-10:45", subject: "Break", teacher: "", room: "" },
                            { time: "10:45-11:30", subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
                            { time: "11:30-12:15", subject: "Physics", teacher: "Prof. Johnson", room: "Lab-1" },
                            { time: "12:15-1:00", subject: "English", teacher: "Ms. Davis", room: "102" },
                            { time: "1:00-2:00", subject: "Lunch Break", teacher: "", room: "" },
                            { time: "2:00-2:45", subject: "History", teacher: "Mr. Thompson", room: "104" },
                            { time: "2:45-3:30", subject: "Geography", teacher: "Ms. Clark", room: "105" }
                          ]},
                          { day: "Thursday", periods: [
                            { time: "9:00-9:45", subject: "English", teacher: "Ms. Davis", room: "102" },
                            { time: "9:45-10:30", subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
                            { time: "10:30-10:45", subject: "Break", teacher: "", room: "" },
                            { time: "10:45-11:30", subject: "Physics", teacher: "Prof. Johnson", room: "Lab-1" },
                            { time: "11:30-12:15", subject: "Biology", teacher: "Dr. Taylor", room: "Lab-3" },
                            { time: "12:15-1:00", subject: "Computer Science", teacher: "Mr. Wilson", room: "Computer Lab" },
                            { time: "1:00-2:00", subject: "Lunch Break", teacher: "", room: "" },
                            { time: "2:00-2:45", subject: "Chemistry", teacher: "Dr. Brown", room: "Lab-2" },
                            { time: "2:45-3:30", subject: "Music", teacher: "Ms. Roberts", room: "Music Room" }
                          ]},
                          { day: "Friday", periods: [
                            { time: "9:00-9:45", subject: "Biology", teacher: "Dr. Taylor", room: "Lab-3" },
                            { time: "9:45-10:30", subject: "Chemistry", teacher: "Dr. Brown", room: "Lab-2" },
                            { time: "10:30-10:45", subject: "Break", teacher: "", room: "" },
                            { time: "10:45-11:30", subject: "English", teacher: "Ms. Davis", room: "102" },
                            { time: "11:30-12:15", subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
                            { time: "12:15-1:00", subject: "Physical Education", teacher: "Coach Miller", room: "Playground" },
                            { time: "1:00-2:00", subject: "Lunch Break", teacher: "", room: "" },
                            { time: "2:00-2:45", subject: "Hindi", teacher: "Mrs. Sharma", room: "103" },
                            { time: "2:45-3:30", subject: "Library Period", teacher: "Librarian", room: "Library" }
                          ]},
                          { day: "Saturday", periods: [
                            { time: "9:00-9:45", subject: "Extra Classes", teacher: "Various Teachers", room: "Multiple Rooms" },
                            { time: "9:45-10:30", subject: "Sports", teacher: "Coach Miller", room: "Playground" },
                            { time: "10:30-10:45", subject: "Break", teacher: "", room: "" },
                            { time: "10:45-11:30", subject: "Art & Craft", teacher: "Ms. Anderson", room: "Art Room" },
                            { time: "11:30-12:15", subject: "Music", teacher: "Ms. Roberts", room: "Music Room" },
                            { time: "12:15-1:00", subject: "Library Period", teacher: "Librarian", room: "Library" }
                          ]}
                        ]
                      };
                      localStorage.setItem(timetableKey, JSON.stringify(timetableData));
                      alert(`Timetable saved for Class ${selectedTimetableClass}${selectedTimetableSection}!`);
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Save Timetable
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Timetable
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export to PDF
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (confirm(`Delete entire timetable for Class ${selectedTimetableClass}${selectedTimetableSection}? This action cannot be undone.`)) {
                        const timetableKey = `royal-academy-timetable-${selectedTimetableClass}${selectedTimetableSection}`;
                        localStorage.removeItem(timetableKey);
                        alert(`Timetable deleted for Class ${selectedTimetableClass}${selectedTimetableSection}!`);
                        // Force re-render to show empty state
                        setSelectedTimetableClass(selectedTimetableClass);
                      }
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Delete Timetable
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Period Edit Modal */}
        {showPeriodModal && editingPeriod && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-xl p-6 w-full max-w-md border border-border/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Edit Period - {editingPeriod.day}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPeriodModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Time Slot</label>
                  <Input
                    value={editingPeriod.time}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, time: e.target.value })}
                    placeholder="e.g., 9:00-9:45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    value={editingPeriod.subject}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, subject: e.target.value })}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physical Education">Physical Education</option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                    <option value="Break">Break</option>
                    <option value="Lunch Break">Lunch Break</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teacher</label>
                  <Input
                    value={editingPeriod.teacher}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, teacher: e.target.value })}
                    placeholder="Teacher name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Room/Location</label>
                  <Input
                    value={editingPeriod.room}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, room: e.target.value })}
                    placeholder="e.g., Room 101, Lab-1, Playground"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={() => {
                    // Save period changes to localStorage
                    const timetableKey = `royal-academy-timetable-${selectedTimetableClass}${selectedTimetableSection}`;
                    const existingTimetable = localStorage.getItem(timetableKey);
                    
                    if (existingTimetable && editingPeriod) {
                      const timetableData = JSON.parse(existingTimetable);
                      const daySchedule = timetableData.schedule?.find((d: any) => d.day === editingPeriod.day);
                      
                      if (daySchedule) {
                        if (editingPeriod.index !== undefined) {
                          // Edit existing period
                          daySchedule.periods[editingPeriod.index] = {
                            time: editingPeriod.time,
                            subject: editingPeriod.subject,
                            teacher: editingPeriod.teacher,
                            room: editingPeriod.room
                          };
                        } else {
                          // Add new period
                          daySchedule.periods.push({
                            time: editingPeriod.time,
                            subject: editingPeriod.subject,
                            teacher: editingPeriod.teacher,
                            room: editingPeriod.room
                          });
                        }
                        
                        localStorage.setItem(timetableKey, JSON.stringify(timetableData));
                        alert('Period saved successfully!');
                      }
                    }
                    
                    setShowPeriodModal(false);
                    setEditingPeriod(null);
                    // Force re-render by updating a state
                    setSelectedTimetableClass(selectedTimetableClass);
                  }}
                  className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black"
                >
                  Save Period
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPeriodModal(false);
                    setEditingPeriod(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Admissions Page Manager Section */}
        {activeSection === "admissionsmanager" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">Edit Admissions Page</h2>
                  <p className="text-sm text-muted-foreground">Manage all content on the admissions page including FAQs, requirements, and contact information</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("dashboard")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <AdmissionsPageManager />
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default PrincipalDashboard;
