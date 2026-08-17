"use client";

import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Code2,
  Lightbulb,
  Megaphone,
  Palette,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

/* =========================================================
   AVATAR HELPER
========================================================= */

const avatar = {
  male: (id: number) =>
    `https://randomuser.me/api/portraits/men/${id}.jpg`,
  female: (id: number) =>
    `https://randomuser.me/api/portraits/women/${id}.jpg`,
};

/* =========================================================
   FACULTY COORDINATOR
========================================================= */

const faculty = {
  name: "Dr. Rajarajeshwari S",
  role: "Faculty Coordinator",
  image: avatar.female(44),
};

/* =========================================================
   EXECUTIVE BOARD
========================================================= */

const leadership = [
  {
    name: "G K Vignesh",
    role: "Chairperson",
    gender: "male",
    image: "/team/chairperson.jpeg",
  },
  {
    name: "Rupayan Roy",
    role: "Vice Chairperson",
    gender: "male",
    image: avatar.male(12),
  },
  {
    name: "Devna S",
    role: "Secretary",
    gender: "female",
    image: avatar.female(47),
  },
  {
    name: "Nisha P",
    role: "Event Management Lead",
    gender: "female",
    image: "/team/event_management_lead.jpeg",
  },
  {
    name: "Sarvesh N S",
    role: "Marketing Lead",
    gender: "male",
    image: "/team/marketing_lead.jpeg",
  },
];

/* =========================================================
   DEPARTMENT LEADS
========================================================= */

const departmentLeads = [
  {
    name: "Technical Lead",
    role: "Technology",
    gender: "male",
    image: avatar.male(52),
    description:
      "Leading technical initiatives, development and technology-driven projects.",
    icon: Code2,
  },
  {
    name: "Design Lead",
    role: "Design",
    gender: "female",
    image: avatar.female(32),
    description:
      "Creating visual experiences, branding and creative communication for Place XP.",
    icon: Palette,
  },
  {
    name: "Events Lead",
    role: "Events",
    gender: "female",
    image: avatar.female(49),
    description:
      "Planning and coordinating events that create meaningful experiences for students.",
    icon: CalendarDays,
  },
  {
    name: "Marketing Lead",
    role: "Marketing",
    gender: "male",
    image: avatar.male(41),
    description:
      "Building outreach, communication and visibility for Place XP initiatives.",
    icon: Megaphone,
  },
  {
    name: "Social Media Lead",
    role: "Social Media",
    gender: "female",
    image: avatar.female(68),
    description:
      "Managing the social media presence, digital communication and engaging content for the Place XP community.",
    icon: Users,
  },
];

/* =========================================================
   HOW WE WORK
========================================================= */

const workflow = [
  {
    number: "01",
    title: "Idea",
    text: "Every initiative begins with a thought, problem or possibility.",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "Discuss",
    text: "Ideas become stronger when different perspectives come together.",
    icon: Users,
  },
  {
    number: "03",
    title: "Collaborate",
    text: "Different members bring different skills and strengths to the table.",
    icon: Users,
  },
  {
    number: "04",
    title: "Execute",
    text: "Planning turns into action through teamwork and ownership.",
    icon: Wrench,
  },
  {
    number: "05",
    title: "Impact",
    text: "Our goal is to create experiences that are useful to the student community.",
    icon: Sparkles,
  },
];

/* =========================================================
   WHAT WE DO
========================================================= */

const activities = [
  {
    title: "Events",
    text: "Plan and create meaningful events and experiences for students.",
    icon: CalendarDays,
  },
  {
    title: "Initiatives",
    text: "Turn ideas into practical initiatives, experiments and solutions.",
    icon: Code2,
  },
  {
    title: "Workshops",
    text: "Create opportunities for students to learn, explore and develop skills.",
    icon: Wrench,
  },
  {
    title: "Community",
    text: "Build connections between students through collaboration and shared interests.",
    icon: Users,
  },
];

/* =========================================================
   TEAM ROLES
========================================================= */

