"use client";

import { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import { setUsername as setUsernameAction } from "@/lib/actions";

const MIN_LENGTH = 5;
const USERNAME_REGEX = /^[a-z0-9]+$/;

export default function UsernamePrompt() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user?.username) {
      setUsername("");
      setError("");
      setPending(false);
      setSubmitted(false);
    }
  }, [user?.username]);

  if (!user?.id || user?.username) {
    return null;
  }

  const validate = (value: string) => {
    if (value.length < MIN_LENGTH) {
      return `Username must be at least ${MIN_LENGTH} characters.`;
    }
    if (!USERNAME_REGEX.test(value)) {
      return "Only lowercase letters and numbers are allowed.";
    }
    return "";
  };

  const shouldShowErrors = (value: string) =>
    submitted || value.length >= MIN_LENGTH;

  const handleChange = (value: string) => {
    const normalized = value.toLowerCase();
    setUsername(normalized);
    if (shouldShowErrors(normalized)) {
      setError(validate(normalized));
    } else {
      setError("");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = username.trim().toLowerCase();
    setSubmitted(true);

    const validationMessage = validate(trimmed);
    setError(validationMessage);
    if (validationMessage) {
      return;
    }

    setPending(true);
    const result = await setUsernameAction(trimmed);
    setPending(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    if (result?.user) {
      dispatch(setUser(result.user));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-blue-500">
          Add your username
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Pick a unique username to finish setting up your profile. You will not
          be able to use the app until this step is completed.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-blue-500">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => handleChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/30  px-4 py-2 text-sm text-blue-600 outline-none backdrop-blur focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. themillionfan"
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-green-500 px-4 py-2 text-white font-semibold transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Saving..." : "Save username"}
          </button>
        </form>
      </div>
    </div>
  );
}


