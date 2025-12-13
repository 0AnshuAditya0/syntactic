import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { Code2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Code2 className="w-8 h-8 text-blue-600" />
        <span className="text-2xl font-bold text-[#1E1E2C] dark:text-white">
          Syntactic
        </span>
      </Link>
      
      <LoginForm />
    </div>
  );
}
