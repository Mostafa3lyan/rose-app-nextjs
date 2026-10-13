'use client';

import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';
import useLogin from '../_hooks/use-login';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/features/auth/submit-button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utility/tailwind-merge';
import RememberMe from './remeber-me';
import { LoginFormFields, loginSchema } from '@/lib/schema/login.schema';

export default function LoginPopover() {
  // Translation
  const t = useTranslations('auth');

  // State
  const [rememberMe, setRememberMe] = useState(true);

  // Hook
  const locale = useLocale();
  const { error, isPending, login } = useLogin();

  // Form & Validation
  const form = useForm<LoginFormFields>({
    mode: 'all',
    resolver: zodResolver(loginSchema(t)),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Function
  const onSubmit: SubmitHandler<LoginFormFields> = (values) => {
    login({ ...values, rememberMe });
  };

  return (
    <div
      className={cn(
        'absolute top-8 z-30 rounded-md bg-white opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 ',
        locale === 'ar' ? 'left-0' : 'right-0',
      )}
    >
      <Tabs defaultValue="login">
        <TabsList className="w-full">
          <TabsTrigger value="login" asChild className="w-1/2">
            <Link href="/login">{t('popover.login')}</Link>
          </TabsTrigger>
          <TabsTrigger value="register" asChild className="w-1/2">
            <Link href="/register">{t('popover.register')}</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('login.email')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="user@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-800 dark:text-zinc-50">
                  {t('login.password')}
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-black placeholder:text-zinc-400 dark:text-zinc-50"
                    placeholder="***********"
                    {...field}
                    type="password"
                  />
                </FormControl>

                {/* Feedback */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot Password */}
          <Link
            href="/forgot-password"
            className="mt-2 text-end text-sm font-semibold text-maroon-700 dark:text-softpink-300"
          >
            {t('login.forget-password')}
          </Link>

          {/* Remember Me */}
          <div className="mt-6">
            <RememberMe checked={rememberMe} onChange={setRememberMe} />
          </div>

          {/* Submit Button */}
          <SubmitButton
            error={error}
            isSubmitting={form.formState.isSubmitting}
            isValid={form.formState.isValid}
            isPending={isPending}
            text="login.submit"
            loading="login.loading"
          />
        </form>
      </Form>
    </div>
  );
}
