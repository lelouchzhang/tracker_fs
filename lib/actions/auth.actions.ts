"use server";

import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";

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
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });
    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
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
