'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { signInWithEmail, signUpWithEmail } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) {
        router.push('/');
      } else {
        // 处理登录失败的情况
        toast.error('登录失败', {
          description: '用户名或密码错误'
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Sign in failed', {
        description: e instanceof Error ? e.message : 'Failed to sign in.'
      })
    }
  }

  return (
    <>
      <h1 className="form-title">Welcome back</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          placeholder="contact@jsmastery.com"
          register={register}
          error={errors.email}
          validation={{
            required: '邮箱地址是必填项', pattern: {
              value: /^\w+@\w+\.\w+$/,
              message: '请输入有效的邮箱地址'
            }
          }}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ 
            required: '密码是必填项', 
            minLength: {
              value: 8,
              message: '密码至少需要8位字符'
            }
          }}
        />

        <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
          {isSubmitting ? 'Signing In' : 'Sign In'}
        </Button>

        <FooterLink text="Don't have an account?" linkText="Create an account" href="/sign-up" />
      </form>
    </>
  );
};
export default SignIn;