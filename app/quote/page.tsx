"use client";

import Link from "next/link";
import imageCompression from "browser-image-compression";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  Turnstile,
  type TurnstileInstance,
} from "@marsidev/react-turnstile";


const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

type EnquiryResponse = {
  message?: string;
  reference?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;


export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successReference, setSuccessReference] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    const requestedService = new URLSearchParams(
      window.location.search,
    ).get("service");

    const validServices = [
      "plumbing",
      "electrical",
      "decorating",
      "repairs",
      "refurbishment",
      "maintenance",
      "other",
    ];

    if (requestedService && validServices.includes(requestedService)) {
      setSelectedService(requestedService);
    }
  }, []);


async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  setErrorMessage("");
  setSuccessReference("");
  setUploadProgress("");

  const photos = formData
    .getAll("photos")
    .filter(
      (entry): entry is File =>
        entry instanceof File && entry.size > 0,
    );

  if (photos.length > 3) {
    setErrorMessage("You can upload a maximum of 3 photos.");
    return;
  }

  if (!turnstileToken) {
    setErrorMessage(
      "Please complete the security check before submitting.",
    );
    return;
  }

  const verificationToken = turnstileToken;
  setIsSubmitting(true);

  try {
    setUploadProgress("Verifying your submission...");

    const sessionResponse = await fetch("/api/enquiries/session", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: verificationToken }),
    });

    const sessionResult = (await sessionResponse.json()) as {
      verified?: boolean;
      error?: string;
    };

    if (!sessionResponse.ok || !sessionResult.verified) {
      throw new Error(
        sessionResult.error ??
          "Security verification failed. Please try again.",
      );
    }

    // The token has now been used. A retry needs a fresh token.
    setTurnstileToken("");

    const uploadedPhotos: {
      url: string;
      pathname: string;
      originalName: string;
      mimeType: string;
      sizeBytes: number;
    }[] = [];

    for (let i = 0; i < photos.length; i++) {
      const originalPhoto = photos[i];

      setUploadProgress(
        `Preparing photo ${i + 1} of ${photos.length}...`,
      );

      const compressedPhoto = await imageCompression(
        originalPhoto,
        {
          maxSizeMB: 0.9,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: originalPhoto.type,
        },
      );

      if (compressedPhoto.size > 3 * 1024 * 1024) {
        throw new Error(
          `Photo ${i + 1} could not be reduced to the allowed size. Please choose a smaller image.`,
        );
      }

      setUploadProgress(
        `Uploading photo ${i + 1} of ${photos.length}...`,
      );

      const photoFormData = new FormData();
      photoFormData.append(
        "photo",
        compressedPhoto,
        originalPhoto.name,
      );

      const uploadResponse = await fetch(
        "/api/enquiries/upload-photo",
        {
          method: "POST",
          credentials: "same-origin",
          body: photoFormData,
        },
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.photo) {
        throw new Error(
          uploadResult.error ??
            `Photo ${i + 1} could not be uploaded.`,
        );
      }

      uploadedPhotos.push(uploadResult.photo);
    }

    setUploadProgress("Submitting your enquiry...");

    const enquiryData = Object.fromEntries(
      Array.from(formData.entries()).filter(
        ([key]) =>
          key !== "photos" && key !== "cf-turnstile-response",
      ),
    );

    const response = await fetch("/api/enquiries", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...enquiryData,
        photos: uploadedPhotos,
      }),
    });

    const result = (await response.json()) as EnquiryResponse;

    if (!response.ok) {
      const firstFieldError = result.fieldErrors
        ? Object.values(result.fieldErrors).flat().find(Boolean)
        : undefined;

      throw new Error(
        firstFieldError ??
          result.error ??
          "We could not submit your enquiry. Please try again.",
      );
    }

    if (!result.reference) {
      throw new Error(
        "The server response was incomplete. Check whether your enquiry was received before trying again.",
      );
    }

    setSuccessReference(result.reference);
    form.reset();
    setTurnstileToken("");
    turnstileRef.current?.reset();
  } catch (error) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "We could not submit your enquiry. Please try again.",
    );

    setTurnstileToken("");
    turnstileRef.current?.reset();
  } finally {
    setIsSubmitting(false);
    setUploadProgress("");
  }
}


  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl font-bold text-blue-700">
              N
            </span>

            <span>
              <span className="block text-base font-extrabold tracking-tight text-slate-950">
                NORTHSTAR
              </span>

              <span className="block text-[10px] font-semibold tracking-[0.19em] text-slate-500">
                PROPERTY SERVICES
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-700"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Request a quote
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Tell us about your project.
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Give us a few details about the work you need. Describe
              the problem and provide your contact details so we can
              understand your requirements.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            onChange={() => {
              setErrorMessage("");
              setSuccessReference("");
            }}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
          >
            {/* 1. Work details */}
            <div className="border-b border-slate-200 pb-7">
              <h2 className="text-xl font-bold text-slate-950">
                1. What work do you need?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Select the service that best describes your job.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Service required *
                  <select
                    name="service"
                    required
                    value={selectedService}
                    onChange={(event) => setSelectedService(event.target.value)}
                    className={fieldClass}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical work</option>
                    <option value="decorating">Decorating</option>
                    <option value="repairs">Property repairs</option>
                    <option value="refurbishment">Refurbishment</option>
                    <option value="maintenance">
                      Property maintenance
                    </option>
                    <option value="other">Other / not sure</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Property type *
                  <select
                    name="propertyType"
                    required
                    defaultValue=""
                    className={fieldClass}
                  >
                    <option value="" disabled>
                      Select property type
                    </option>
                    <option value="house">House</option>
                    <option value="flat">Flat / apartment</option>
                    <option value="commercial">
                      Commercial property
                    </option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                  Describe the work *
                  <textarea
                    name="description"
                    required
                    minLength={10}
                    rows={5}
                    maxLength={3000}
                    placeholder="What needs repairing, installing or improving?"
                    className={fieldClass}
                  />

                  <span className="mt-2 block text-xs font-normal text-slate-500">
                    Include useful details about the issue, the rooms
                    involved or the work you have planned.
                  </span>
                </label>

                <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                  When would you like the work done?
                  <select
                    name="urgency"
                    defaultValue="flexible"
                    className={fieldClass}
                  >
                    <option value="urgent">As soon as possible</option>
                    <option value="week">Within a week</option>
                    <option value="month">Within a month</option>
                    <option value="flexible">
                      Flexible / planning ahead
                    </option>
                  </select>
                </label>
              </div>
            </div>

            {/* 2. Photo uploads */}
            <div className="border-b border-slate-200 py-7">
              <h2 className="text-xl font-bold text-slate-950">
                2. Add photos
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Photos can help us understand the job. Please avoid
                including sensitive personal information.
              </p>

              <label className="mt-5 block text-sm font-semibold text-slate-700">
                Photos of the job (optional)

                <input
                  name="photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />

                <span className="mt-2 block text-xs font-normal text-slate-500">
                  Upload up to 3 JPEG, PNG or WebP images, with a
                  maximum of 1 MB per image and 3 MB combined.
                </span>
              </label>
            </div>

            {/* 3. Contact details */}
            <div className="py-7">
              <h2 className="text-xl font-bold text-slate-950">
                3. Your contact details
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Tell us how we can contact you about the enquiry.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Full name *
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={120}
                    placeholder="Your name"
                    className={fieldClass}
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Email address *
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={30}
                    placeholder="Your contact number"
                    className={fieldClass}
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Property postcode *
                  <input
                    name="postcode"
                    type="text"
                    autoComplete="postal-code"
                    required
                    maxLength={12}
                    placeholder="e.g. W5 2XX"
                    className={fieldClass}
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                  Property address (optional)
                  <input
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    maxLength={200}
                    placeholder="Street and property number"
                    className={fieldClass}
                  />
                </label>
              </div>
            </div>

            {/* Security verification */}
            <div className="border-t border-slate-200 py-7">
              <h2 className="text-xl font-bold text-slate-950">
                Security check
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Complete this check before submitting your quote request.
              </p>

              {turnstileSiteKey ? (
                <div className="mt-4">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={turnstileSiteKey}
                    options={{ theme: "light" }}
                    onSuccess={(token) => {
                      setTurnstileToken(token);
                      setErrorMessage("");
                    }}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => {
                      setTurnstileToken("");
                      setErrorMessage(
                        "The security check could not load. Please refresh the page and try again.",
                      );
                    }}
                  />
                </div>
              ) : (
                <p className="mt-4 text-sm text-red-700">
                  Security verification is not configured. Please try again later.
                </p>
              )}
            </div>


            {/* Submission feedback */}
            {uploadProgress && (
              <p
                role="status"
                className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800"
              >
                {uploadProgress}
              </p>
            )}
            {errorMessage && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
              >
                {errorMessage}
              </p>
            )}

            {successReference && (
              <p
                role="status"
                className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-900"
              >
                Your quote request has been saved successfully. Your
                reference is <strong>{successReference}</strong>.
                Email notifications are not configured yet.
              </p>
            )}

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-xs leading-5 text-slate-500">
                Fields marked with * are required. Your information
                will be validated before it is saved.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-blue-700 px-8 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit quote request"}

                <span aria-hidden="true">
                  {isSubmitting ? "…" : "→"}
                </span>
              </button>
            </div>
          </form>


      <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm text-slate-500 sm:flex-row sm:justify-center sm:gap-6">
        <p>
          Need to discuss something first?{" "}
          <Link
            href="/"
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            Return to our website
          </Link>
        </p>

        <Link
          href="/privacy"
          className="font-semibold text-blue-700 hover:text-blue-900"
        >
          Privacy notice
        </Link>
      </div>

        </div>
      </section>
    </main>
  );
}