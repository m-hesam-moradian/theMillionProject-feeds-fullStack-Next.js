"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
      return value ? JSON.parse(decodeURIComponent(value)) : null;
    };

    const validateUser = async (userId: string) => {
      Swal.fire({
        title: "Validating login...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const res = await fetch(
          `https://www.themillionproject.org/_functions/userById?userId=${encodeURIComponent(
            userId
          )}`
        );
        const data = await res.json();

        if (data.success && data.user) {
          document.cookie = `UserInfo=${encodeURIComponent(
            JSON.stringify(data.user)
          )}; path=/; max-age=86400`;
          Swal.close();
          router.push("/dashboard");
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        Swal.fire({
          icon: "warning",
          title: "Not Logged In",
          text: "Please log in to the website before accessing the feed.",
          confirmButtonText: "Go to Login",
        }).then(() => {
          window.location.href = "https://www.themillionproject.org/";
        });
      }
    };

    const cookieUser = getCookie("UserInfo");

    if (cookieUser?.id) {
      validateUser(cookieUser.id);
    } else {
      const queryUserId = searchParams.get("userId");
      if (queryUserId) {
        validateUser(queryUserId);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Not Logged In",
          text: "Please log in to the website before accessing the feed.",
          confirmButtonText: "Go to Login",
        }).then(() => {
          window.location.href = "https://www.themillionproject.org/";
        });
      }
    }
  }, [searchParams, router]);

  return null;
}
