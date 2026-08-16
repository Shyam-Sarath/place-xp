
type Gender = "male" | "female";

/* =========================================================
   AVATAR HELPER
   Gender-based reliable profile images

const avatar = {
  male: (id: number) =>
    `https://randomuser.me/api/portraits/men/${id}.jpg`,
  female: (id: number) =>
    `https://randomuser.me/api/portraits/women/${id}.jpg`,
};

/* =========================================================
   FACULTY COORDINATOR

const faculty = {
  name: "Dr. Rajarajeshwari S",
  role: "Faculty Coordinator",
  gender: "female" as Gender,
  image: avatar.female(44),
};

/* =========================================================
   LEADERSHIP TEAM
   IMPORTANT:
   ALL PEOPLE ARE KEPT UNDER ONE LEADERSHIP SECTION.
   There is NO separate Department Leads section.

const leadership = [
  {
    name: "G K Vignesh",
    role: "Chairperson",
    gender: "male" as Gender,
    image: avatar.male(32),
    description:
      "Leading the vision, direction and overall growth of the Place XP community.",
  },
  {
    name: "Rupayan Roy",
    role: "Vice Chairperson",
    gender: "male" as Gender,
    image: avatar.male(12),
    description:
      "Supporting leadership, coordination and strategic initiatives across Place XP.",
  },
  {
    name: "Devna S",
    role: "Secretary",
    gender: "female" as Gender,
    image: avatar.female(47),
    description:
      "Managing coordination, communication and organizational responsibilities.",
  },
  {
    name: "Nisha P",
    role: "Event Management Lead",
    gender: "female" as Gender,
    image: avatar.female(65),
    description:
      "Planning and coordinating events that create meaningful experiences for students.",
  },
  {
    name: "Sarvesh N S",
    role: "Marketing Lead",
    gender: "male" as Gender,
    image: avatar.male(68),
    description:
      "Building outreach, communication and visibility for Place XP initiatives.",
  },

  /* =======================================================
     DEPARTMENT PEOPLE — NOW PART OF LEADERSHIP ITSELF
  ======================================================= */


  {
    name: "Technical Lead",
    role: "Technology",
    gender: "male" as Gender,
    image: avatar.male(52),
    description:
      "Leading technical initiatives, development and technology-driven projects.",
  },
  {
    name: "Design Lead",
    role: "Design",
    gender: "female" as Gender,
    image: avatar.female(32),
    description:
      "Creating visual experiences, branding and creative communication for Place XP.",
  },
  {
    name: "Events Lead",
    role: "Events",
    gender: "female" as Gender,
    image: avatar.female(49),
    description:
      "Planning and coordinating events that create meaningful experiences for students.",
  },
  {
    name: "Marketing Lead",
    role: "Marketing",
    gender: "male" as Gender,
    image: avatar.male(41),
    description:
      "Building outreach, communication and visibility for Place XP initiatives.",
  },
  {
    name: "Community Lead",
    role: "Community",
    gender: "female" as Gender,
    image: avatar.female(68),
    description:
      "Strengthening student engagement, collaboration and community experience.",
  },
];

/* =========================================================
   HOW WE WORK

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

const roles  = [
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
    title: "Community",
    text: "Engagement, collaboration and member experience.",
    icon: Users,
  },
];

/* =========================================================
   CONTRIBUTION TYPES

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

      <h2 className="mt-3 text-3xl font-bold md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 leading-8 text-text-secondary">
          {description}
        </p>
      )}
    </motion.div>
  );
}

/* =========================================================
   IMAGE COMPONENT WITH FALLBACK

function ProfileImage({
  src,
  name,
  gender,
  className,
}: {
  src: string;
  name: string;
  gender: Gender;
  className: string;
}) {
  const fallback =
    gender === "male"
      ? avatar.male(1)
      : avatar.female(1);

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
                  gender={faculty.gender}
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
            LEADERSHIP TEAM
            ALL PEOPLE ARE HERE
            NO SEPARATE DEPARTMENT LEADS
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
                key={`${member.name}-${member.role}`}
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
                      gender={member.gender}
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
                      {member.description}
                    </p>

                  </div>

                </div>
              </motion.div>

            ))}

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
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import TiltedCard from '@/components/reactbits/TiltedCard';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

// Editable team data
const teamMembers = [
  { name: 'Dr. Rajarajeshwari S', role: 'Faculty Advisor', initials: 'RRS', gradient: 'from-blue-500 to-blue-700' },
  { name: 'G K Vignesh', role: 'Chairperson', initials: 'GKV', gradient: 'from-orange-500 to-orange-700' },
  { name: 'Rupayan Roy', role: 'Vice Chairperson', initials: 'RR', gradient: 'from-blue-400 to-blue-600' },
  { name: 'Devna S', role: 'Secretary', initials: 'DS', gradient: 'from-green-500 to-green-700' },
  { name: 'Nisha P', role: 'Event Management Lead', initials: 'NP', gradient: 'from-purple-500 to-purple-700' },
  { name: 'Sarvesh N S', role: 'Marketing Lead', initials: 'SNS', gradient: 'from-pink-500 to-pink-700' },
];

export default function Team() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <SectionWrapper id="team" className="py-32 md:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium mb-4"
          >
            The Team
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            People behind <span className="text-orange-500">Place XP</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary mt-4 max-w-2xl mx-auto text-lg"
          >
            A passionate team dedicated to empowering students for their career journey.
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group text-center flex flex-col items-center justify-center"
            >
              {/* Tilted Card Avatar */}
              <div className="mb-4">
                <TiltedCard
                  imageSrc={`https://i.pravatar.cc/300?u=${member.initials}`}
                  altText={member.name}
                  captionText={member.role}
                  containerHeight="120px"
                  containerWidth="120px"
                  imageHeight="120px"
                  imageWidth="120px"
                  rotateAmplitude={12}
                  scaleOnHover={1.1}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="w-full h-full flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                      <LinkedinIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  }
                />
              </div>

              <h3 className="text-sm font-semibold text-text-primary">{member.name}</h3>
              <p className="text-xs text-text-muted mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
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
    </SectionWrapper>
  );
}
