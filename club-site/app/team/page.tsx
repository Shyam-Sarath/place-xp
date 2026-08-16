"use client";

import { motion } from "motion/react";
import { leadership } from "./teamData";

const faculty = {
  name: "Dr. Rajarajeshwari S",
  role: "Faculty Coordinator",
  image: "/team/faculty.jpg",
};

const values = [
  {
    title: "Leadership",
    text: "Empowering students to lead with confidence.",
  },
  {
    title: "Innovation",
    text: "Building creative solutions and new ideas.",
  },
  {
    title: "Community",
    text: "Growing together through collaboration.",
  },
  {
    title: "Excellence",
    text: "Always striving for our best.",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background text-white">

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl text-center"
        >
          <p className="mb-4 uppercase tracking-[0.3em] text-orange-500">
            PlaceXP Leadership
          </p>

          <h1 className="text-5xl font-bold md:text-7xl">
            Meet the{" "}
            <span className="text-orange-500">
              Team Behind PlaceXP
            </span>
          </h1>

          <p className="mt-6 text-text-secondary">
            Meet the passionate students and faculty shaping PlaceXP.
          </p>
        </motion.div>
      </section>

      {/* FACULTY */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Faculty Coordinator
        </h2>

        <div className="flex flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 md:flex-row">

          <img
            src={faculty.image}
            alt={faculty.name}
            className="h-48 w-48 rounded-full border-4 border-orange-500 object-cover"
          />

          <div>
            <h3 className="text-3xl font-bold">
              {faculty.name}
            </h3>

            <p className="mt-2 text-orange-500">
              {faculty.role}
            </p>

            <p className="mt-4 text-text-secondary">
              Guiding PlaceXP with mentorship, innovation and academic
              excellence.
            </p>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Leadership
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {leadership.map((member) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center transition hover:-translate-y-2 hover:border-orange-500/40"
            >
              <img
                src={member.image}
                alt={member.name}
                className="mx-auto h-40 w-40 rounded-full border-4 border-orange-500 object-cover"
              />

              <h3 className="mt-6 text-2xl font-bold">
                {member.name}
              </h3>

              <p className="mt-1 text-orange-500">
                {member.role}
              </p>

              <p className="mt-4 text-sm text-text-secondary">
                {member.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Our Values
        </h2>

        <div className="grid gap-6 md:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <h3 className="text-xl font-semibold text-orange-500">
                {value.title}
              </h3>

              <p className="mt-3 text-text-secondary">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-5xl font-bold">
          Join PlaceXP
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
          Become part of a vibrant student community and build your future
          with us.
        </p>

        <a
          href="/recruitment"
          className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-4 font-semibold transition hover:bg-orange-600"
        >
          Join Now
        </a>
      </section>

    </main>
  );
}