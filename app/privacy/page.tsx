
import Link from "next/link";

const sectionClass = "border-b border-slate-200 py-7 last:border-0";
const headingClass = "text-lg font-bold text-slate-950";
const paragraphClass = "mt-3 text-sm leading-7 text-slate-600";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-slate-950">
              NORTHSTAR
            </span>
            <span className="block text-[10px] font-semibold tracking-[0.19em] text-slate-500">
              PROPERTY SERVICES
            </span>
          </Link>

          <Link
            href="/quote"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            Request a quote →
          </Link>
        </div>
      </header>

      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Your information
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Privacy notice
          </h1>

          <p className="mt-5 text-sm leading-7 text-slate-600">
            This draft explains how information submitted through the
            Northstar Property Services website is handled. The business
            identity, contact details and retention policy below must be
            completed and reviewed before the website is launched.
          </p>

          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">
              Draft — not ready for publication
            </p>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Replace the outstanding business details and confirm the
              final data-processing arrangements before using this as
              the website's live privacy notice.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 sm:px-9">
            <section className={sectionClass}>
              <h2 className={headingClass}>
                1. Who is responsible for your information?
              </h2>
              <p className={paragraphClass}>
                The organisation responsible for handling information
                submitted through this website is:
              </p>
              <p className={paragraphClass}>
                <strong>Legal business name:</strong> [Insert legal name]
                <br />
                <strong>Business address:</strong> [Insert business address]
                <br />
                <strong>Privacy contact:</strong> [Insert business email]
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                2. What information do we collect?
              </h2>
              <p className={paragraphClass}>
                When you submit a quote enquiry, the form can collect your
                name, email address, optional phone number, property
                postcode, optional property address, service required,
                property type, description of the work and preferred
                timescale. You may also attach up to three photographs
                relating to the job.
              </p>
              <p className={paragraphClass}>
                The website also processes information needed for security
                checks and abuse prevention, such as verification results
                and network information used by the rate limiter.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                3. Why do we use your information?
              </h2>
              <p className={paragraphClass}>
                The intended purposes are to review and respond to quote
                enquiries, understand the requested work, contact you about
                the enquiry, and protect the website against automated or
                abusive submissions.
              </p>
              <p className={paragraphClass}>
                The business must confirm the appropriate lawful basis
                for each purpose before publication.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                4. How is information stored?
              </h2>
              <p className={paragraphClass}>
                The application stores enquiry details in a database and
                uploaded photographs in private file storage. A limited
                session cookie is used to associate uploaded photographs
                with a verified quote submission. A security verification
                service and rate-limiting service are also used.
              </p>
              <p className={paragraphClass}>
                The final notice must identify the actual hosting, database,
                photo-storage and security providers, and explain any
                relevant international data transfers based on the
                production configuration.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                5. How long do we keep information?
              </h2>
              <p className={paragraphClass}>
                Retention periods have not yet been set. Before launch,
                the business must define how long enquiry records and
                photographs are kept, when they are deleted, and how
                abandoned uploads and backups are handled.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                6. Your privacy rights
              </h2>
              <p className={paragraphClass}>
                Depending on the applicable law and circumstances, you may
                have rights to request access to your personal information,
                correct inaccurate information, request deletion or
                restriction, object to certain processing, or request
                a portable copy of information.
              </p>
              <p className={paragraphClass}>
                To make a request, contact the business using the privacy
                contact details above. Those details must be completed
                before publication.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                7. Questions or complaints
              </h2>
              <p className={paragraphClass}>
                Contact the business using its published privacy contact
                details if you have questions about how your information
                is handled. The final notice should also identify the
                relevant supervisory authority and explain how to raise
                a complaint.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                8. Changes to this notice
              </h2>
              <p className={paragraphClass}>
                This notice should be reviewed whenever the website's
                data collection, storage providers or handling practices
                change. Add an effective date once the notice is approved
                for publication.
              </p>
            </section>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            <Link
              href="/"
              className="font-semibold text-blue-700 hover:text-blue-900"
            >
              ← Return to Northstar
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