const roles = [
  {
    title: "Leadership",
    text: "Direction, decision-making and coordination.",
    icon: Sparkles,
  },
  {
    title: "Events",
    text: "Planning, organizing and executing experiences.",
    icon: CalendarDays,
  },
  {
    title: "Marketing",
    text: "Communication, outreach and community visibility.",
    icon: Megaphone,
  },
  {
    title: "Technology",
    text: "Building, experimenting and creating technical solutions.",
    icon: Code2,
  },
  {
    title: "Design",
    text: "Visual identity, creativity and communication.",
    icon: Palette,
  },
  {
    title: "Social Media",
    text: "Digital communication, content and online engagement.",
    icon: Users,
  },
];

/* =========================================================
   CONTRIBUTION TYPES
========================================================= */

const contributionTypes = [
  {
    title: "I have an idea",
    text: "Bring your idea and help us turn it into something real.",
    icon: Lightbulb,
  },
  {
    title: "I have a technical skill",
    text: "Build, automate, experiment and solve problems with the team.",
    icon: Code2,
  },
  {
    title: "I'm creative",
    text: "Design, write, photograph, create and shape how we communicate.",
    icon: Palette,
  },
  {
    title: "I like organizing",
    text: "Plan events, coordinate people and make things happen.",
    icon: CalendarDays,
  },
];

/* =========================================================
   REUSABLE SECTION TITLE
========================================================= */

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-3xl text-center"
    >
      <span className="text-sm uppercase tracking-[0.25em] text-orange-400">
        {eyebrow}
      </span>

      <h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>

      {description && (
        <p className="mt-4 leading-8 text-text-secondary">{description}</p>
      )}
    </motion.div>
  );
}

/* =========================================================
   IMAGE COMPONENT WITH FALLBACK
========================================================= */

function ProfileImage({
  src,
  name,
  gender,
  className,
}: {
  src: string;
  name: string;
  gender: "male" | "female";
  className: string;
}) {
  const fallback = gender === "male" ? avatar.male(1) : avatar.female(1);

  return (
    <img
      src={src}
      alt={name}
      className={className}
      loading="lazy"
      onError={(event) => {
        const image = event.currentTarget;

        if (image.src !== fallback) {
          image.src = fallback;
        }
      }}
    />
  );
}

/* =========================================================
   TEAM SECTION
========================================================= */

