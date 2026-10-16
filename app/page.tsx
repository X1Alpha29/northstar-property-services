

  const services = [
    {
      number: "01",
      value: "plumbing",
      title: "Plumbing",
      description:
        "Repairs, installations and general plumbing for homes and rental properties.",
      icon: "01",
    },
    {
      number: "02",
      value: "electrical",
      title: "Electrical Work",
      description:
        "Electrical repairs, lighting installations and improvements to your property.",
      icon: "02",
    },
    {
      number: "03",
      value: "decorating",
      title: "Decorating",
      description:
        "Interior and exterior painting, finishing and refreshing tired spaces.",
      icon: "03",
    },
    {
      number: "04",
      value: "repairs",
      title: "Property Repairs",
      description:
        "Practical repairs and maintenance to keep your property in good condition.",
      icon: "04",
    },
    {
      number: "05",
      value: "refurbishment",
      title: "Refurbishment",
      description:
        "Carefully managed improvements, from individual rooms to larger projects.",
      icon: "05",
    },
    {
      number: "06",
      value: "maintenance",
      title: "Property Maintenance",
      description:
        "Ongoing maintenance for homeowners, landlords and small businesses.",
      icon: "06",
    },
  ];


const benefits = [
  {
    number: "01",
    title: "A team you can rely on",
    description:
      "Clear communication, practical solutions and a professional approach.",
  },
  {
    number: "02",
    title: "One point of contact",
    description:
      "Discuss your property needs with a team that understands the bigger picture.",
  },
  {
    number: "03",
    title: "Local knowledge",
    description:
      "Property maintenance and refurbishment across West London.",
  },
];


const projects = [
  {
    service: "refurbishment",
    category: "REFURBISHMENT",
    title: "Whole-home and multi-room improvements",
    description:
      "Plan and coordinate improvements across key rooms, from early repairs and preparation to updated fittings and final finishes.",
    details: [
      "Room-by-room work planning",
      "Repairs and surface preparation",
      "Updated finishes and final detailing",
    ],
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    service: "decorating",
    category: "DECORATING",
    title: "Interior refresh and decorating",
    description:
      "Refresh tired interiors with considered colour choices, properly prepared surfaces and consistent finishing throughout.",
    details: [
      "Preparation of walls and surfaces",
      "Interior painting and decorating",
      "Trim, touch-ups and finishing details",
    ],
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
  },
  {
    service: "maintenance",
    category: "PROPERTY MAINTENANCE",
    title: "Rental property upkeep",
    description:
      "Keep homes and rental properties in good condition with practical repairs, routine upkeep and attention to smaller issues.",
    details: [
      "General repairs and maintenance",
      "Property refreshes between tenancies",
      "Clear scopes of work and communication",
    ],
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85",
  },
];


function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span aria-hidden="true">
      {diagonal ? "↗" : "→"}
    </span>
  );
}

