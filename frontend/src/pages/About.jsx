/**
 * About Page
 * Company information and story
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Building2, Users, Award, Heart, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'We never compromise on quality. Every sticker and magnet is crafted with precision using premium materials.'
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure you love your products.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our team brings years of printing expertise to deliver exceptional results every time.'
    },
    {
      icon: Building2,
      title: 'In-House Production',
      description: 'We manufacture everything in our own facility, ensuring complete quality control.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | Sticker & Magnet Lab</title>
        <meta name="description" content="Learn about Sticker & Magnet Lab - your trusted source for custom stickers and magnets. In-house production, premium quality, free shipping." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-hero-pattern text-white py-20">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            About Sticker & Magnet Lab
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Your trusted partner for premium custom stickers and magnets since 2015.
            In-house production, exceptional quality, and unmatched customer service.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-deep-indigo mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-gray">
                <p>
                  Sticker & Magnet Lab is a division of R and R Imports INC, a family-owned
                  business based in Troutville, Virginia. What started as a small printing
                  operation has grown into a trusted name in custom stickers and magnets.
                </p>
                <p>
                  We believe in doing things the right way - manufacturing everything in-house
                  so we can ensure the highest quality standards. Our state-of-the-art equipment
                  and dedicated team work together to bring your designs to life.
                </p>
                <p>
                  Unlike big-box competitors who outsource production overseas, we take pride
                  in American craftsmanship. Every product that leaves our facility has been
                  inspected and approved by our quality team.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-soft-sky rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-deep-indigo mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                {[
                  'In-house production for complete quality control',
                  'Free shipping on every order - no minimums',
                  'Fast 3-5 business day production',
                  'Premium weather-resistant materials',
                  'Vibrant, long-lasting colors',
                  'Friendly customer support'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cool-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-gray">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-soft-gray">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-deep-indigo mb-4">Our Values</h2>
            <p className="text-slate-gray max-w-2xl mx-auto">
              These core values guide everything we do at Sticker & Magnet Lab.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-soft hover:shadow-medium transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cool-blue to-deep-indigo rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-deep-indigo mb-2">{value.title}</h3>
                <p className="text-sm text-slate-gray">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-deep-indigo mb-4">Contact Information</h2>
              <p className="text-slate-gray">
                Have questions? We&apos;d love to hear from you.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-soft-gray rounded-xl p-6">
                <h3 className="font-bold text-deep-indigo mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Details
                </h3>
                <div className="space-y-3 text-slate-gray">
                  <p className="font-semibold">Sticker & Magnet Lab</p>
                  <p className="text-sm">A division of R and R Imports INC</p>
                </div>
              </div>
              <div className="bg-soft-gray rounded-xl p-6">
                <h3 className="font-bold text-deep-indigo mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address
                </h3>
                <p className="text-slate-gray">
                  5271 Lee Hwy<br />
                  Troutville, VA 24017<br />
                  United States
                </p>
              </div>
              <div className="bg-soft-gray rounded-xl p-6">
                <h3 className="font-bold text-deep-indigo mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Phone
                </h3>
                <a href="tel:276-706-0463" className="text-cool-blue hover:underline">
                  276-706-0463
                </a>
              </div>
              <div className="bg-soft-gray rounded-xl p-6">
                <h3 className="font-bold text-deep-indigo mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </h3>
                <a href="mailto:orders@rrinconline.com" className="text-cool-blue hover:underline">
                  orders@rrinconline.com
                </a>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-slate-gray mb-4">
                Visit our parent company for more products:
              </p>
              <a
                href="https://www.rrinconline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cool-blue hover:underline"
              >
                <Globe className="w-4 h-4" />
                www.rrinconline.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero-pattern text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Create your custom stickers and magnets today with our easy-to-use design tool.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/customize" className="btn-primary">
              Start Designing
            </Link>
            <Link to="/contact" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-deep-indigo">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
