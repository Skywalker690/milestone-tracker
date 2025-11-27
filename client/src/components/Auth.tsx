import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mountain, Loader2, ArrowRight, Github, Check, Star } from 'lucide-react';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      className="text-blue-600"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      className="text-green-600"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      className="text-yellow-500"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      className="text-red-500"
    />
  </svg>
);

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, error: authContextError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Sync context error to local display
  useEffect(() => {
    if (authContextError) {
      setLocalError(authContextError);
    }
  }, [authContextError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password, firstName, lastName });
        setIsLogin(true);
        setLocalError('Registration successful! Please login.');
        setLoading(false); 
        return; 
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      if (isLogin) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      {/* Left Side - Brand/Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0F172A] overflow-hidden flex-col justify-between p-16 text-white">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <Mountain className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">Pathfinder</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold tracking-tight leading-[1.1] mb-6">
            Turn your <span className="text-indigo-400">vision</span> into reality.
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed font-medium">
            Stop dreaming and start doing. Break down complex goals into achievable milestones with the power of AI.
          </p>
          
          <div className="space-y-5">
             <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Check className="w-5 h-5" /></div>
                <span>AI-powered goal breakdown</span>
             </div>
             <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Check className="w-5 h-5" /></div>
                <span>Smart progress tracking</span>
             </div>
             <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Check className="w-5 h-5" /></div>
                <span>Visual analytics dashboard</span>
             </div>
          </div>
        </div>

        <div className="relative z-10">
           <div className="flex gap-1 mb-3">
             {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
           </div>
           <p className="text-sm font-medium text-slate-400">Trusted by 10,000+ achievers worldwide.</p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white">
         <div className="w-full max-w-[440px] relative z-10 animate-fade-in">
            {/* Header for Mobile only */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Pathfinder</span>
            </div>

            <div className="text-center lg:text-left mb-10">
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                  {isLogin ? 'Welcome back' : 'Create an account'}
               </h2>
               <p className="text-slate-500 font-medium">
                  {isLogin ? 'Enter your credentials to access your workspace.' : 'Start your journey to success today.'}
               </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="flex items-center justify-center px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm group"
              >
                <GoogleIcon />
                <span className="ml-2 text-sm font-bold text-slate-700 group-hover:text-slate-900">Google</span>
              </a>
              <a
                href="http://localhost:8080/oauth2/authorization/github"
                className="flex items-center justify-center px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm group"
              >
                <Github className="w-5 h-5 text-slate-900" />
                <span className="ml-2 text-sm font-bold text-slate-700 group-hover:text-slate-900">GitHub</span>
              </a>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-medium">Or continue with email</span>
              </div>
            </div>

            {localError && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center ${localError.includes('successful') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {localError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">First Name</label>
                    <input
                      required
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      required
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-70 flex justify-center items-center group mt-2 hover:-translate-y-0.5"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <span className="flex items-center">
                    {isLogin ? 'Sign In' : 'Create Account'} 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 font-medium">
                {isLogin ? "New to Pathfinder? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setLocalError('');
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
                >
                  {isLogin ? 'Create an account' : 'Log in'}
                </button>
              </p>
            </div>
         </div>
      </div>
    </div>
  );
};
