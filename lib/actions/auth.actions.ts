"use server";

import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({
  fullName,
  email,
  password,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    // 先等待 Better-Auth 成功保存用户信息到数据库
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });
    // 再发送 Inngest 事件
    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }
    return { success: true, data: response };
  } catch (error) {
    console.log(error);
    return { success: false, error: "注册失败" };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    console.log(error);

    return { success: false, error: "注销失败" };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return { success: true, data: response };
  } catch (error) {
    console.log(error);

    return { success: false, error: "登录失败" };
  }
};
