import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import upbankLogo from '../assets/Untitled-1-1.png';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Vui lòng nhập Email và Mật khẩu.');
      }

      // Query database via Supabase
      const { data, error: sbError } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .eq('pass', password)
        .single();

      if (sbError || !data) {
        throw new Error('Email hoặc Mật khẩu không chính xác.');
      }

      // Kiểm tra trạng thái
      if (data.trang_thai !== 'dang_lam') {
        throw new Error('Tài khoản của bạn đã bị khóa hoặc ngừng hoạt động.');
      }

      // Lưu LocalStorage
      localStorage.setItem('currentUser', JSON.stringify(data));
      
      // Chuyển hướng
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background p-4">
      <div className="w-full max-w-md bg-card border border-border/40 rounded-2xl p-8 shadow-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-[2px] mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <div className="bg-card w-full h-full rounded-2xl overflow-hidden flex items-center justify-center relative">
             <img src={upbankLogo} alt="Logo" className="absolute inset-0 w-full h-full object-cover scale-150" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Đăng Nhập Quản Trị</h1>
        <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs">
          Vui lòng nhập thông tin nhân sự để truy cập vào hệ thống.
        </p>

        {error && (
          <div className="w-full p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50"
              placeholder="ten.nhansu@congty.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground ml-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_4px_20px_-5px_rgba(59,130,246,0.6)]"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
