'use client';

import Image from "next/image";
import { motion } from "motion/react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const faculty = {
  name: "Dr. Rajarajeshwari S",
  role: "Faculty Coordinator",
  image: "https://avatar.iran.liara.run/public/girl?username=faculty",
};

const leadership = [
  { name: "G K Vignesh", role: "Chairperson", image: "https://avatar.iran.liara.run/public/boy?username=vignesh" },
  { name: "Rupayan Roy", role: "Vice Chairperson", image: "https://avatar.iran.liara.run/public/boy?username=rupayan" },
  { name: "Devna S", role: "Secretary", image: "https://avatar.iran.liara.run/public/girl?username=devna" },
  { name: "Nisha P", role: "Event Management Lead", image: "https://avatar.iran.liara.run/public/girl?username=nisha" },
  { name: "Sarvesh N S", role: "Marketing Lead", image: "https://avatar.iran.liara.run/public/boy?username=sarvesh" },
];

const values = [
  { title: "Leadership", text: "Empowering students to lead with confidence." },
  { title: "Innovation", text: "Building creative solutions and new ideas." },
  { title: "Community", text: "Growing together through collaboration." },
  { title: "Excellence", text: "Always striving for our best." },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background text-white relative">
      <Navbar />

      <section className="relative flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
        </div>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="relative z-10 text-center max-w-4xl">
          <p className="uppercase tracking-[0.3em] text-orange-500 mb-4">PlaceXP Leadership</p>
          <h1 className="text-5xl md:text-7xl font-bold">Meet the <span className="text-orange-500">Team Behind PlaceXP</span></h1>
          <p className="mt-6 text-text-secondary">Meet the passionate students and faculty shaping PlaceXP.</p>
        </motion.div>
      </section>

      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Faculty Coordinator</h2>
        <div className="rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col md:flex-row items-center gap-8">
          <Image src={faculty.image} alt={faculty.name} width={192} height={192} className="w-48 h-48 rounded-full border-4 border-orange-500 object-cover"/>
          <div>
            <h3 className="text-3xl font-bold">{faculty.name}</h3>
            <p className="text-orange-500 mt-2">{faculty.role}</p>
            <p className="mt-4 text-text-secondary">Guiding PlaceXP with mentorship, innovation and academic excellence.</p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Leadership Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {leadership.map(m=>(
            <div key={m.name} className="rounded-3xl bg-white/5 border border-white/10 p-6 text-center">
              <Image src={m.image} alt={m.name} width={160} height={160} className="w-40 h-40 rounded-full mx-auto border-4 border-orange-500 object-cover"/>
              <h3 className="mt-6 text-2xl font-bold">{m.name}</h3>
              <p className="text-orange-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {values.map(v=>(
            <div key={v.title} className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <h3 className="text-xl font-semibold text-orange-500">{v.title}</h3>
              <p className="mt-3 text-text-secondary">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 text-center">
        <h2 className="text-5xl font-bold">Join PlaceXP</h2>
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto">Become part of a vibrant student community and build your future with us.</p>
        <a href="/#recruitment" className="inline-block mt-8 rounded-full bg-orange-500 px-8 py-4 font-semibold hover:bg-orange-600 transition">
          Join Now
        </a>
      </section>

      <Footer />
    </main>
  );
}