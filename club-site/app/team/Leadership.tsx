'use client';

import { motion } from "motion/react";
import { leadership } from "@/app/team/teamData";

export default function Leadership() {
  return (
    <section className="relative py-28 px-6">

      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[0.3em] text-orange-500 font-medium mb-4">
            Leadership
          </p>

          <h2 className="text-4xl md:text-5xl font-bold">
            Meet Our Leaders
          </h2>

          <p className="mt-5 text-text-secondary max-w-2xl mx-auto">
            The driving force behind PlaceXP, creating impactful experiences
            and inspiring the student community.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">

          {leadership.map((member, index) => (

            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -12,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-xl"
            >

              <img
                src={member.image}
                alt={member.name}
                className="h-96 w-full object-cover"
              />

              <div className="p-8">

                <h3 className="text-2xl font-bold">
                  {member.name}
                </h3>

                <p className="text-orange-500 mt-2">
                  {member.role}
                </p>

                <p className="text-text-secondary mt-6">
                  {member.quote}
                </p>

                <a
                  href={member.linkedin}
                  className="inline-block mt-8 px-5 py-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition"
                >
                  LinkedIn
                </a>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}