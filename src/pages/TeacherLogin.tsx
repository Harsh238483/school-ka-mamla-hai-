import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 1) Try localStorage auth teachers first
    try {
      const auth = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const emailKey = (email || '').trim().toLowerCase();
      const found = (auth || []).find((t: any) => (t.email || '').toLowerCase() === emailKey);

      if (found) {
        if (found.status && found.status === 'banned') {
          setError('Your account has been banned. Please contact the principal.');
          setIsLoading(false);
          return;
        }
        if (password !== found.password) {
          setError('Invalid password. Please try again.');
          setIsLoading(false);
          return;
        }
        // Store authentication in localStorage
        localStorage.setItem("teacherAuth", "true");
        localStorage.setItem("teacherEmail", found.email);
        localStorage.setItem("teacherName", found.username || found.name || "Teacher");
        localStorage.setItem("teacherSubject", found.subject || "");
        navigate("/teacher-dashboard");
        setIsLoading(false);
        return;
      }
    } catch {}

    // 2) Fallback to demo teachers if none in storage
    const demoTeachers = [
      { email: "teacher@royalacademy.edu", password: "teacher123", name: "John Smith", subject: "Mathematics" },
      { email: "science.teacher@royalacademy.edu", password: "science123", name: "Dr. Sarah Johnson", subject: "Science" },
      { email: "english.teacher@royalacademy.edu", password: "english123", name: "Emily Davis", subject: "English" }
    ];

    const teacher = demoTeachers.find(t => t.email === email && t.password === password);

    if (teacher) {
      // Store authentication in localStorage
      localStorage.setItem("teacherAuth", "true");
      localStorage.setItem("teacherEmail", teacher.email);
      localStorage.setItem("teacherName", teacher.name);
      localStorage.setItem("teacherSubject", teacher.subject);
      navigate("/teacher-dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
    
    setIsLoading(false);
  };

  // Autofill password for entered email using localStorage
  const handleFillPassword = () => {
    try {
      const auth = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const emailKey = (email || '').trim().toLowerCase();
      const found = (auth || []).find((t: any) => (t.email || '').toLowerCase() === emailKey);
      if (!found) {
        setError('No teacher account found for this email.');
        return;
      }
      if (!found.password) {
        setError('No stored password available. Please type your password.');
        return;
      }
      setPassword(found.password);
      setError("");
    } catch {
      setError('Unable to access stored accounts.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center mx-auto mb-4"
            >
              <Users className="h-10 w-10 text-black" />
            </motion.div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Teacher Portal
            </h1>
            <p className="text-muted-foreground">
              Access your teaching dashboard
            </p>
          </div>

          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">Demo Credentials:</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Math Teacher:</strong> teacher@royalacademy.edu / teacher123</p>
              <p><strong>Science Teacher:</strong> science.teacher@royalacademy.edu / science123</p>
              <p><strong>English Teacher:</strong> english.teacher@royalacademy.edu / english123</p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={handleFillPassword}>
                  Fill password from account
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black font-semibold py-3"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact{" "}
              <a href="mailto:admin@royalacademy.edu" className="text-gold hover:text-gold/80 transition-colors">
                admin@royalacademy.edu
              </a>
            </p>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Royal Academy Teacher Portal • Secure Access
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherLogin;