export default function Team() {
  return (
    <section
      id="team"
      className="relative overflow-hidden bg-background py-32 md:py-40"
    >
      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="absolute right-[-120px] top-[30%] h-[420px] w-[420px] rounded-full bg-orange-400/5 blur-[150px]" />

        <div className="absolute bottom-[10%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            Meet Our Team
          </span>

          <h1 className="mt-8 text-4xl font-bold tracking-tight md:text-6xl">
            People Behind
            <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Place XP
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-text-secondary">
            Meet the people who guide, lead and build the Place XP
            community through collaboration, creativity and innovation.
          </p>

          <div className="mt-10 flex justify-center">
            <ArrowDown className="h-5 w-5 animate-bounce text-orange-500" />
          </div>
        </motion.div>

        {/* =====================================================
            FACULTY COORDINATOR
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
          className="mt-20"
        >
          <SectionTitle
            eyebrow="Faculty Guidance"
            title="Faculty Coordinator"
          />

          <div className="group relative mt-12 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] p-8 backdrop-blur-xl transition-all duration-500 hover:border-orange-500/40 hover:shadow-[0_0_60px_rgba(249,115,22,0.10)] md:p-12">

            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-orange-500/10" />

            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full border border-orange-500/10" />

            <div className="relative flex flex-col items-center gap-10 md:flex-row md:gap-14">

              <div className="relative shrink-0">

                <div className="absolute -inset-5 rounded-full border border-orange-500/20 transition-all duration-500 group-hover:scale-105 group-hover:border-orange-500/40" />

                <div className="absolute -inset-9 rounded-full border border-orange-500/10" />

                <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-2xl" />

                <ProfileImage
                  src={faculty.image}
                  name={faculty.name}
                  gender="female"
                  className="relative h-48 w-48 rounded-full border-4 border-orange-500 object-cover md:h-56 md:w-56"
                />

              </div>

              <div className="relative flex-1 text-center md:text-left">

                <span className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-orange-400">
                  {faculty.role}
                </span>

                <h3 className="mt-5 text-3xl font-bold md:text-4xl">
                  {faculty.name}
                </h3>

                <p className="mt-5 max-w-2xl leading-8 text-text-secondary">
                  Guiding Place XP with mentorship, innovation and
                  academic excellence while encouraging students to
                  transform their ideas into meaningful experiences.
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
                    Mentorship
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
                    Guidance
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
                    Innovation
                  </span>
                </div>

              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            EXECUTIVE BOARD
            VERTICAL ONE BELOW ANOTHER
        ===================================================== */}

        <div className="mt-32">

          <SectionTitle
            eyebrow="Executive Board"
            title="Leadership Team"
            description="The student leaders shaping the direction, culture and growth of Place XP."
          />

          <div className="mx-auto mt-14 max-w-5xl space-y-7">

            {leadership.map((member, index) => (

              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-[0_20px_70px_rgba(249,115,22,0.12)]"
              >

                <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-orange-500/5 blur-3xl transition-all duration-500 group-hover:bg-orange-500/10" />

                <div className="relative flex flex-col items-center gap-7 p-7 md:flex-row md:p-9">

                  {/* Number */}

                  <div className="flex shrink-0 items-center justify-center">
                    <span className="text-5xl font-bold text-orange-500/20 md:text-6xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Avatar */}

                  <div className="relative shrink-0">

                    <div className="absolute -inset-4 rounded-full bg-orange-500/10 blur-xl transition-all duration-500 group-hover:bg-orange-500/20" />

                    <div className="absolute -inset-2 rounded-full border border-orange-500/20 transition-all duration-500 group-hover:scale-105 group-hover:border-orange-500/50" />

                    <ProfileImage
                      src={member.image}
                      name={member.name}
                      gender={member.gender as "male" | "female"}
                      className="relative h-32 w-32 rounded-full border-4 border-orange-500/80 object-cover transition-transform duration-500 group-hover:scale-105 md:h-36 md:w-36"
                    />

                  </div>

                  {/* Content */}

                  <div className="flex-1 text-center md:text-left">

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                      {member.role}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                      {member.name}
                    </h3>

                    <div className="mt-4 h-px w-12 bg-orange-500/50 transition-all duration-500 group-hover:w-20" />

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
                      Helping shape ideas, coordinate initiatives and
                      create meaningful experiences for the Place XP
                      community.
                    </p>

                  </div>

                </div>
              </motion.div>

            ))}

          </div>
        </div>

        {/* =====================================================
            DEPARTMENT LEADS
            VERTICAL ONE BELOW ANOTHER
        ===================================================== */}

        <div className="mt-36">

          <SectionTitle
            eyebrow="Department Leads"
            title="The Teams Behind Place XP"
            description="Each department brings a different strength to the community, working together to turn ideas into meaningful experiences."
          />

          <div className="mx-auto mt-14 max-w-5xl space-y-7">

            {departmentLeads.map((member, index) => {

              const Icon = member.icon;

              return (

                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.07,
                  }}
                  className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(249,115,22,0.10)] md:p-9"
                >

                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange-500/5 blur-3xl transition-all duration-500 group-hover:bg-orange-500/15" />

                  <span className="absolute right-7 top-6 text-4xl font-bold text-white/[0.04]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex flex-col items-center gap-7 md:flex-row md:gap-10">

                    {/* Department Image */}

                    <div className="relative shrink-0">

                      <div className="absolute -inset-4 rounded-full bg-orange-500/10 blur-xl transition-all duration-500 group-hover:bg-orange-500/20" />

                      <div className="absolute -inset-2 rounded-full border border-orange-500/20 transition-all duration-500 group-hover:scale-105 group-hover:border-orange-500/50" />

                      <ProfileImage
                        src={member.image}
                        name={member.name}
                        gender={member.gender as "male" | "female"}
                        className="relative h-32 w-32 rounded-full border-4 border-orange-500/80 object-cover transition-transform duration-500 group-hover:scale-105 md:h-36 md:w-36"
                      />

                    </div>

                    {/* Content */}

                    <div className="flex-1 text-center md:text-left">

                      <div className="flex justify-center md:justify-start">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                        {member.role}
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        {member.name}
                      </h3>

                      <div className="mt-4 h-px w-10 bg-orange-500/40 transition-all duration-500 group-hover:w-16 md:mx-0 mx-auto" />

                      <p className="mt-4 text-sm leading-7 text-text-secondary">
                        {member.description}
                      </p>

                    </div>

                  </div>

                </motion.div>

              );

            })}

          </div>
        </div>

        {/* =====================================================
            PEOPLE BEHIND THE WORK
        ===================================================== */}

        <div className="mt-36">

          <SectionTitle
            eyebrow="Beyond the Names"
            title="The People Behind the Work"
            description="A strong community is built by people who are willing to share ideas, take responsibility and help each other grow."
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.025] p-8 text-center md:p-14"
          >

            <p className="mx-auto max-w-4xl text-xl leading-10 text-white/90 md:text-2xl">
              Place XP brings together students with different
              interests, skills and perspectives. Every event,
              initiative and idea becomes stronger when people
              contribute what they know and learn from one another.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">

              {[
                "Ideas",
                "Skills",
                "Creativity",
                "Leadership",
                "Teamwork",
                "Curiosity",
              ].map((item) => (

                <span
                  key={item}
                  className="rounded-full border border-orange-500/20 bg-orange-500/5 px-5 py-2 text-sm text-orange-300"
                >
                  {item}
                </span>

              ))}

            </div>

          </motion.div>
        </div>

        {/* =====================================================
            HOW WE WORK
        ===================================================== */}

        <div className="mt-36">

          <SectionTitle
            eyebrow="Our Process"
            title="How We Work"
            description="From the first idea to the final experience, teamwork drives everything we do."
          />

          <div className="relative mt-16">

            <div className="absolute left-[10%] right-[10%] top-16 hidden h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent md:block" />

            <div className="grid gap-10 md:grid-cols-5">

              {workflow.map((step, index) => {

                const Icon = step.icon;

                return (

                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    className="relative text-center"
                  >

                    <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-orange-500/20 bg-background shadow-[0_0_30px_rgba(249,115,22,0.05)]">

                      <div className="absolute inset-3 rounded-full border border-white/5" />

                      <Icon className="relative h-8 w-8 text-orange-500" />

                      <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                        {step.number}
                      </span>

                    </div>

                    <h3 className="mt-6 text-xl font-bold">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-text-secondary">
                      {step.text}
                    </p>

                  </motion.div>

                );

              })}

            </div>
          </div>
        </div>

        {/* =====================================================
            WHAT WE DO TOGETHER
        ===================================================== */}

        <div className="mt-36">

          <SectionTitle
            eyebrow="Together"
            title="What We Do Together"
            description="Our team works across different areas to create opportunities, experiences and initiatives for students."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {activities.map((activity, index) => {

              const Icon = activity.icon;

              return (

                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:bg-white/[0.05]"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {activity.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {activity.text}
                  </p>

                </motion.div>

              );

            })}

          </div>
        </div>

        {/* =====================================================
            EVERYONE HAS A ROLE
        ===================================================== */}

        <div className="mt-36">

          <SectionTitle
            eyebrow="Different Strengths"
            title="Everyone Has a Role"
            description="Great teams are made stronger when people contribute in different ways."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {roles.map((role, index) => {

              const Icon = role.icon;

              return (

                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 hover:border-orange-500/40"
                >

                  <span className="absolute right-6 top-5 text-4xl font-bold text-white/[0.03]">
                    0{index + 1}
                  </span>

                  <Icon className="h-7 w-7 text-orange-500 transition-transform duration-300 group-hover:scale-110" />

                  <h3 className="mt-5 text-xl font-bold">
                    {role.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {role.text}
                  </p>

                  <div className="mt-6 h-px w-8 bg-orange-500/40 transition-all duration-500 group-hover:w-16" />

                </motion.div>

              );

            })}

          </div>
        </div>

        {/* =====================================================
            BEHIND EVERY EVENT
        ===================================================== */}

        <div className="mt-36">

          <SectionTitle
            eyebrow="Behind Every Event"
            title="From an Idea to an Experience"
            description="Every successful initiative is built through many small contributions working together."
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-14 overflow-hidden rounded-[32px] border border-orange-500/20 bg-orange-500/[0.035] p-8 md:p-12"
          >

            <div className="grid gap-6 md:grid-cols-5">

              {[
                "IDEA",
                "DISCUSSION",
                "PLANNING",
                "EXECUTION",
                "IMPACT",
              ].map((item, index) => (

                <div
                  key={item}
                  className="relative text-center"
                >

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-orange-500/30 bg-background text-sm font-bold text-orange-400">
                    0{index + 1}
                  </div>

                  <h3 className="mt-5 text-sm font-semibold tracking-[0.15em]">
                    {item}
                  </h3>

                  {index < 4 && (
                    <div className="mx-auto mt-6 hidden h-px w-full bg-orange-500/20 md:block" />
                  )}

                </div>

              ))}

            </div>

            <p className="mx-auto mt-12 max-w-3xl text-center leading-8 text-text-secondary">
              What looks like one event from the outside is often
              the result of ideas, conversations, planning,
              coordination and countless small contributions behind
              the scenes.
            </p>

          </motion.div>

        </div>

        {/* =====================================================
            BRING YOUR STRENGTH
        ===================================================== */}

        <div className="mt-36">

          <SectionTitle
            eyebrow="Your Contribution"
            title="Bring Your Strength"
            description="You don't need to know everything. Bring what you enjoy, what you know or what you want to learn."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {contributionTypes.map((item, index) => {

              const Icon = item.icon;

              return (

                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group rounded-[28px] border border-white/10 bg-white/[0.035] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/40"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {item.text}
                  </p>

                </motion.div>

              );

            })}

          </div>
        </div>

        {/* =====================================================
            TEAM PHILOSOPHY
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-36 max-w-5xl text-center"
        >

          <div className="mx-auto h-px w-16 bg-orange-500" />

          <p className="mt-10 text-3xl font-semibold leading-tight md:text-5xl">

            Different skills.

            <span className="text-orange-500">
              {" "}Different perspectives.
            </span>

            <br />

            One Place XP.

          </p>

          <p className="mx-auto mt-7 max-w-2xl leading-8 text-text-secondary">
            We believe the strongest communities are built when
            everyone has something to contribute and everyone has
            something to learn.
          </p>

        </motion.div>

        {/* =====================================================
            CONTRIBUTOR CTA
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto mt-32 max-w-5xl overflow-hidden rounded-[36px] border border-orange-500/20 bg-white/[0.035] px-8 py-16 text-center backdrop-blur-xl md:px-16"
        >

          <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full border border-orange-500/10" />

          <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full border border-orange-500/10" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-[100px]" />

          <div className="relative">

            <p className="text-sm uppercase tracking-[0.3em] text-orange-500">
              Your Story Starts Here
            </p>

            <h2 className="mt-5 text-4xl font-bold md:text-5xl">
              Have something to

              <span className="block text-orange-500">
                contribute?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-text-secondary">
              Whether you have an idea, a skill, a creative spark
              or simply the curiosity to learn something new,
              there is a place for you at Place XP.
            </p>

            <a
              href="/#contributor"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-orange-400 hover:shadow-[0_0_40px_rgba(249,115,22,0.30)]"
            >
              Become a Contributor

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

          </div>

        </motion.div>

      </div>
    </section>
  );
}