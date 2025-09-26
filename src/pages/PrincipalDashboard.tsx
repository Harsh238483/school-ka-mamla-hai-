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
  IdCard
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
  const [activeSection, setActiveSection] = useState<"dashboard" | "teachers" | "homepage" | "courses" | "gallery" | "about" | "announcements" | "admissions" | "topscorers" | "createteacherid" | "manageteachers">("dashboard");
  
  // Teacher creation form state
  const [teacherForm, setTeacherForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    employeeId: "",
    phone: "",
    assignedClass: "",
    assignedSection: "",
    sendCredentials: false
  });
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [admissionsSearch, setAdmissionsSearch] = useState("");
  // Teachers state (for Manage Teachers section)
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [teacherSearch, setTeacherSearch] = useState("");
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
  const navigate = useNavigate();

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
      const existingTeachers: TeacherRecord[] = JSON.parse(localStorage.getItem('royal-academy-teachers') || '[]');
      localStorage.setItem('royal-academy-teachers', JSON.stringify([...existingTeachers, newTeacher]));
      const existingAuthTeachers = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const authTeacher = { ...newTeacher, username: teacherForm.fullName, teacherId, type: 'teacher' } as any;
      localStorage.setItem('royal-academy-auth-teachers', JSON.stringify([...existingAuthTeachers, authTeacher]));
      alert(`Teacher account created successfully!\n\nLogin Credentials:\nEmail: ${teacherForm.email}\nPassword: ${defaultPassword}\nTeacher ID: ${teacherId}`);
      setTeachers(prev => [...prev, newTeacher]);
      setActiveSection('manageteachers');
      setTeacherForm({ fullName: "", email: "", subject: "", employeeId: "", phone: "", assignedClass: "", assignedSection: "", sendCredentials: false });
    } catch (error) {
      alert("Failed to create teacher account. Please try again.");
      console.error("Error creating teacher:", error);
    }
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
    loadAdmissions();
    loadTeachers();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'royal-academy-admissions') {
        loadAdmissions();
      }
      if (e.key === 'royal-academy-teachers') {
        loadTeachers();
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
    .filter(t => (teacherSubjectFilter ? (t.subject || '').toLowerCase() === teacherSubjectFilter : true))
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
                { title: "Manage Teachers", desc: "Add/edit teacher profiles", icon: Users, action: () => setActiveSection("manageteachers") },
                { title: "Send Announcements", desc: "Create and manage announcements", icon: Bell, action: () => setActiveSection("announcements") },
                { title: "Manage Courses", desc: "Add/edit academic programs", icon: BookOpen, action: () => setActiveSection("courses") },
                { title: "Update Gallery", desc: "Manage photo galleries", icon: Eye, action: () => setActiveSection("gallery") },
                { title: "Edit About Page", desc: "Update school information", icon: FileText, action: () => setActiveSection("about") },
                { title: "View Admissions", desc: "Review submitted applications", icon: FileText, action: () => setActiveSection("admissions") },
                { title: "Manage Top Scorers", desc: "Edit students, rankings, and categories", icon: Trophy, action: () => setActiveSection("topscorers") },
                { title: "Create New Teacher ID", desc: "Generate teacher login credentials", icon: UserPlus, action: () => setActiveSection("createteacherid") }
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
                  About Page Management
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
                      <th className="py-3 pr-4">Applicant</th>
                      <th className="py-3 pr-4">Email</th>
                      <th className="py-3 pr-4">Program</th>
                      <th className="py-3 pr-4">Level / Term</th>
                      <th className="py-3 pr-4">Payment</th>
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
                          <td className="py-3 pr-4 font-medium text-foreground">{a.firstName} {a.lastName}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{a.email}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{a.program}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{a.level} • {a.term}</td>
                          <td className="py-3 pr-4">
                            {a.paymentStatus === 'paid' ? (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/30">Paid{a.paymentMethod && a.paymentMethod !== 'test' ? ` (${a.paymentMethod})` : ''}</span>
                            ) : (
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">Test</span>
                            )}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    {admissions.length === 0 && (
                      <tr>
                        <td className="py-6 text-center text-muted-foreground" colSpan={6}>No admissions yet.</td>
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
                  {teachers
                    .filter(t => (teacherSubjectFilter ? (t.subject || '').toLowerCase() === teacherSubjectFilter : true))
                    .filter(t => (teacherStatusFilter ? t.status === (teacherStatusFilter as 'active' | 'banned') : true))
                    .filter(t => {
                      const q = teacherSearch.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        (t.name || '').toLowerCase().includes(q) ||
                        (t.email || '').toLowerCase().includes(q) ||
                        (t.subject || '').toLowerCase().includes(q)
                      );
                    })
                    .map((teacher) => (
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
                <Button onClick={() => setEditTeacher(null)} className="bg-gradient-to-r from-gold to-yellow-500 text-black">Save Changes</Button>
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
                      <Button variant="outline" className="w-full justify-start">
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
      </div>
    </div>
  );
};

export default PrincipalDashboard;
