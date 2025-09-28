import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  LogOut, 
  BookOpen, 
  Calendar, 
  User, 
  Bell,
  Trophy,
  Clock,
  FileText,
  BarChart3,
  Settings,
  Home,
  Users,
  Award,
  X,
  CheckCircle,
  UserPlus,
  Star,
  AlertCircle,
  MessageSquare,
  Send,
  Eye,
  Trash2,
  Edit,
  Plus,
  Shield,
  Camera,
  Lock,
  Download,
  Upload,
  Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StudentManager from "@/components/StudentManager";

interface Student {
  id: string;
  name: string;
  fullName?: string;
  rollNumber: string;
  class: string;
  section: string;
  email: string;
  parentEmail: string;
  phone: string;
  image: string;
  status?: 'active' | 'banned';
  attendance: {
    date: string;
    status: 'present' | 'absent' | 'late';
    remarks?: string;
  }[];
  remarks: {
    id?: string;
    date: string;
    type: 'good' | 'bad';
    message: string;
    subject: string;
    image?: string; // For backward compatibility
    images?: string[]; // New multiple images support
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

interface StudentReport {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  reportImage: string;
  notes: string;
  createdAt: string;
  class: string;
  section: string;
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
  const [activeSection, setActiveSection] = useState<"dashboard" | "homework" | "attendance" | "students" | "createstudent" | "remarks" | "studentreport" | "profile">("dashboard");
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [reportForm, setReportForm] = useState({
    reportImage: "",
    notes: "",
    subject: ""
  });
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [attendanceView, setAttendanceView] = useState<'today' | 'calendar' | 'holidays' | 'editday'>('today');
  const [holidays, setHolidays] = useState<string[]>([]);
  const [newHoliday, setNewHoliday] = useState('');
  const [selectedEditDate, setSelectedEditDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportImageInputRef = useRef<HTMLInputElement>(null);
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
    subject: "",
    images: [] as string[]
  });
  const [editingRemark, setEditingRemark] = useState<any>(null);
  const [editingRemarkIndex, setEditingRemarkIndex] = useState<number>(-1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, title: string} | null>(null);
  
  // Profile state
  const [teacherProfile, setTeacherProfile] = useState({
    name: teacherName,
    photo: "",
    bio: "",
    phone: "",
    qualification: ""
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
    // Load data from localStorage
    const storedStudents = localStorage.getItem('royal-academy-students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }

    const storedHomework = localStorage.getItem('royal-academy-homework');
    if (storedHomework) {
      setHomework(JSON.parse(storedHomework));
    }

    const storedAttendance = localStorage.getItem('royal-academy-attendance');
    if (storedAttendance) {
      setAttendanceRecords(JSON.parse(storedAttendance));
    }

    const storedReports = localStorage.getItem('royal-academy-student-reports');
    if (storedReports) {
      setStudentReports(JSON.parse(storedReports));
    }

    // Load holidays from localStorage
    const storedHolidays = localStorage.getItem('royal-academy-holidays');
    if (storedHolidays) {
      setHolidays(JSON.parse(storedHolidays));
    }

    // Load teacher profile
    const storedProfile = localStorage.getItem(`teacher-profile-${teacherEmail}`);
    if (storedProfile) {
      setTeacherProfile(JSON.parse(storedProfile));
    }
  }, [navigate, teacherEmail]);

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

  // Create or update homework
  const handleCreateHomework = () => {
    if (editingHomework) {
      // Update existing homework
      const updatedHomework = homework.map(hw => 
        hw.id === editingHomework.id 
          ? {
              ...hw,
              ...homeworkForm,
              subject: teacherSubject,
              createdBy: teacherName
            }
          : hw
      );
      setHomework(updatedHomework);
      localStorage.setItem('royal-academy-homework', JSON.stringify(updatedHomework));
      alert(`Homework "${homeworkForm.title}" updated successfully!`);
    } else {
      // Create new homework
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
      alert(`Homework "${newHomework.title}" has been sent to Class ${newHomework.class}-${newHomework.section} students!`);
    }
    
    setShowHomeworkModal(false);
    setEditingHomework(null);
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

  // Handle editing homework
  const handleEditHomework = (hw: Homework) => {
    setEditingHomework(hw);
    setHomeworkForm({
      title: hw.title,
      description: hw.description,
      subject: hw.subject,
      class: hw.class,
      section: hw.section,
      dueDate: hw.dueDate,
      attachments: hw.attachments
    });
    setShowHomeworkModal(true);
  };

  // Handle deleting homework
  const handleDeleteHomework = (homeworkId: string) => {
    if (confirm('Are you sure you want to delete this homework? This action cannot be undone.')) {
      const updatedHomework = homework.filter(hw => hw.id !== homeworkId);
      setHomework(updatedHomework);
      localStorage.setItem('royal-academy-homework', JSON.stringify(updatedHomework));
      alert('Homework deleted successfully!');
    }
  };

  // Handle student creation/editing
  const handleCreateStudent = async () => {
    // Validation
    if (!studentForm.fullName || !studentForm.email || !studentForm.rollNumber || !studentForm.class || !studentForm.section) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingStudentId) {
        // Edit existing student
        const updatedStudents = students.map(student => 
          student.id === editingStudentId 
            ? {
                ...student,
                name: studentForm.fullName,
                rollNumber: studentForm.rollNumber,
                class: studentForm.class,
                section: studentForm.section,
                email: studentForm.email,
                parentEmail: studentForm.parentEmail,
                phone: studentForm.phone,
                image: studentForm.image || student.image
              }
            : student
        );
        
        setStudents(updatedStudents);
        localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
        
        // Also update auth students
        const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
        const updatedAuthStudents = authStudents.map((s: any) => 
          s.studentId === editingStudentId 
            ? {
                ...s,
                username: studentForm.fullName,
                email: studentForm.email,
                name: studentForm.fullName,
                rollNumber: studentForm.rollNumber,
                class: studentForm.class,
                section: studentForm.section,
                parentEmail: studentForm.parentEmail,
                phone: studentForm.phone
              }
            : s
        );
        localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
        
        alert('Student updated successfully!');
        setEditingStudentId(null);
      } else {
        // Create new student
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
          status: 'active',
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
      }
      
      setActiveSection('students');
      setStudentForm({
        fullName: "",
        email: "",
        rollNumber: "",
        parentEmail: "",
        phone: "",
        class: "1",
        section: "A",
        image: ""
      });
    } catch (error) {
      alert(`Failed to ${editingStudentId ? 'update' : 'create'} student account. Please try again.`);
      console.error(`Error ${editingStudentId ? 'updating' : 'creating'} student:`, error);
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
    
    // Also update auth students for student dashboard access
    const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
    const updatedAuthStudents = authStudents.map((authStudent: any) => {
      const matchingStudent = updatedStudents.find(s => s.id === authStudent.studentId || s.email === authStudent.email);
      if (matchingStudent) {
        return {
          ...authStudent,
          attendance: matchingStudent.attendance
        };
      }
      return authStudent;
    });
    localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
    
    alert(`Attendance taken for Class ${selectedClass}-${selectedSection}!`);
    setCurrentAttendance({});
    setAttendanceRemarks({});
  };

  // Handle editing attendance for any specific day
  const handleEditDayAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'remove') => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        let updatedAttendance = [...(student.attendance || [])];
        
        // Find existing attendance record for this date
        const existingIndex = updatedAttendance.findIndex(a => a.date === selectedEditDate);
        
        if (status === 'remove') {
          // Remove attendance record
          if (existingIndex !== -1) {
            updatedAttendance.splice(existingIndex, 1);
          }
        } else {
          // Add or update attendance record
          const attendanceRecord = {
            date: selectedEditDate,
            status: status,
            remarks: ''
          };
          
          if (existingIndex !== -1) {
            // Update existing record
            updatedAttendance[existingIndex] = attendanceRecord;
          } else {
            // Add new record
            updatedAttendance.push(attendanceRecord);
          }
        }
        
        return {
          ...student,
          attendance: updatedAttendance
        };
      }
      return student;
    });
    
    setStudents(updatedStudents);
    localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
    
    // Also update auth students for student dashboard access
    const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
    const updatedAuthStudents = authStudents.map((authStudent: any) => {
      const matchingStudent = updatedStudents.find(s => s.id === authStudent.studentId || s.email === authStudent.email);
      if (matchingStudent) {
        return {
          ...authStudent,
          attendance: matchingStudent.attendance
        };
      }
      return authStudent;
    });
    localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
    
    // Show success message
    const studentName = students.find(s => s.id === studentId)?.name || 'Student';
    const dateStr = new Date(selectedEditDate).toLocaleDateString();
    
    if (status === 'remove') {
      alert(`Attendance removed for ${studentName} on ${dateStr}`);
    } else {
      alert(`${studentName} marked as ${status} for ${dateStr}`);
    }
  };

  // Add or update remarks
  const handleAddRemarks = () => {
    if (!remarksForm.studentId || !remarksForm.message) {
      alert('Please select a student and enter a message');
      return;
    }

    const targetStudent = students.find(s => s.id === remarksForm.studentId);
    if (!targetStudent) {
      alert('Student not found in teacher\'s student list');
      return;
    }
    

    const remarkData = {
      id: editingRemark ? editingRemark.id : Date.now().toString(),
      date: editingRemark ? editingRemark.date : new Date().toISOString().split('T')[0],
      type: remarksForm.type,
      message: remarksForm.message,
      subject: remarksForm.subject || teacherSubject,
      images: remarksForm.images || []
    };

    const updatedStudents = students.map(student => {
      if (student.id === targetStudent.id) {
        let updatedRemarks = [...(student.remarks || [])];
        
        if (editingRemark && editingRemarkIndex >= 0) {
          // Update existing remark
          updatedRemarks[editingRemarkIndex] = remarkData;
        } else {
          // Add new remark
          updatedRemarks.push(remarkData);
        }
        
        return {
          ...student,
          remarks: updatedRemarks
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
    
    // Also update auth students for student dashboard access
    const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
    console.log('Updating auth students for remarks sync...');
    console.log('Target student:', targetStudent);
    console.log('Current auth students:', authStudents);
    
    // Find and update the auth student record
    let authStudentUpdated = false;
    const updatedAuthStudents = authStudents.map((authStudent: any) => {
      // Check multiple matching criteria with more comprehensive matching
      const isMatch = 
        authStudent.studentId === targetStudent.id ||
        authStudent.id === targetStudent.id ||
        authStudent.email === targetStudent.email ||
        authStudent.name === targetStudent.name ||
        authStudent.fullName === targetStudent.name ||
        authStudent.name === targetStudent.fullName ||
        authStudent.rollNumber === targetStudent.rollNumber;
        
      if (isMatch) {
        console.log('Found matching auth student, updating remarks...');
        authStudentUpdated = true;
        return {
          ...authStudent,
          remarks: updatedStudents.find(s => s.id === targetStudent.id)?.remarks || []
        };
      }
      return authStudent;
    });
    
    // If no auth student was found, create one
    if (!authStudentUpdated) {
      console.log('No matching auth student found, creating new one...');
      const newAuthStudent = {
        id: targetStudent.id,
        studentId: targetStudent.id,
        email: targetStudent.email,
        name: targetStudent.name,
        fullName: targetStudent.name,
        class: targetStudent.class,
        section: targetStudent.section,
        rollNumber: targetStudent.rollNumber,
        remarks: updatedStudents.find(s => s.id === targetStudent.id)?.remarks || []
      };
      updatedAuthStudents.push(newAuthStudent);
      console.log('Created new auth student:', newAuthStudent);
    }
    
    localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
    console.log('Updated auth students saved:', updatedAuthStudents);
    
    alert(`${remarksForm.type === 'good' ? 'Good' : 'Bad'} remark ${editingRemark ? 'updated' : 'added'} for ${targetStudent.name}!`);
    
    setShowRemarksModal(false);
    setEditingRemark(null);
    setEditingRemarkIndex(-1);
    setRemarksForm({
      studentId: "",
      type: "good",
      message: "",
      subject: "",
      images: []
    });
  };

  // Edit remark
  const handleEditRemark = (remark: any, index: number, studentId: string) => {
    setEditingRemark(remark);
    setEditingRemarkIndex(index);
    setRemarksForm({
      studentId: studentId,
      type: remark.type,
      message: remark.message,
      subject: remark.subject,
      images: remark.images || remark.image ? [remark.image] : [] // Handle backward compatibility
    });
  };

  // Delete remark
  const handleDeleteRemark = (index: number, studentId: string) => {
    if (confirm('Are you sure you want to delete this remark?')) {
      const updatedStudents = students.map(student => {
        if (student.id === studentId) {
          const updatedRemarks = (student.remarks || []).filter((_, i) => i !== index);
          return {
            ...student,
            remarks: updatedRemarks
          };
        }
        return student;
      });

      setStudents(updatedStudents);
      localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
      
      // Also update auth students with comprehensive matching
      const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
      const updatedAuthStudents = authStudents.map((authStudent: any) => {
        const matchingStudent = updatedStudents.find(s => 
          s.id === authStudent.studentId || 
          s.id === authStudent.id ||
          s.email === authStudent.email ||
          s.name === authStudent.name ||
          s.rollNumber === authStudent.rollNumber
        );
        if (matchingStudent) {
          console.log('Updating auth student remarks after deletion:', authStudent);
          return {
            ...authStudent,
            remarks: matchingStudent.remarks
          };
        }
        return authStudent;
      });
      localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
      console.log('Auth students updated after remark deletion:', updatedAuthStudents);
      
      alert('Remark deleted successfully!');
    }
  };

  const getClassStudents = () => {
    return students.filter(s => s.class === selectedClass && s.section === selectedSection);
  };

  // Handle report image upload
  const handleReportImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setReportForm({ ...reportForm, reportImage: base64 });
      } catch (error) {
        alert('Error uploading image. Please try again.');
      }
    }
  };

  // Send report to student
  const handleSendReport = () => {
    if (!selectedStudentForReport || !reportForm.reportImage || !reportForm.notes) {
      alert('Please select a student, upload an image, and add notes');
      return;
    }

    const newReport: StudentReport = {
      id: Date.now().toString(),
      studentId: selectedStudentForReport.id,
      studentName: selectedStudentForReport.name,
      teacherId: teacherEmail,
      teacherName: teacherName,
      subject: reportForm.subject || teacherSubject,
      reportImage: reportForm.reportImage,
      notes: reportForm.notes,
      createdAt: new Date().toISOString(),
      class: selectedStudentForReport.class,
      section: selectedStudentForReport.section
    };

    const updatedReports = [...studentReports, newReport];
    setStudentReports(updatedReports);
    localStorage.setItem('royal-academy-student-reports', JSON.stringify(updatedReports));

    alert(`Report sent to ${selectedStudentForReport.name} successfully!`);
    
    // Reset form
    setReportForm({ reportImage: "", notes: "", subject: "" });
    setSelectedStudentForReport(null);
    setShowReportModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {teacherProfile.photo ? (
                  <img
                    src={teacherProfile.photo}
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover border-2 border-gold"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-black" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">{teacherProfile.name || teacherName}</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {teacherProfile.name || teacherName}</p>
              </div>
            </div>
            
            {/* Website Navigation */}
            <div className="hidden lg:flex items-center space-x-6 mr-6">
              <button
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                About
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Courses
              </button>
              <button
                onClick={() => navigate('/admissions')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Admissions
              </button>
              <button
                onClick={() => navigate('/gallery')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Gallery
              </button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { title: "Send Homework", desc: "Assign homework with photos", icon: BookOpen, action: () => setActiveSection("homework") },
                  { title: "Take Attendance", desc: "Mark student attendance", icon: CheckCircle, action: () => setActiveSection("attendance") },
                  { title: "Create Student ID", desc: "Register new students", icon: UserPlus, action: () => setActiveSection("createstudent") },
                  { title: "View Students", desc: "Manage student records", icon: Users, action: () => setActiveSection("students") },
                  { title: "Add Remarks", desc: "Give good/bad remarks", icon: MessageSquare, action: () => setActiveSection("remarks") },
                  { title: "View Teachers", desc: "Manage all teachers", icon: Users, action: () => navigate('/manage-teachers') },
                  { title: "Profile", desc: "Manage your profile", icon: User, action: () => setActiveSection("profile") }
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
            { id: "remarks", label: "Remarks", icon: MessageSquare },
            { id: "studentreport", label: "Student Report", icon: FileText }
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
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>Due: {hw.dueDate}</span>
                    <span>{hw.attachments.length} attachments</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2 border-t border-border/30">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditHomework(hw)}
                      className="flex-1 text-xs"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteHomework(hw.id)}
                      className="flex-1 text-xs"
                    >
                      🗑️ Delete
                    </Button>
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
              <h3 className="text-xl font-heading font-bold">
                {editingHomework ? 'Edit Homework' : 'Create Homework'}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowHomeworkModal(false);
                setEditingHomework(null);
              }}>
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
                {editingHomework ? 'Update Homework' : 'Send Homework'}
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
                    <div className="space-y-1 text-sm mb-3">
                      <p><span className="text-muted-foreground">Email:</span> {student.email}</p>
                      <p><span className="text-muted-foreground">Class:</span> {student.class}-{student.section}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {student.phone}</p>
                      <div className="flex items-center justify-between">
                        <p><span className="text-muted-foreground">ID:</span> {student.id}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(student.id);
                            alert('Student ID copied to clipboard!');
                          }}
                          title="Copy Student ID"
                          className="h-6 px-2 text-xs"
                        >
                          Copy ID
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.status === 'banned' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                            : 'bg-green-500/10 text-green-400 border border-green-500/30'
                        }`}>
                          {student.status === 'banned' ? 'Banned' : 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedStudents = students.map(s => 
                            s.id === student.id 
                              ? { ...s, status: (s.status === 'banned' ? 'active' : 'banned') as 'active' | 'banned' }
                              : s
                          );
                          setStudents(updatedStudents);
                          localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
                          
                          // Also update auth students
                          const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
                          const updatedAuthStudents = authStudents.map((s: any) => 
                            s.studentId === student.id 
                              ? { ...s, status: s.status === 'banned' ? 'active' : 'banned' }
                              : s
                          );
                          localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
                          
                          alert(`Student ${student.status === 'banned' ? 'unbanned' : 'banned'} successfully!`);
                        }}
                        title={student.status === 'banned' ? 'Unban Student' : 'Ban Student'}
                        className={`h-6 px-2 text-xs ${
                          student.status === 'banned' 
                            ? 'text-green-600 hover:text-green-700' 
                            : 'text-red-600 hover:text-red-700'
                        }`}
                      >
                        {student.status === 'banned' ? 'Unban' : 'Ban'}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStudentForm({
                            fullName: student.name,
                            email: student.email,
                            rollNumber: student.rollNumber,
                            class: student.class,
                            section: student.section,
                            parentEmail: student.parentEmail || '',
                            phone: student.phone || '',
                            image: student.image || ''
                          });
                          setEditingStudentId(student.id);
                          setActiveSection('createstudent');
                        }}
                        title="Edit Student"
                        className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
                            const updatedStudents = students.filter(s => s.id !== student.id);
                            setStudents(updatedStudents);
                            localStorage.setItem('royal-academy-students', JSON.stringify(updatedStudents));
                            
                            // Also remove from auth students
                            const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
                            const updatedAuthStudents = authStudents.filter((s: any) => s.studentId !== student.id);
                            localStorage.setItem('royal-academy-auth-students', JSON.stringify(updatedAuthStudents));
                            
                            alert(`Student ${student.name} deleted successfully!`);
                          }
                        }}
                        title="Delete Student"
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
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

      {/* Enhanced Attendance Section */}
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
                <h2 className="text-xl font-heading font-bold text-foreground">Attendance Management</h2>
                <p className="text-sm text-muted-foreground">Mark attendance and manage holidays</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-border/50">
              <Button
                variant={attendanceView === 'today' ? 'default' : 'ghost'}
                onClick={() => setAttendanceView('today')}
                className="text-sm"
              >
                Today's Attendance
              </Button>
              <Button
                variant={attendanceView === 'editday' ? 'default' : 'ghost'}
                onClick={() => setAttendanceView('editday')}
                className="text-sm"
              >
                Edit Any Day
              </Button>
              <Button
                variant={attendanceView === 'calendar' ? 'default' : 'ghost'}
                onClick={() => setAttendanceView('calendar')}
                className="text-sm"
              >
                Attendance Calendar
              </Button>
              <Button
                variant={attendanceView === 'holidays' ? 'default' : 'ghost'}
                onClick={() => setAttendanceView('holidays')}
                className="text-sm"
              >
                Manage Holidays
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

            {/* Today's Attendance */}
            {attendanceView === 'today' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date().toLocaleDateString()} ({new Date().toLocaleDateString('en-US', { weekday: 'long' })})
                  </p>
                  {new Date().getDay() === 0 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      Sunday - Holiday
                    </span>
                  )}
                </div>
                
                {getClassStudents().length > 0 ? (
                  <>
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
                            onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: 'present' }))}
                            className={`text-xs ${
                              currentAttendance[student.id] === 'present' 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300'
                            }`}
                          >
                            ✓ Present
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: 'absent' }))}
                            className={`text-xs ${
                              currentAttendance[student.id] === 'absent' 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300'
                            }`}
                          >
                            ✗ Absent
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: 'late' }))}
                            className={`text-xs ${
                              currentAttendance[student.id] === 'late' 
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300'
                            }`}
                          >
                            ⏰ Late
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
            )}

            {/* Edit Any Day Attendance */}
            {attendanceView === 'editday' && (
              <div className="space-y-6">
                {/* Date Selector */}
                <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                  <h4 className="font-semibold mb-3 text-foreground">Select Date to Edit:</h4>
                  <div className="flex items-center space-x-4">
                    <input
                      type="date"
                      value={selectedEditDate}
                      onChange={(e) => setSelectedEditDate(e.target.value)}
                      className="p-3 border border-border rounded-lg bg-background"
                    />
                    <div className="text-sm text-muted-foreground">
                      {new Date(selectedEditDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>

                {/* Student List for Selected Date */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">
                      Edit Attendance for {new Date(selectedEditDate).toLocaleDateString()}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      Class {selectedClass}-{selectedSection}
                    </div>
                  </div>
                  
                  {getClassStudents().length > 0 ? (
                    <>
                      {getClassStudents().map((student) => {
                        // Get existing attendance for this date
                        const existingAttendance = student.attendance?.find(a => a.date === selectedEditDate);
                        const currentStatus = existingAttendance?.status || 'not-marked';
                        
                        return (
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
                              {existingAttendance && (
                                <div className="text-xs text-muted-foreground">
                                  Current: <span className={`font-medium ${
                                    currentStatus === 'present' ? 'text-green-600' :
                                    currentStatus === 'absent' ? 'text-red-600' :
                                    currentStatus === 'late' ? 'text-yellow-600' : 'text-gray-600'
                                  }`}>
                                    {currentStatus === 'not-marked' ? 'Not Marked' : currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditDayAttendance(student.id, 'present')}
                                className={`text-xs ${
                                  currentStatus === 'present' 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300'
                                }`}
                              >
                                ✓ Present
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditDayAttendance(student.id, 'absent')}
                                className={`text-xs ${
                                  currentStatus === 'absent' 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300'
                                }`}
                              >
                                ✗ Absent
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditDayAttendance(student.id, 'late')}
                                className={`text-xs ${
                                  currentStatus === 'late' 
                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300'
                                }`}
                              >
                                ⏰ Late
                              </Button>
                              {existingAttendance && (
                                <Button
                                  size="sm"
                                  onClick={() => handleEditDayAttendance(student.id, 'remove')}
                                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                                >
                                  ✕ Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No students found in Class {selectedClass}-{selectedSection}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attendance Calendar */}
            {attendanceView === 'calendar' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold mb-2">Attendance Calendar - {new Date().getFullYear()}</h3>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Present</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gray-400"></div>
                      <span className="ml-2">Not Updated</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Holiday</span>
                    </div>
                  </div>
                </div>
                
                {getClassStudents().length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-2 pr-4 sticky left-0 bg-card">Student</th>
                          {Array.from({ length: 30 }, (_, i) => (
                            <th key={i} className="text-center py-2 px-1 min-w-[24px]">
                              {i + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getClassStudents().map((student) => (
                          <tr key={student.id} className="border-b border-border/30">
                            <td className="py-2 pr-4 font-medium sticky left-0 bg-card">
                              {student.name}
                            </td>
                            {Array.from({ length: 30 }, (_, dayIndex) => {
                              const date = new Date();
                              date.setDate(dayIndex + 1);
                              const dateStr = date.toISOString().split('T')[0];
                              const isHoliday = date.getDay() === 0 || holidays.includes(dateStr);
                              const attendance = student.attendance?.find(a => a.date === dateStr);
                              
                              return (
                                <td key={dayIndex} className="text-center py-2 px-1">
                                  {isHoliday ? (
                                    <div className="w-4 h-4 bg-blue-500 rounded mx-auto" title="Holiday"></div>
                                  ) : attendance ? (
                                    attendance.status === 'present' ? (
                                      <div className="w-4 h-4 bg-green-500 rounded mx-auto" title="Present"></div>
                                    ) : attendance.status === 'absent' ? (
                                      <div className="w-4 h-4 bg-red-500 rounded-full mx-auto" title="Absent"></div>
                                    ) : (
                                      <div className="w-4 h-4 bg-yellow-500 rounded mx-auto" title="Late"></div>
                                    )
                                  ) : (
                                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gray-400 mx-auto" title="Not Updated"></div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No students found in Class {selectedClass}-{selectedSection}
                  </div>
                )}
              </div>
            )}

            {/* Holiday Management */}
            {attendanceView === 'holidays' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Manage Holidays</h3>
                  
                  {/* Add Holiday */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="date"
                      value={newHoliday}
                      onChange={(e) => setNewHoliday(e.target.value)}
                      className="flex-1 p-3 border border-border rounded-lg bg-background"
                    />
                    <Button
                      onClick={() => {
                        if (newHoliday && !holidays.includes(newHoliday)) {
                          const updatedHolidays = [...holidays, newHoliday];
                          setHolidays(updatedHolidays);
                          localStorage.setItem('royal-academy-holidays', JSON.stringify(updatedHolidays));
                          setNewHoliday('');
                          alert('Holiday added successfully!');
                        }
                      }}
                      className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                    >
                      Add Holiday
                    </Button>
                  </div>

                  {/* Holiday List */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Holidays:</h4>
                    {holidays.length > 0 ? (
                      <div className="grid gap-2">
                        {holidays.map((holiday, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30">
                            <span>{new Date(holiday).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updatedHolidays = holidays.filter((_, i) => i !== index);
                                setHolidays(updatedHolidays);
                                localStorage.setItem('royal-academy-holidays', JSON.stringify(updatedHolidays));
                                alert('Holiday removed successfully!');
                              }}
                              className="text-xs"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No holidays added yet.</p>
                    )}
                  </div>

                  {/* Default Sundays Note */}
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-sm text-blue-400">
                      📅 Note: All Sundays are automatically marked as holidays and will appear in blue on the calendar.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
                <h2 className="text-xl font-heading font-bold text-foreground">
                  {editingRemark ? 'Edit Remark | रिमार्क एडिट करें' : 'Add Remarks | रिमार्क जोड़ें'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {editingRemark 
                    ? 'Modify the selected remark | चुने गए रिमार्क को बदलें'
                    : 'Give positive or constructive feedback to students | छात्रों को सकारात्मक या रचनात्मक फीडबैक दें'
                  }
                </p>
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

              <div>
                <label className="block text-sm font-medium mb-2">Attach Images (Optional) - Max 6 Photos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      // Check if adding these files would exceed the limit
                      if (remarksForm.images.length + files.length > 6) {
                        alert('Maximum 6 images allowed per remark');
                        return;
                      }
                      
                      // Convert all files to base64
                      Promise.all(files.map(file => convertToBase64(file)))
                        .then(base64Images => {
                          setRemarksForm({
                            ...remarksForm, 
                            images: [...remarksForm.images, ...base64Images as string[]]
                          });
                        });
                    }
                  }}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                />
                
                {/* Image Preview Grid */}
                {remarksForm.images.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Attached Images ({remarksForm.images.length}/6)</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRemarksForm({...remarksForm, images: []})}
                      >
                        Remove All
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {remarksForm.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Remark attachment ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-border cursor-pointer"
                            onClick={() => {
                              setSelectedImage({
                                src: image,
                                title: `Remark Image ${index + 1}`
                              });
                              setShowImageModal(true);
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newImages = remarksForm.images.filter((_, i) => i !== index);
                              setRemarksForm({...remarksForm, images: newImages});
                            }}
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleAddRemarks}
                  className="bg-gradient-to-r from-gold to-yellow-500 text-black"
                  disabled={!remarksForm.studentId || !remarksForm.message}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {editingRemark ? 'Update Remark' : 'Add Remark'}
                </Button>
              </div>
            </div>

            {/* Existing Remarks Display */}
            {remarksForm.studentId && (() => {
              const currentStudent = students.find(s => s.id === remarksForm.studentId);
              return currentStudent && currentStudent.remarks && currentStudent.remarks.length > 0;
            })() && (
              <div className="mt-8 border-t border-border/30 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Existing Remarks for {students.find(s => s.id === remarksForm.studentId)?.name}</h3>
                  <Button
                    onClick={() => {
                      // Clear form for new remark
                      setEditingRemark(null);
                      setEditingRemarkIndex(-1);
                      setRemarksForm({
                        ...remarksForm,
                        type: "good",
                        message: "",
                        subject: "",
                        images: []
                      });
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Remark
                  </Button>
                </div>
                
                {/* Instructions */}
                <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-400 mb-2">📝 How to Edit Remarks | रिमार्क कैसे एडिट करें</h4>
                  <div className="text-sm text-blue-100 space-y-1">
                    <p><strong>English:</strong> Click the "✏️ Edit" button on any remark to modify it. Click "🗑️ Delete" to remove it permanently.</p>
                    <p><strong>हिंदी:</strong> किसी भी रिमार्क को बदलने के लिए "✏️ Edit" बटन पर क्लिक करें। इसे हमेशा के लिए हटाने के लिए "🗑️ Delete" पर क्लिक करें।</p>
                    <p><strong>English:</strong> You can add images to remarks and edit them later. Changes are saved automatically.</p>
                    <p><strong>हिंदी:</strong> आप रिमार्क में इमेज जोड़ सकते हैं और बाद में उन्हें एडिट कर सकते हैं। बदलाव अपने आप सेव हो जाते हैं।</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {students.find(s => s.id === remarksForm.studentId)?.remarks?.map((remark: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        remark.type === 'good' 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {remark.type === 'good' ? (
                            <Star className="h-4 w-4 text-green-400 fill-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`font-medium text-sm ${
                            remark.type === 'good' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {remark.type === 'good' ? 'Good Remark' : 'Area to Improve'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(remark.date).toLocaleDateString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRemark(remark, index, remarksForm.studentId)}
                            className="h-6 px-2 text-xs"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRemark(index, remarksForm.studentId)}
                            className="h-6 px-2 text-xs"
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-2 ${
                        remark.type === 'good' ? 'text-green-100' : 'text-red-100'
                      }`}>
                        {remark.message}
                      </p>
                      
                      {/* Multiple Images Display */}
                      {((remark.images && remark.images.length > 0) || remark.image) && (
                        <div className="mb-2">
                          <div className="grid grid-cols-3 gap-2">
                            {/* Handle both new images array and old single image for backward compatibility */}
                            {(remark.images || (remark.image ? [remark.image] : [])).map((image: string, imgIndex: number) => (
                              <div key={imgIndex} className="relative group">
                                <img
                                  src={image}
                                  alt={`Remark attachment ${imgIndex + 1}`}
                                  className="w-full h-20 object-cover rounded-lg border border-border cursor-pointer"
                                  onClick={() => {
                                    setSelectedImage({
                                      src: image,
                                      title: `Remark Image ${imgIndex + 1} - ${remark.subject || 'General'}`
                                    });
                                    setShowImageModal(true);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          {(remark.images?.length > 0 || remark.image) && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {remark.images?.length || 1} image{(remark.images?.length || 1) > 1 ? 's' : ''} attached
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Subject: {remark.subject || 'General'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Student Report Section */}
      {activeSection === "studentreport" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground">Student Report</h2>
                <p className="text-sm text-muted-foreground">Generate and view detailed student performance reports</p>
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

            {/* Student Report Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Class {selectedClass}-{selectedSection} Student Reports
                </h3>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                  onClick={() => {
                    const classStudents = getClassStudents();
                    if (classStudents.length === 0) {
                      alert('No students found in this class');
                      return;
                    }
                    alert(`Generating reports for ${classStudents.length} students...`);
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>Export All Reports</span>
                </Button>
              </div>

              {getClassStudents().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getClassStudents().map((student) => {
                    const attendanceRate = student.attendance.length > 0 
                      ? Math.round((student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100)
                      : 0;
                    const goodRemarks = student.remarks.filter(r => r.type === 'good').length;
                    const badRemarks = student.remarks.filter(r => r.type === 'bad').length;
                    
                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-muted/20 rounded-lg p-4 border border-border/30 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Attendance</span>
                            <span className={`text-sm font-medium ${
                              attendanceRate >= 90 ? 'text-green-500' :
                              attendanceRate >= 75 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {attendanceRate}%
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Good Remarks</span>
                            <span className="text-sm font-medium text-green-500">{goodRemarks}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Areas to Improve</span>
                            <span className="text-sm font-medium text-red-500">{badRemarks}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Overall Grade</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded ${
                              attendanceRate >= 90 && goodRemarks >= badRemarks ? 'bg-green-100 text-green-800' :
                              attendanceRate >= 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {attendanceRate >= 90 && goodRemarks >= badRemarks ? 'A' :
                               attendanceRate >= 75 ? 'B' : 'C'}
                            </span>
                          </div>
                        </div>

                        {/* Recent Remarks */}
                        {student.remarks.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-border/30">
                            <h5 className="text-xs font-medium text-muted-foreground mb-2">Recent Remarks</h5>
                            <div className="space-y-1">
                              {student.remarks.slice(-2).map((remark, idx) => (
                                <div key={idx} className="text-xs p-2 rounded bg-muted/30">
                                  <div className="flex items-center space-x-1 mb-1">
                                    {remark.type === 'good' ? (
                                      <Star className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-3 w-3 text-red-500" />
                                    )}
                                    <span className="font-medium">{remark.subject}</span>
                                  </div>
                                  <p className="text-muted-foreground">{remark.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => {
                              setSelectedStudentForReport(student);
                              setShowReportModal(true);
                            }}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Send Report
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => {
                              const studentReportsForThisStudent = studentReports.filter(r => r.studentId === student.id);
                              if (studentReportsForThisStudent.length === 0) {
                                alert('No reports sent to this student yet');
                              } else {
                                alert(`${studentReportsForThisStudent.length} report(s) sent to ${student.name}`);
                              }
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Sent
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No students found in Class {selectedClass}-{selectedSection}</p>
                  <p className="text-sm">Add students to generate reports</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Section */}
      {activeSection === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground">Profile Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your profile information and photo</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Photo Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Profile Photo</h3>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {teacherProfile.photo ? (
                      <img
                        src={teacherProfile.photo}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover border-4 border-gold"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                        <User className="h-16 w-16 text-black" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const base64 = await convertToBase64(file);
                            setTeacherProfile({ ...teacherProfile, photo: base64 as string });
                          }
                        };
                        input.click();
                      }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    
                    {teacherProfile.photo && (
                      <Button
                        variant="destructive"
                        onClick={() => setTeacherProfile({ ...teacherProfile, photo: "" })}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={teacherProfile.name}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={teacherProfile.phone}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Qualification</label>
                  <Input
                    value={teacherProfile.qualification}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, qualification: e.target.value })}
                    placeholder="e.g., M.Ed, B.Sc, Ph.D"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={teacherProfile.bio}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={() => {
                    localStorage.setItem(`teacher-profile-${teacherEmail}`, JSON.stringify(teacherProfile));
                    alert('Profile updated successfully!');
                  }}
                  className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black"
                >
                  <User className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Report Upload Modal */}
      {showReportModal && selectedStudentForReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md border border-border/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Send Report to {selectedStudentForReport.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedStudentForReport(null);
                  setReportForm({ reportImage: "", notes: "", subject: "" });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Subject Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  value={reportForm.subject}
                  onChange={(e) => setReportForm({ ...reportForm, subject: e.target.value })}
                  placeholder={`e.g., ${teacherSubject} or Behavior`}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Report Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  {reportForm.reportImage ? (
                    <div className="space-y-2">
                      <img
                        src={reportForm.reportImage}
                        alt="Report preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReportForm({ ...reportForm, reportImage: "" })}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload report image (test paper, assignment, etc.)
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => reportImageInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                      <input
                        ref={reportImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleReportImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes for Student</label>
                <Textarea
                  value={reportForm.notes}
                  onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                  placeholder="Add notes about the report, feedback, or instructions..."
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedStudentForReport(null);
                    setReportForm({ reportImage: "", notes: "", subject: "" });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendReport}
                  className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black"
                  disabled={!reportForm.reportImage || !reportForm.notes}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Report
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-[90vw] max-h-[90vh]"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image Title */}
            <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-3 py-1 rounded text-sm">
              {selectedImage.title}
            </div>

            {/* Image */}
            <img
              src={selectedImage.src}
              alt="Remark attachment"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Click outside to close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