function Brand() {
  return (
    <a
      href="#home"
      aria-label="Northstar Property Services home"
      className="flex shrink-0 items-center gap-3"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl font-bold text-blue-700">
        N
      </span>
      <span className="leading-tight">
        <span className="block text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
          NORTHSTAR
        </span>
        <span className="block text-[10px] font-semibold tracking-[0.19em] text-slate-500">
          PROPERTY SERVICES
        </span>
      </span>
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main id="home" className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
          <Brand />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            <a href="#services" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">
              Services
            </a>
            <a href="#projects" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">
              Projects
            </a>
            <a href="#about" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">
              About
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
            >
              FAQ
            </a>
            <a href="#contact" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">
              Contact
            </a>
          </nav>

          <a
            href="/quote"
            style={{ color: "#ffffff" }}
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Request a quote <Arrow />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/50 to-transparent" />

        <div className="mx-auto grid min-h-[590px] max-w-7xl items-center px-5 py-20 sm:px-8 sm:py-24 lg:min-h-[650px] lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-blue-400" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
                Property maintenance & refurbishment
              </p>
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
              Reliable property services across{" "}
              <span className="text-blue-400">West London.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              From everyday repairs to complete refurbishments, we help
              homeowners, landlords and businesses keep their properties
              working at their best.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/quote"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 font-semibold text-white transition hover:bg-blue-500"
              >
                Tell us about your project <Arrow />
              </a>

              <a
                href="tel:02071234567"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 font-semibold text-white transition hover:bg-white/10"
              >
                020 7123 4567
              </a>

            </div>

            <div className="mt-12 grid max-w-xl grid-cols-1 gap-5 border-t border-white/20 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold">Clear communication</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">
                  Know what happens next.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">Multiple services</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">
                  One team for different needs.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">West London</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">
                  Focused on local properties.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:justify-end">
            <div className="max-w-xs rounded-2xl border border-white/20 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                Your property, looked after
              </p>
              <p className="mt-4 text-2xl font-semibold leading-snug">
                Practical solutions. Professional service.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Tell us what needs doing, where the property is and what
                you have in mind. We will use that information to understand
                your requirements.
              </p>
              <a
                href="#services"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-white"
              >
                Explore our services <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="What we do"
              title="Property care, made straightforward."
              description="Whether it is a repair that needs attention or a larger improvement project, find the service that fits your property."
            />
            <a
              href="/quote"
              className="inline-flex w-fit items-center gap-2 border-b border-blue-700 pb-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
            >
              Discuss your requirements <Arrow />
            </a>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <a
                key={service.number}
                href={`/quote?service=${service.value}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                    {service.icon}
                  </span>
                  <span className="text-xl text-slate-300 transition group-hover:text-blue-700">
                    <Arrow diagonal />
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold tracking-tight text-slate-950">
                  {service.title}
                </h3>
                <p className="mt-3 min-h-14 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  Discuss this service <Arrow />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About and trust */}
      <section id="about" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="relative min-h-[350px] overflow-hidden rounded-3xl bg-slate-200 sm:min-h-[480px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-slate-950/70 p-5 text-white backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                Our approach
              </p>
              <p className="mt-2 text-xl font-semibold sm:text-2xl">
                Good work starts with understanding the job.
              </p>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Why Northstar"
              title="A straightforward approach to property maintenance."
              description="Property work should not be complicated by unclear communication or uncertainty about what happens next. Our approach starts with understanding the job and agreeing on the right way forward."
            />

            <div className="mt-9 space-y-7">
              {benefits.map((benefit) => (
                <div key={benefit.number} className="flex gap-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-xs font-bold text-blue-700">
                    {benefit.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/quote"
              className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-blue-700 px-6 font-semibold text-white transition hover:bg-blue-800"
            >
              Start an enquiry <Arrow />
            </a>
          </div>
        </div>
      </section>


      {/* Project showcase */}
      <section
        id="projects"
        className="scroll-mt-24 bg-slate-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Project types"
            title="From everyday fixes to complete refurbishments."
            description="Explore the types of projects Northstar can help with, the work involved and the service that best matches your property needs."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                  <div
                    role="img"
                    aria-label={project.title}
                    className="absolute inset-0 bg-cover bg-center transition duration-500 hover:scale-105"
                    style={{
                      backgroundImage: `url('${project.image}')`,
                    }}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-[10px] font-bold tracking-[0.15em] text-slate-700">
                    {project.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-xl font-bold leading-snug text-slate-950">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>

                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Typical scope of work
                  </p>

                  <ul className="mt-3 space-y-3">
                    {project.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1 font-bold text-blue-700"
                        >
                          ✓
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`/quote?service=${project.service}`}
                    className="mt-7 inline-flex items-center gap-2 border-t border-slate-200 pt-5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                  >
                    Discuss a similar project <Arrow />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


{/* Frequently asked questions */}
<section
  id="faq"
  className="scroll-mt-24 border-t border-slate-200 bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
>
  <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
    <SectionHeading
      eyebrow="Frequently asked questions"
      title="A few things worth knowing."
      description="Find out how to get started, what information to provide and how Northstar approaches property work."
    />

    <div className="divide-y divide-slate-200 border-y border-slate-200">
      <details className="group py-6" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
          What services do you offer?
          <span className="text-xl text-blue-700 transition group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <p className="mt-4 pr-6 text-sm leading-7 text-slate-600">
          Northstar covers plumbing, electrical work, decorating,
          property repairs, refurbishment and ongoing property maintenance.
          Describe your requirements in our quote form so we can understand
          the work involved.
        </p>
      </details>

      <details className="group py-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
          Which areas do you cover?
          <span className="text-xl text-blue-700 transition group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <p className="mt-4 pr-6 text-sm leading-7 text-slate-600">
          Northstar focuses on West London. Include the property postcode
          in your enquiry so the team can assess whether the location
          falls within its service area.
        </p>
      </details>

      <details className="group py-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
          How do I request a quote?
          <span className="text-xl text-blue-700 transition group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <p className="mt-4 pr-6 text-sm leading-7 text-slate-600">
          Complete the online quote form, choose the relevant service,
          describe the work and provide your contact details. The more
          useful detail you provide, the easier it is to understand
          the requirements.
        </p>
        <a
          href="/quote"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          Request a quote <Arrow />
        </a>
      </details>

      <details className="group py-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
          Can I attach photos to my enquiry?
          <span className="text-xl text-blue-700 transition group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <p className="mt-4 pr-6 text-sm leading-7 text-slate-600">
          Yes. You can upload up to three JPEG, PNG or WebP images
          through the quote form. Photos can help explain the issue
          or show the area where work is required.
        </p>
      </details>

      <details className="group py-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
          How is the cost of a job determined?
          <span className="text-xl text-blue-700 transition group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <p className="mt-4 pr-6 text-sm leading-7 text-slate-600">
          Costs depend on the type of work, the property's condition
          and the scope of the job. Describe what needs doing and provide
          any useful photos so the requirements can be assessed.
        </p>
      </details>

      <details className="group py-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
          Can landlords and businesses enquire?
          <span className="text-xl text-blue-700 transition group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </summary>
        <p className="mt-4 pr-6 text-sm leading-7 text-slate-600">
          Yes. The services are intended for homeowners, landlords
          and businesses. Include the property type and the work
          required when submitting your enquiry.
        </p>
      </details>
    </div>
  </div>
</section>




{/* Quote call to action */}
<section
  id="quote"
  className="scroll-mt-24 px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28"
>
  <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20">
    <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
          Request a quote
        </p>

        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Tell us what your property needs.
        </h2>

        <p className="mt-5 max-w-xl leading-7 text-slate-300">
          Describe the work, select a service and share photos of the
          problem or space. Complete our online form to tell us about
          your project.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <a
          href="/quote"
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 font-semibold text-white transition hover:bg-blue-500"
        >
          Request a quote <Arrow />
        </a>

        <p className="text-center text-sm text-slate-300">
          Call our team:{" "}
          <a
            href="tel:02071234567"
            className="font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:text-blue-300"
          >
            020 7123 4567
          </a>
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer id="contact" className="scroll-mt-24 border-t border-slate-200 bg-white px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              Property maintenance, repairs and refurbishment across
              West London.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:gap-6">
            <a href="#services" className="transition hover:text-blue-700">
              Services
            </a>
            <a href="#projects" className="transition hover:text-blue-700">
              Projects
            </a>
            <a href="#about" className="transition hover:text-blue-700">
              About
            </a>
            <a href="#faq" className="transition hover:text-blue-700">
              FAQ
            </a>
            <a href="/quote" className="transition hover:text-blue-700">
              Request a quote
            </a>

            <a
              href="/privacy"
              className="transition hover:text-blue-700"
            >
              Privacy notice
            </a>

          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-slate-200 pt-6 text-xs text-slate-500">
          © 2026 Northstar Property Services. Portfolio
          demonstration project.
        </div>
      </footer>
    </main>
  );
}
