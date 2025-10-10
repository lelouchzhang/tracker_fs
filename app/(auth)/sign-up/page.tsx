"use client";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { SubmitHandler, useForm } from "react-hook-form";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "",
      investmentGoals: "",
      riskTolerance: "",
      preferredIndustry: "",
    },
    mode: "onBlur",
  });
  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1 className="form-title">Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="fullName"
          label="Full Name"
          placeholder="Fen Miao"
          register={register}
          error={errors.fullName}
          validation={{
            required: "我们该如何称呼您？",
            minLength: 2,
          }}
        />
        <InputField
          name="email"
          label="Email"
          placeholder="FenMiao@gmail.com"
          register={register}
          error={errors.email}
          validation={{
            required: "我们该如何联系您？",
            pattern: {
              value: /^\w+@\w+\.\w+$/,
              message: "检查您的Email格式",
            },
          }}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="应至少输入8位以上的强密码"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: "设置密码用于您的下次登录", minLength: 8 }}
        />

        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
        />

        <SelectField
          name="investmentGoals"
          label="投资目标"
          placeholder="您希望以哪种方式投资？"
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
          required
        />

        <SelectField
          name="riskTolerance"
          label="风险耐受级别"
          placeholder="您能接受的最大风险级别"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />

        <SelectField
          name="preferredIndustry"
          label="最感兴趣的的行业"
          placeholder="您对哪个板块最感兴趣？"
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Creating Account" : "Start Your Investing Journey"}
        </Button>
        <FooterLink
          text="已有帐号?"
          linkText="跳转到登录页面"
          href="/sign-in"
        />
      </form>
    </>
  );
};

export default SignUp;
