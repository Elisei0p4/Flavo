import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/entities/user';
import { Button } from '@/shared/ui/Button';
import type { RegisterData } from '@/entities/user/model/types';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterData>();
  const registerUser = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    if (data.password !== data.password2) {
      setError("password2", { type: "manual", message: "Пароли не совпадают!" });
      return;
    }

    const result = await registerUser(data);

    if (result.success) {
      toast.success('Добро пожаловать в FLAVO!');
      navigate('/profile');
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        setError(field as keyof RegisterData, { type: 'server', message });
      });
    }
  };

  return (
    <div className="w-full max-w-md vintage-card-dark p-8"> 
        <h2 className="font-display text-4xl text-center mb-8 text-text-light">Создать аккаунт</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-text-light/80 mb-2 font-body" htmlFor="username">Имя пользователя</label>
            <input 
              id="username"
              {...register("username", { required: "Имя пользователя обязательно" })}
              className={`font-body w-full px-4 py-3 bg-main-dark border rounded-none focus:outline-none focus:ring-2 ${errors.username ? 'border-red-error focus:ring-red-error' : 'border-accent-gold/20 focus:ring-accent-gold'} placeholder-text-light/60`}
              disabled={isLoading} 
            />
            {errors.username && <p className="text-red-error text-sm mt-1">{errors.username.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-text-light/80 mb-2 font-body" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email"
              {...register("email", { 
                required: "Email обязателен",
                pattern: { value: /^\S+@\S+$/i, message: "Неверный формат email" }
              })}
              className={`font-body w-full px-4 py-3 bg-main-dark border rounded-none focus:outline-none focus:ring-2 ${errors.email ? 'border-red-error focus:ring-red-error' : 'border-accent-gold/20 focus:ring-accent-gold'} placeholder-text-light/60`}
              disabled={isLoading} 
            />
            {errors.email && <p className="text-red-error text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-text-light/80 mb-2 font-body" htmlFor="password">Пароль</label>
            <input 
              type="password"
              id="password"
              {...register("password", { 
                required: "Пароль обязателен",
                minLength: { value: 8, message: "Пароль должен быть не менее 8 символов" }
              })}
              className={`font-body w-full px-4 py-3 bg-main-dark border rounded-none focus:outline-none focus:ring-2 ${errors.password ? 'border-red-error focus:ring-red-error' : 'border-accent-gold/20 focus:ring-accent-gold'} placeholder-text-light/60`}
              disabled={isLoading} 
            />
            {errors.password && <p className="text-red-error text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-text-light/80 mb-2 font-body" htmlFor="password2">Повторите пароль</label>
            <input 
              type="password"
              id="password2"
              {...register("password2", { required: "Повторите пароль" })}
              className={`font-body w-full px-4 py-3 bg-main-dark border rounded-none focus:outline-none focus:ring-2 ${errors.password2 ? 'border-red-error focus:ring-red-error' : 'border-accent-gold/20 focus:ring-accent-gold'} placeholder-text-light/60`}
              disabled={isLoading} 
            />
            {errors.password2 && <p className="text-red-error text-sm mt-1">{errors.password2.message}</p>}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>
        <p className="font-body text-center text-text-light/80 mt-6">
          Уже зарегистрированы?{' '}
          <Link to="/login" className="text-accent-gold hover:underline">
            Войти
          </Link>
        </p>
      </div>
  );
};