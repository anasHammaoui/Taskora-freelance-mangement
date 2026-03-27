import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading, setUser, setError } from '../../store/slices/authSlice';
import { authApi } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const res = await authApi.login(data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res));
      dispatch(setUser(res));
      toast.success(`Welcome back, ${res.fullName}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      dispatch(setError(msg));
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Taskora" className="w-48 mx-auto mb-6 object-contain" />
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Sign in to your Taskora account</p>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" className="w-full" loading={loading} size="lg">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
