import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Calendar, 
  Stethoscope, 
  Building2, 
  FileText, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  KeyRound
} from 'lucide-react';
import { AuthUserProfile, UserRole } from '../../types';
import { DEMO_ACCOUNTS, loginUser, registerPatient, registerDoctor } from '../../utils/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUserProfile;
  onLoginSuccess: (user: AuthUserProfile, token: string) => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [registerRole, setRegisterRole] = useState<'patient' | 'doctor'>('patient');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [resetTokenPreview, setResetTokenPreview] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('1985-06-15');
  const [regGender, setRegGender] = useState('female');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regEmergencyContact, setRegEmergencyContact] = useState('');
  const [regMedicalHistory, setRegMedicalHistory] = useState('');
  // Doctor specific fields
  const [regLicense, setRegLicense] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('Clinical Oncology & Early Detection');
  const [regHospital, setRegHospital] = useState('General Health Care');
  const [regBio, setRegBio] = useState('');

  // Status & error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: 'Empty', score: 0, color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: 'Weak', score: 25, color: 'bg-red-500' };
    if (score === 2) return { label: 'Moderate', score: 50, color: 'bg-amber-500' };
    if (score === 3) return { label: 'Good', score: 75, color: 'bg-blue-500' };
    return { label: 'Strong', score: 100, color: 'bg-emerald-500' };
  };

  const handleQuickLogin = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await loginUser(acc.email, acc.password);
      onLoginSuccess(result.user, result.token);
      onClose();
    } catch (e: any) {
      setErrorMessage(e.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await loginUser(loginEmail, loginPassword);
      onLoginSuccess(result.user, result.token);
      onClose();
    } catch (e: any) {
      setErrorMessage(e.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regName) {
      setErrorMessage('Please fill in all mandatory fields (Name, Email, Password).');
      return;
    }
    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (registerRole === 'patient') {
        const result = await registerPatient({
          name: regName,
          email: regEmail,
          password: regPassword,
          contact: regPhone,
          dob: regDob,
          gender: regGender,
          blood_group: regBloodGroup,
          emergency_contact: regEmergencyContact,
          medical_history: regMedicalHistory
        });
        setSuccessMessage('Patient account created successfully!');
        setTimeout(() => {
          onLoginSuccess(result.user, result.token);
          onClose();
        }, 800);
      } else {
        if (!regLicense) {
          setErrorMessage('Doctor medical license number is mandatory.');
          setIsLoading(false);
          return;
        }
        const result = await registerDoctor({
          name: regName,
          email: regEmail,
          password: regPassword,
          contact: regPhone,
          license_number: regLicense,
          specialty: regSpecialty,
          hospital: regHospital,
          bio: regBio
        });
        setSuccessMessage('Doctor clinician account created successfully!');
        setTimeout(() => {
          onLoginSuccess(result.user, result.token);
          onClose();
        }, 800);
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMessage('Please provide your registered email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      setForgotSubmitted(true);
      if (data.demo_reset_token) {
        setResetTokenPreview(data.demo_reset_token);
      }
    } catch (err: any) {
      setErrorMessage('Failed to send reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTokenPreview || !newPassword) {
      setErrorMessage('Reset token and new password are required.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetTokenPreview, new_password: newPassword })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Password reset failed.');
      }
      setResetSuccess(true);
      setTimeout(() => {
        setView('login');
        setResetSuccess(false);
        setForgotSubmitted(false);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  const pwdStrength = getPasswordStrength(view === 'register' ? regPassword : loginPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-cyan-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Q-Diagnose Access Portal</h2>
              <p className="text-xs text-teal-200/80">
                Hybrid Quantum-Classical Healthcare Research • Role-Based Access
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mt-4 p-1 bg-white/10 rounded-xl max-w-md">
            <button
              onClick={() => { setView('login'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                view === 'login' 
                  ? 'bg-teal-500 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setView('register'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                view === 'register' 
                  ? 'bg-teal-500 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => { setView('forgot'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                view === 'forgot' 
                  ? 'bg-teal-500 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Reset Password
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          {/* Status alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* QUICK DEMO SWITCHER */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Quick 1-Click Demo Personas
              </span>
              <span className="text-[10px] text-slate-500">For SIH 2026 Evaluation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className={`text-left p-2.5 rounded-lg border transition-all hover:scale-[1.01] flex items-center justify-between ${
                    acc.role === 'doctor'
                      ? 'bg-teal-50/70 border-teal-200 hover:bg-teal-100/70 text-teal-900'
                      : acc.role === 'admin'
                      ? 'bg-purple-50/70 border-purple-200 hover:bg-purple-100/70 text-purple-900'
                      : 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/70 text-blue-900'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold truncate flex items-center gap-1">
                      <span>{acc.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{acc.sublabel}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    acc.role === 'doctor'
                      ? 'bg-teal-200 text-teal-800'
                      : acc.role === 'admin'
                      ? 'bg-purple-200 text-purple-800'
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* VIEW: LOGIN */}
          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. dr.sharma@qdiagnose.org"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="text-xs">Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Q-Diagnose</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW: REGISTER */}
          {view === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('patient')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      registerRole === 'patient'
                        ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <User className="w-5 h-5 text-teal-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Patient User</div>
                      <div className="text-[10px] text-slate-500">Access health records & screening</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterRole('doctor')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      registerRole === 'doctor'
                        ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5 text-teal-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Doctor Clinician</div>
                      <div className="text-[10px] text-slate-500">Clinical workspace & Doctor 360°</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={registerRole === 'doctor' ? 'Dr. Sarah Jenkins' : 'Rohit Sharma'}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@hospital.org"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Password with strength */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Secure Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 8 characters with numbers & symbols"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regPassword && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${pwdStrength.color}`} style={{ width: `${pwdStrength.score}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{pwdStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Patient Specific Fields */}
              {registerRole === 'patient' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                      <select
                        value={regGender}
                        onChange={(e) => setRegGender(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={regBloodGroup}
                        onChange={(e) => setRegBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
                      <input
                        type="text"
                        value={regEmergencyContact}
                        onChange={(e) => setRegEmergencyContact(e.target.value)}
                        placeholder="Name & Contact Number"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Prior Medical Conditions</label>
                      <input
                        type="text"
                        value={regMedicalHistory}
                        onChange={(e) => setRegMedicalHistory(e.target.value)}
                        placeholder="e.g. Hypertension, Asthma"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Doctor Specific Fields */}
              {registerRole === 'doctor' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Medical License Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={regLicense}
                        onChange={(e) => setRegLicense(e.target.value)}
                        placeholder="MCI-98421-2024"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Clinical Specialty
                      </label>
                      <input
                        type="text"
                        value={regSpecialty}
                        onChange={(e) => setRegSpecialty(e.target.value)}
                        placeholder="e.g. Oncology, Cardiology, Neurology"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hospital / Institution Affiliation
                    </label>
                    <input
                      type="text"
                      value={regHospital}
                      onChange={(e) => setRegHospital(e.target.value)}
                      placeholder="e.g. All India Institute of Medical Sciences (AIIMS)"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : `Register as ${registerRole === 'patient' ? 'Patient' : 'Doctor'}`}
              </button>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === 'forgot' && (
            <div className="space-y-4">
              {!forgotSubmitted ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter the email address registered with Q-Diagnose. A secure verification reset token will be generated to restore access.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. dr.sharma@qdiagnose.org"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Generating Link...' : 'Generate Password Reset Token'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompleteReset} className="space-y-4 bg-teal-50/60 p-4 rounded-xl border border-teal-200">
                  <div className="flex items-center gap-2 text-teal-900 text-xs font-bold">
                    <KeyRound className="w-4 h-4 text-teal-600" />
                    <span>Reset Token Generated</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    A secure token was generated for <span className="font-semibold text-slate-800">{forgotEmail}</span>. Enter your new password below.
                  </p>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Verification Token</label>
                    <input
                      type="text"
                      readOnly
                      value={resetTokenPreview || 'DEMO-TOKEN'}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-teal-300 rounded-lg text-teal-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || resetSuccess}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    {resetSuccess ? 'Password Reset! Redirecting...' : 'Update Password & Sign In'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Security Notice */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            AES-256-GCM Encrypted & ABDM Compliant
          </span>
          <span className="text-slate-400">SIH 2026 Academic Prototype</span>
        </div>
      </div>
    </div>
  );
};
