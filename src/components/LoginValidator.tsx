"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

const LoginValidator = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name: string) => {
      try {
        const value = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${name}=`))
          ?.split("=")[1];
        return value ? JSON.parse(decodeURIComponent(value)) : null;
      } catch (err) {
        console.error("Cookie parse error:", err);
        return null;
      }
    };

    const redirectToLogin = () => {
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to the website before accessing the feed.",
        confirmButtonText: "Go to Login",
      }).then(() => {
        window.location.href = "https://www.themillionproject.org/";
      });
    };

    const validateUser = async (userId: string): Promise<boolean> => {
      if (!userId || userId === "no-user-id") return false;

      Swal.fire({
        title: "Validating login...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const res = await fetch(
          `https://www.themillionproject.org/_functions/userById?userId=${encodeURIComponent(
            userId
          )}`
        );
        const data = await res.json();
        console.log("Validation response:", data);

        if (data.success && data.user) {
          document.cookie = `UserInfo=${encodeURIComponent(
            JSON.stringify(data.user)
          )}; path=/; max-age=86400`;
          Swal.close();
          return true;
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.error("Validation error:", err);
        return false;
      }
    };

    const runValidation = async () => {
      const queryUserId = searchParams.get("userId");
      const cookieUser = getCookie("UserInfo");

      // Priority: query param first (unless it's "no-user-id")
      if (queryUserId) {
        const queryValid = await validateUser(queryUserId);
        if (queryValid) return;
      }

      // Fallback: try cookie
      if (cookieUser?.id) {
        const cookieValid = await validateUser(cookieUser.id);
        if (cookieValid) return;
      }

      // Final fallback: redirect
      redirectToLogin();
    };

    runValidation();
  }, [searchParams, router]);

  return null;
};

export default LoginValidator;
