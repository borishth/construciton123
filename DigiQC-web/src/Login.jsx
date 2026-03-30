import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Flexible feature: Basic validation / log
    console.log("Login attempted with", { email, password });
    if (!email || !password) {
        alert("Please enter both email and password.");
    } else {
        alert(`Login successful for ${email}!`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-fixed to-transparent rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-secondary-fixed to-transparent rounded-full -ml-32 -mb-32 blur-3xl"></div>
        <div className="absolute inset-0" data-alt="Subtle blue architectural grid pattern background" style={{ backgroundImage: 'radial-gradient(circle, #727785 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <main className="relative z-10 w-full max-w-md px-6 py-12 mx-auto mt-10">
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-lg flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary text-4xl" data-icon="architecture">architecture</span>
          </div>
          <h1 className="font-headline font-extrabold text-4xl bg-gradient-to-br from-blue-700 to-blue-500 bg-clip-text text-transparent tracking-tight mb-2">DigiQC</h1>
          <p className="font-headline text-secondary text-sm font-semibold tracking-wide uppercase">Precision Inspection Management</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-outline-variant/10">
          <div className="mb-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Welcome Back</h2>
            <p className="text-on-surface-variant text-sm">Access your field directives and site reports.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" data-icon="mail">mail</span>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-[1.25rem] py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" 
                  placeholder="name@company.com" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest">Password</label>
                <a className="text-xs font-semibold text-primary hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" data-icon="lock">lock</span>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-[1.25rem] py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface focus:outline-none" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl" data-icon="visibility">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button className="w-full mt-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-[1.25rem] shadow-lg shadow-primary/25 active:scale-95 transition-all duration-150 hover:opacity-90" type="submit">
              Login to Dashboard
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant/15 flex flex-col gap-4">
            <button className="w-full py-3 px-4 rounded-xl font-headline font-bold text-primary hover:bg-primary/5 transition-colors border border-primary/20">
              Create New Account
            </button>
            <button className="w-full py-2 px-4 rounded-xl font-body font-medium text-secondary text-sm hover:text-on-surface transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg" data-icon="person_search">person_search</span>
              Continue as Guest
            </button>
          </div>
        </div>

        <div className="mt-12 text-center relative z-10 pb-8">
          <p className="text-xs text-secondary font-medium tracking-tight">
            © 2024 DigiQC Systems. <br className="md:hidden"/> Trusted by 10,000+ Site Architects globally.
          </p>
          <div className="mt-6 flex justify-center gap-6">
            <a className="text-[10px] uppercase tracking-widest font-bold text-outline hover:text-primary" href="#">Privacy Policy</a>
            <a className="text-[10px] uppercase tracking-widest font-bold text-outline hover:text-primary" href="#">Terms of Service</a>
          </div>
        </div>
      </main>

      <div className="hidden lg:block fixed bottom-0 right-0 w-1/3 h-2/3 pointer-events-none overflow-hidden opacity-20">
        <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 600V100L400 0V500L100 600Z" fill="currentColor" fillOpacity="0.1"></path>
          <path d="M100 100L400 0M100 200L400 100M100 300L400 200M100 400L400 300M100 500L400 400" stroke="currentColor" strokeWidth="2"></path>
          <path d="M150 100V580M250 100V545M350 100V515" stroke="currentColor" strokeDasharray="10 10" strokeWidth="1"></path>
        </svg>
      </div>
    </>
  );
};

export default Login;
