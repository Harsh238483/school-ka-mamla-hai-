import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Shield, LogOut, Users, BookOpen, Calendar, Settings, FileText, 
  BarChart3, Bell, Edit, Eye, Plus, Search, X, Trophy, UserPlus,
  IdCard, Camera, Upload, Send, CheckCircle, XCircle, Clock,
  MessageSquare, Image as ImageIcon, Download, Star, AlertCircle, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  email: string;
  parentEmail: string;
  phone: string;
  image: string;
  attendance: {
    date: string;
    status: 'present' | 'absent' | 'late';
    remarks?: string;
  }[];
  remarks: {
    date: string;
    type: 'good' | 'bad';
    message: string;
    subject: string;
  }[];
}

interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  section: string;
  dueDate: string;
  attachments: string[];
  createdAt: string;
  createdBy: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  class: string;
  section: string;
  students: {
    studentId: string;
    status: 'present' | 'absent' | 'late';
    remarks?: string;
  }[];
  teacherId: string;
}

const TeacherDashboard = () => {
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");

  // Load teacher info from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("teacherEmail") || "";
    const storedName = localStorage.getItem("teacherName") || "";
    const storedSubject = localStorage.getItem("teacherSubject") || "";
    
    setTeacherEmail(storedEmail);
    setTeacherName(storedName);
    setTeacherSubject(storedSubject);
  }, []);
  const [activeSection, setActiveSection] = useState<"dashboard" | "homework" | "attendance" | "students" | "createstudent" | "remarks">("dashboard");
  const [selectedClass, setSelectedClass] = useState("8");
  const [selectedSection, setSelectedSection] = useState("A");
  const [students, setStudents] = useState<Student[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Student creation form state
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    parentEmail: "",
    phone: "",
    class: "8",
    section: "A",
    image: ""
  });

  // Classes and Sections as per your requirement
  const subjects = [
    "Mathematics", "Science", "Physics", "Chemistry", "Biology", 
    "English Literature", "Hindi", "History", "Geography", "Civics/Political Science",
    "Economics", "Computer Science", "Information Technology", "Physical Education", 
    "Arts & Crafts", "Music", "Dance", "Drawing & Painting", "Home Science",
    "Agriculture", "Commerce", "Accountancy", "Business Studies", "Psychology",
    "Sociology", "Philosophy", "Sanskrit", "Urdu", "French", "German", "Spanish"
  ];
  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D", "E"];

  // Homework form state
  const [homeworkForm, setHomeworkForm] = useState({
    title: "",
    description: "",
    subject: "",
    class: "8",
    section: "A",
    dueDate: "",
    attachments: [] as string[]
  });

  // Remarks form state
  const [remarksForm, setRemarksForm] = useState({
    studentId: "",
    type: "good" as "good" | "bad",
    message: "",
    subject: ""
  });

  // Current attendance state
  const [currentAttendance, setCurrentAttendance] = useState<{[key: string]: 'present' | 'absent' | 'late'}>({});
  const [attendanceRemarks, setAttendanceRemarks] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("teacherAuth");
    const email = localStorage.getItem("teacherEmail");
    const name = localStorage.getItem("teacherName");
    const subject = localStorage.getItem("teacherSubject");
    
    if (!isAuth || isAuth !== "true") {
      // For testing - set default credentials
      localStorage.setItem("teacherAuth", "true");
      localStorage.setItem("teacherEmail", "teacher@royalacademy.edu");
      localStorage.setItem("teacherName", "John Smith");
      localStorage.setItem("teacherSubject", "Mathematics");
      setTeacherEmail("teacher@royalacademy.edu");
      setTeacherName("John Smith");
      setTeacherSubject("Mathematics");
      return;
    }

    if (email) setTeacherEmail(email);
    if (name) setTeacherName(name);
    if (subject) setTeacherSubject(subject);

    // Load data from localStorage
    loadData();
  }, []);

  const loadData = () => {
    const savedStudents = localStorage.getItem('royal-academy-students');
    const savedHomework = localStorage.getItem('royal-academy-homework');
    const savedAttendance = localStorage.getItem('royal-academy-attendance');

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedHomework) setHomework(JSON.parse(savedHomework));
    if (savedAttendance) setAttendanceRecords(JSON.parse(savedAttendance));
  };

  const saveData = () => {
    localStorage.setItem('royal-academy-students', JSON.stringify(students));
    localStorage.setItem('royal-academy-homework', JSON.stringify(homework));
    localStorage.setItem('royal-academy-attendance', JSON.stringify(attendanceRecords));
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherAuth");
    localStorage.removeItem("teacherEmail");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherSubject");
    navigate("/");
  };

  // Image upload handler
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (files: FileList | null, type: 'homework' | 'student') => {
    if (!files) return;
    
    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await convertToBase64(file);
          newImages.push(base64);
        } catch (error) {
          console.error('Error converting image:', error);
        }
      }
    }
    
    if (type === 'homework') {
      setHomeworkForm(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newImages]
      }));
    } else if (type === 'student') {
      setStudentForm(prev => ({
        ...prev,
        image: newImages[0] || prev.image
      }));
    }
  };

  // Create homework
  const handleCreateHomework = () => {
    const newHomework: Homework = {
      id: Date.now().toString(),
      ...homeworkForm,
      subject: teacherSubject,
      createdAt: new Date().toISOString(),
      createdBy: teacherName
    };

    const updatedHomework = [...homework, newHomework];
    setHomework(updatedHomework);
    localStorage.setItem('royal-academy-homework', JSON.stringify(updatedHomework));
    
    // Send notification to students (simulate)
    alert(`Homework "${newHomework.title}" has been sent to Class ${newHomework.class}-${newHomework.section} students!`);
    
    setShowHomeworkModal(false);
    setHomeworkForm({
      title: "",
      description: "",
      subject: "",
      class: "8",
      section: "A",
      dueDate: "",
      attachments: []
    });
  };

  // Handle student creation
  const handleCreateStudent = async () => {
    // Validation
    if (!studentForm.fullName || !studentForm.email || !studentForm.rollNumber || !studentForm.class || !studentForm.section) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const studentId = `STU${Date.now().toString().slice(-6)}`;
      const defaultPassword = `${studentForm.fullName.split(' ')[0].toLowerCase()}123`;
      
      const newStudent: Student = {
        id: studentId,
        name: studentForm.fullName,
        rollNumber: studentForm.rollNumber,
        class: studentForm.class,
        section: studentForm.section,
        email: studentForm.email,
        parentEmail: studentForm.parentEmail,
        phone: studentForm.phone,
        image: studentForm.image || "/placeholder-student.jpg",
        attendance: [],
        remarks: []
      };

      // Save to localStorage
      const existingStudents: Student[] = JSON.parse(localStorage.getItem('royal-academy-students') || '[]');
      localStorage.setItem('royal-academy-students', JSON.stringify([...existingStudents, newStudent]));
      
      // Also save to auth students for login
      const existingAuthStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
      const authStudent = { 
        ...newStudent, 
        username: studentForm.fullName, 
        studentId, 
        type: 'student',
        password: defaultPassword,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('royal-academy-auth-students', JSON.stringify([...existingAuthStudents, authStudent]));

      alert(`Student account created successfully!\n\nLogin Credentials:\nEmail: ${studentForm.email}\nPassword: ${defaultPassword}\nStudent ID: ${studentId}`);
      
      setStudents(prev => [...prev, newStudent]);
      setActiveSection('students');
      setStudentForm({
        fullName: "",
        email: "",
        rollNumber: "",
        parentEmail: "",
        phone: "",
        class: "8",
        section: "A",
        image: ""
      });
    } catch (error) {
      alert("Failed to create student account. Please try again.");
      console.error("Error creating student:", error);
    }
  };


  // Take attendance
  const handleTakeAttendance = () => {
    const classStudents = students.filter(s => s.class === selectedClass && s.section === selectedSection);
    
    const attendanceRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      class: selectedClass,
      section: selectedSection,
      students: classStudents.map(student => ({
        studentId: student.id,
        status: currentAttendance[student.id] || 'present',
        remarks: attendanceRemarks[student.id] || ''
      })),
      teacherId: teacherEmail
    };

    const updatedAttendance = [...attendanceRecords, attendanceRecord];
    setAttendanceRecords(updatedAttendance);
    localStorage.setItem('royal-academy-attendance', JSON.stringify(updatedAttendance));
    
    // Update student attendance records
    const updatedStudents = students.map(student => {
      if (student.class === selectedClass && student.section === selectedSection) {
        return {
          ...student,
          attendance: [...student.attendance, {
            date: attendanceRecord.date,
            status: currentAttendance[student.id] || 'present',
            remarks: attendanceRemarks[student.id] || ''
          }]
        };
      }
      return student;
    });
    
    setStudents(updatedStudents);
    localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
    
    alert(`Attendance taken for Class ${selectedClass}-${selectedSection}!`);
    setShowAttendanceModal(false);
    setCurrentAttendance({});
    setAttendanceRemarks({});
  };

  // Add remarks
  const handleAddRemarks = () => {
    if (!selectedStudent) return;

    const newRemark = {
      date: new Date().toISOString().split('T')[0],
      type: remarksForm.type,
      message: remarksForm.message,
      subject: teacherSubject
    };

    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        return {
          ...student,
          remarks: [...student.remarks, newRemark]
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
    
    alert(`${remarksForm.type === 'good' ? 'Good' : 'Bad'} remark added for ${selectedStudent.name}!`);
    
    setShowRemarksModal(false);
    setRemarksForm({
      studentId: "",
      type: "good",
      message: "",
      subject: ""
    });
    setSelectedStudent(null);
  };

  const getClassStudents = () => {
    return students.filter(s => s.class === selectedClass && s.section === selectedSection);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">Teacher Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {teacherName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{teacherName}</p>
                <p className="text-xs text-muted-foreground">{teacherSubject} Teacher</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-6">
        {/* Dashboard Overview */}
        {activeSection === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{students.length}</p>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{homework.length}</p>
                    <p className="text-sm text-muted-foreground">Homework Assigned</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{attendanceRecords.length}</p>
                    <p className="text-sm text-muted-foreground">Attendance Records</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{classes.length}</p>
                    <p className="text-sm text-muted-foreground">Classes Available</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50"
            >
              <h2 className="text-lg font-heading font-bold text-foreground mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[
                  { title: "Send Homework", desc: "Assign homework with photos", icon: BookOpen, action: () => setActiveSection("homework") },
                  { title: "Take Attendance", desc: "Mark student attendance", icon: CheckCircle, action: () => setActiveSection("attendance") },
                  { title: "Create Student ID", desc: "Register new students", icon: UserPlus, action: () => setActiveSection("createstudent") },
                  { title: "View Students", desc: "Manage student records", icon: Users, action: () => setActiveSection("students") },
                  { title: "Add Remarks", desc: "Give good/bad remarks", icon: MessageSquare, action: () => setActiveSection("remarks") }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    onClick={item.action}
                    className="p-4 rounded-lg border border-border/30 hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <item.icon className="h-8 w-8 text-gold mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-foreground mb-1 text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-tight">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50"
            >
              <h2 className="text-lg font-heading font-bold text-foreground mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {homework.slice(-3).map((hw, index) => (
                  <div key={hw.id} className="flex items-center space-x-4 p-3 bg-muted/20 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{hw.title}</p>
                      <p className="text-sm text-muted-foreground">Class {hw.class}-{hw.section} • Due: {hw.dueDate}</p>
                    </div>
                  </div>
                ))}
                {homework.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No recent homework assigned</p>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "homework", label: "Homework", icon: BookOpen },
            { id: "attendance", label: "Attendance", icon: CheckCircle },
            { id: "students", label: "Students", icon: Users },
            { id: "createstudent", label: "Create Student", icon: UserPlus },
            { id: "remarks", label: "Remarks", icon: MessageSquare }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeSection === tab.id ? "default" : "outline"}
              onClick={() => setActiveSection(tab.id as any)}
              size="sm"
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Homework Section */}
        {activeSection === "homework" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-foreground">Homework Management</h2>
              <Button
                onClick={() => setShowHomeworkModal(true)}
                className="bg-gradient-to-r from-gold to-yellow-500 text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Homework
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homework.map((hw) => (
                <motion.div
                  key={hw.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-foreground">{hw.title}</h3>
                    <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">
                      {hw.class}-{hw.section}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{hw.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Due: {hw.dueDate}</span>
                    <span>{hw.attachments.length} attachments</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Other sections would continue here... */}
      </div>

      {/* Homework Modal */}
      {showHomeworkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-heading font-bold">Create Homework</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowHomeworkModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={homeworkForm.title}
                    onChange={(e) => setHomeworkForm({...homeworkForm, title: e.target.value})}
                    placeholder="Enter homework title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={homeworkForm.description}
                    onChange={(e) => setHomeworkForm({...homeworkForm, description: e.target.value})}
                    placeholder="Enter homework description"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Class *</label>
                    <select
                      value={homeworkForm.class}
                      onChange={(e) => setHomeworkForm({...homeworkForm, class: e.target.value})}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    >
                      {classes.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Section *</label>
                    <select
                      value={homeworkForm.section}
                      onChange={(e) => setHomeworkForm({...homeworkForm, section: e.target.value})}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    >
                      {sections.map(sec => (
                        <option key={sec} value={sec}>Section {sec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Due Date *</label>
                  <Input
                    type="date"
                    value={homeworkForm.dueDate}
                    onChange={(e) => setHomeworkForm({...homeworkForm, dueDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Attach Photos</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files, 'homework')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photos ({homeworkForm.attachments.length})
                  </Button>
                </div>

                {homeworkForm.attachments.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {homeworkForm.attachments.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowHomeworkModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateHomework}
                className="bg-gradient-to-r from-gold to-yellow-500 text-black"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Homework
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Student Section */}
      {activeSection === "createstudent" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground">Create Student ID</h2>
                <p className="text-sm text-muted-foreground">Register new students and generate login credentials</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm({...studentForm, fullName: e.target.value})}
                    placeholder="Enter student's full name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                    placeholder="Enter student's email"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Roll Number *</label>
                  <Input
                    value={studentForm.rollNumber}
                    onChange={(e) => setStudentForm({...studentForm, rollNumber: e.target.value})}
                    placeholder="Enter roll number"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Parent Email</label>
                  <Input
                    type="email"
                    value={studentForm.parentEmail}
                    onChange={(e) => setStudentForm({...studentForm, parentEmail: e.target.value})}
                    placeholder="Enter parent's email"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Class & Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Class *</label>
                    <select
                      value={studentForm.class}
                      onChange={(e) => setStudentForm({...studentForm, class: e.target.value})}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    >
                      {classes.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Section *</label>
                    <select
                      value={studentForm.section}
                      onChange={(e) => setStudentForm({...studentForm, section: e.target.value})}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    >
                      {sections.map(sec => (
                        <option key={sec} value={sec}>Section {sec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password Information */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-4 w-4 text-blue-400" />
                    <h4 className="text-sm font-semibold text-blue-400">Password Information</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Student passwords are automatically generated using the format: firstname123
                    (e.g., john123). Login credentials will be displayed after account creation.
                  </p>
                </div>

                {/* Create Button */}
                <Button
                  onClick={handleCreateStudent}
                  className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold py-3"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Student Account
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* View Students Section */}
      {activeSection === "students" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground">View Students</h2>
                <p className="text-sm text-muted-foreground">Manage student records and information</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Class and Section Selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {sections.map(sec => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getClassStudents().length > 0 ? (
                getClassStudents().map((student) => (
                  <div key={student.id} className="bg-muted/20 rounded-lg p-4 border border-border/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                        <span className="text-black font-semibold text-sm">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Email:</span> {student.email}</p>
                      <p><span className="text-muted-foreground">Class:</span> {student.class}-{student.section}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {student.phone}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No students found in Class {selectedClass}-{selectedSection}
                </div>
              )}
            </div>

            {/* Add Student Button */}
            <div className="text-center mt-6">
              <Button
                onClick={() => setActiveSection("createstudent")}
                className="bg-gradient-to-r from-gold to-yellow-500 text-black"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Attendance Section */}
      {activeSection === "attendance" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground">Take Attendance</h2>
                <p className="text-sm text-muted-foreground">Mark student attendance for today</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Class and Section Selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {sections.map(sec => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attendance List */}
            <div className="space-y-3">
              {getClassStudents().length > 0 ? (
                <>
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  {getClassStudents().map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                          <span className="text-black font-semibold text-xs">
                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={currentAttendance[student.id] === 'present' ? 'default' : 'outline'}
                          onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: 'present' }))}
                          className="text-xs"
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={currentAttendance[student.id] === 'absent' ? 'destructive' : 'outline'}
                          onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: 'absent' }))}
                          className="text-xs"
                        >
                          Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={currentAttendance[student.id] === 'late' ? 'secondary' : 'outline'}
                          onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: 'late' }))}
                          className="text-xs"
                        >
                          Late
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-6">
                    <Button
                      onClick={handleTakeAttendance}
                      className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Attendance
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No students found in Class {selectedClass}-{selectedSection}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Remarks Section */}
      {activeSection === "remarks" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground">Add Remarks</h2>
                <p className="text-sm text-muted-foreground">Give positive or constructive feedback to students</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Remarks Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    {sections.map(sec => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Student</label>
                <select
                  value={remarksForm.studentId}
                  onChange={(e) => setRemarksForm({...remarksForm, studentId: e.target.value})}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  <option value="">Choose a student...</option>
                  {getClassStudents().map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} (Roll: {student.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Remark Type</label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={remarksForm.type === 'good' ? 'default' : 'outline'}
                    onClick={() => setRemarksForm({...remarksForm, type: 'good'})}
                    className="flex items-center space-x-2"
                  >
                    <Star className="h-4 w-4" />
                    <span>Positive</span>
                  </Button>
                  <Button
                    type="button"
                    variant={remarksForm.type === 'bad' ? 'destructive' : 'outline'}
                    onClick={() => setRemarksForm({...remarksForm, type: 'bad'})}
                    className="flex items-center space-x-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Needs Improvement</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  value={remarksForm.subject}
                  onChange={(e) => setRemarksForm({...remarksForm, subject: e.target.value})}
                  placeholder="e.g., Mathematics, Behavior, Homework"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={remarksForm.message}
                  onChange={(e) => setRemarksForm({...remarksForm, message: e.target.value})}
                  placeholder="Enter your remark or feedback..."
                  rows={4}
                />
              </div>

              <div className="text-center">
                <Button
                  onClick={() => {
                    if (!remarksForm.studentId || !remarksForm.message) {
                      alert('Please select a student and enter a message');
                      return;
                    }
                    alert('Remark added successfully!');
                    setRemarksForm({ studentId: "", type: "good", message: "", subject: "" });
                  }}
                  className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Remark
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherDashboard;
