import { RegisterForm } from '@/features/auth/register';
import { SectionDivider } from '@/shared/ui/SectionDivider/SectionDivider';

const RegisterPage = () => {
    return (
        <div 
            className="flex-grow flex flex-col items-center justify-center bg-auth-background bg-cover bg-center text-text-light animate-fadeIn overflow-hidden"
        >
            <div className="absolute inset-0 bg-main-dark/70" />
            <SectionDivider variant="top" className="z-10" />
            <div className="relative z-10 page-container py-16 flex justify-center items-center flex-grow">
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;