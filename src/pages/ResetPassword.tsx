import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  
  const { verifyResetCode, resetPasswordWithCode } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from navigation state if available
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !resetCode) {
      toast.error('Please enter your email and reset code');
      return;
    }

    if (resetCode.length !== 6) {
      toast.error('Reset code must be 6 digits');
      return;
    }

    setVerifyingCode(true);
    
    try {
      // Use the verifyResetCode function from AuthContext
      const result = await verifyResetCode(email, resetCode);
      
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.data?.valid === false) {
        toast.error('Invalid or expired reset code. Please try again.');
      } else {
        setCodeVerified(true);
        toast.success('Code verified! Now set your new password.');
      }
    } catch (error: any) {
      console.error('Code verification error:', error);
      toast.error('Invalid or expired reset code. Please try again.');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      toast.error('Password must contain uppercase, lowercase, number, and special character');
      return;
    }

    setLoading(true);
    
    try {
      // Use the resetPasswordWithCode function from AuthContext
      const result = await resetPasswordWithCode(email, resetCode, newPassword);
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        setPasswordReset(true);
        toast.success('Password reset successfully!');
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForgot = () => {
    navigate('/forgot-password');
  };

  const handleBackToLogin = () => {
    navigate('/signin');
  };

  // Success screen
  if (passwordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Password Reset Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Your password has been updated. You can now sign in with your new password.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              Redirecting to sign in page in 3 seconds...
            </div>
            <Button
              onClick={handleBackToLogin}
              className="w-full h-12 bg-primary hover:bg-primary/90 transition-all duration-200 font-semibold"
            >
              Sign In Now
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {codeVerified ? 'Set New Password' : 'Enter Reset Code'}
            </h1>
            <p className="text-gray-600">
              {codeVerified 
                ? 'Create a strong password for your account'
                : 'Enter the 6-digit code sent to your email'
              }
            </p>
          </div>

          {!codeVerified ? (
            // Code verification form
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-2 focus:border-primary transition-colors"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Reset Code
                </label>
                <Input
                  id="resetCode"
                  name="resetCode"
                  type="text"
                  required
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                  className="h-12 border-2 focus:border-primary transition-colors text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={verifyingCode}
                  className="w-full h-12 bg-primary hover:bg-primary/90 transition-all duration-200 font-semibold"
                >
                  {verifyingCode ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying Code...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToForgot}
                  className="w-full h-12 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Email Entry
                </Button>
              </div>
            </form>
          ) : (
            // Password reset form
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-colors"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-colors"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Password Requirements:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                    • At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                    • One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                    • One lowercase letter
                  </li>
                  <li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>
                    • One number
                  </li>
                  <li className={/[@$!%*?&]/.test(newPassword) ? 'text-green-600' : ''}>
                    • One special character (@$!%*?&)
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 transition-all duration-200 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToLogin}
                  className="w-full h-12 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-xs text-yellow-700">
              <p className="font-medium mb-1">Security Tips:</p>
              <ul className="space-y-1">
                <li>• Never share your reset code with anyone</li>
                <li>• Use a unique password you haven't used before</li>
                <li>• Consider using a password manager</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;