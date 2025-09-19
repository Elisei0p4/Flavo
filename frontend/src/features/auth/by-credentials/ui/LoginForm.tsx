import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/entities/user';
import { Button } from '@/shared/ui/Button/Button';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  
  useEffect(() => {
    if (authError) {
        Object.entries(authError).forEach(([field, message]) => {
            setError(field as any, { type: 'server', message });
        });
    }
  }, [authError, setError]);

  const onSubmit = async (data: FieldValues) => {
    const success = await login({ username: data.username, password: data.password });
    if (success) {
      toast.success(`С возвращением, ${data.username}!`);
      navigate('/profile');
    }
  };

  return (
    <div className="w-full max-w-md vintage-card-dark p-8"> 
      <h2 className="font-display text-4xl text-center mb-8 text-text-light">Вход</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-text-light/80 mb-2 font-body" htmlFor="username">Имя пользователя</label>
          <input
            id="username"
            {...register("username", { required: "Имя пользователя обязательно" })}
            className={`font-body w-full px-4 py-3 bg-main-dark border rounded-none focus:outline-none focus:ring-2 ${errors.username ? 'border-red-error focus:ring-red-error' : 'border-accent-gold/20 focus:ring-accent-gold'} placeholder-text-light/60`}
            disabled={isLoading}
          />
          {errors.username && <p className="text-red-error text-sm mt-1">{errors.username.message as string}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-text-light/80 mb-2 font-body" htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Пароль обязателен" })}
            className={`font-body w-full px-4 py-3 bg-main-dark border rounded-none focus:outline-none focus:ring-2 ${errors.password ? 'border-red-error focus:ring-red-error' : 'border-accent-gold/20 focus:ring-accent-gold'} placeholder-text-light/60`}
            disabled={isLoading}
          />
          {errors.password && <p className="text-red-error text-sm mt-1">{errors.password.message as string}</p>}
        </div>
        {errors.non_field_errors && <p className="text-red-error text-sm my-2 text-center">{errors.non_field_errors.message as string}</p>}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
      <p className="font-body text-center text-text-light/80 mt-6">
        Ещё нет аккаунта?{' '}
        <Link to="/register" className="text-accent-gold hover:underline">
          Зарегистрируйтесь
        </Link>
      </p>
    </div>
  );
};