"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const WIX_API_BASE = "https://www.themillionproject.org/_functions";

interface CustomAuthProviderProps {
  children: React.ReactNode;
}

interface UserData {
  id: string;
  username: string;
  name?: string;
  surname?: string;
  avatar?: string;
  [key: string]: any;
}

export function CustomAuthProvider({ children }: CustomAuthProviderProps) {
  const router = useRouter();
  const [isSynced, setIsSynced] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const syncUserWithWix = async () => {
      try {
        // Check for memberDetails cookie
        const rawCookie = Cookies.get("memberDetails");
        if (!rawCookie) {
          router.push("/sign-in");
          return;
        }

        let user: UserData;
        try {
          user = JSON.parse(decodeURIComponent(rawCookie));
        } catch {
          Cookies.remove("memberDetails");
          router.push("/sign-in");
          return;
        }

        if (!user?.id) {
          Cookies.remove("memberDetails");
          router.push("/sign-in");
          return;
        }

        // Validate user with Wix GET API
        const getResponse = await fetch(
          `${WIX_API_BASE}/userById?userId=${user.id}`
        );
        const getData = (await getResponse.json()) as {
          success: boolean;
          user?: UserData;
          error?: string;
        };

        if (getData.success) {
          // User valid - update cookie
          Cookies.set(
            "memberDetails",
            encodeURIComponent(JSON.stringify(getData.user)),
            {
              expires: 7,
              secure: true,
              sameSite: "lax",
            }
          );
          setIsSynced(true);
        } else {
          // User not found - Create in Wix
          const userData = {
            id: user.id,
            username: user.username || `user_${user.id.slice(0, 8)}`,
            avatar: user.avatar || "",
            cover: user.cover || "",
            name: user.name || user.firstName || "",
            surname: user.surname || user.lastName || "",
            description: user.description || "",
            city: user.city || "",
            school: user.school || "",
            work: user.work || "",
            website: user.website || "",
            createdAt: user.creationDate || new Date().toISOString(),
            role: user.role || "USER",
            isSubscribed: user.isSubscribed || false,
          };

          const postResponse = await fetch(`${WIX_API_BASE}/createUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
          const postData = (await postResponse.json()) as {
            success: boolean;
            user?: UserData;
            error?: string;
          };

          if (postData.success) {
            Cookies.set(
              "memberDetails",
              encodeURIComponent(JSON.stringify(postData.user)),
              {
                expires: 7,
                secure: true,
                sameSite: "lax",
              }
            );
            setIsSynced(true);
          } else {
            console.error("Failed to create user in Wix:", postData.error);
            Cookies.remove("memberDetails");
            router.push("/sign-in");
          }
        }
      } catch (error) {
        console.error("Sync error:", error);
        Cookies.remove("memberDetails");
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    syncUserWithWix();
  }, [router]);

  if (loading || !isSynced) {
    return <div>Loading... (Syncing with main site)</div>;
  }

  return <>{children}</>;
}
