import React from 'react';
import {
    Send,
    ChevronDown,
    User,
    AtSign,
    Phone
} from 'lucide-react';

const ContactPage = () => {
    return (
        /* Changed pb-20 to pb-10 to reduce bottom scroll space */
        <div className="min-h-screen bg-[#FAF9F6] text-[#4A3728] font-sans pb-10">

            {/* --- HERO SECTION --- */}
            <section className="relative flex flex-col lg:flex-row items-center overflow-hidden">
                <div className="w-full lg:w-1/2 p-8 lg:p-20 z-10 bg-[#FAF9F6]">
                    <span className="uppercase tracking-widest text-sm font-medium opacity-70 flex items-center gap-2">
                        ~ CONTACT US ~
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-serif mt-4 leading-tight">
                        We'd Love to <br />
                        Hear from <span className="text-[#966B42]">You!</span>
                    </h1>

                    <div className="flex items-center gap-4 my-8">
                        <div className="h-[1px] w-12 bg-[#966B42]/30"></div>
                        <span className="text-[#966B42]">❧</span>
                        <div className="h-[1px] w-12 bg-[#966B42]/30"></div>
                    </div>

                    <p className="text-lg text-[#6B5A4E] max-w-md leading-relaxed">
                        Have questions or feedback?
                        Our team is here to help you.
                    </p>

                    <div className="mt-10 p-6 bg-[#F3EFE7] border border-[#E5DED0] rounded-xl flex items-start gap-4 max-w-sm">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <span className="text-xl">☸</span>
                        </div>
                        <div>
                            <p className="font-semibold">Your journey matters to us.</p>
                            <p className="text-sm opacity-70">Let's make it unforgettable together.</p>
                        </div>
                    </div>
                </div>

                {/* Hero Image - Referencing public/contact-hero.png */}
                <div className="w-full lg:w-1/2 h-[400px] lg:h-[80vh] relative">
                    <img
                        src="/contact-hero.png"
                        alt="Bihar Tourism Contact"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-transparent to-transparent hidden lg:block"></div>
                </div>
            </section>

            {/* --- MESSAGE FORM SECTION --- */}
            {/* Changed py-20 to pt-12 pb-6 to reduce vertical gap */}
            <section className="max-w-4xl mx-auto px-6 pt-12 pb-6">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#F0EBE3]">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-serif mb-4">Send Us a Message</h2>
                        <p className="text-[#6B5A4E]">Fill out the form below and we'll get back to you within 24 hours.</p>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                        <FormInput icon={<User size={18} />} placeholder="Your Name" />
                        <FormInput icon={<AtSign size={18} />} placeholder="Email Address" />
                        <FormInput icon={<Phone size={18} />} placeholder="Phone Number" />

                        <div className="relative">
                            <select className="w-full bg-[#F9F7F2] p-4 rounded-xl border border-[#E5DED0] appearance-none outline-none focus:ring-1 focus:ring-[#966B42] text-[#4A3728]">
                                <option>Subject</option>
                                <option>General Inquiry</option>
                                <option>Bug Report</option>
                                <option>Feedback</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                        </div>

                        <textarea
                            placeholder="How can we help you?"
                            rows={5}
                            className="md:col-span-2 w-full bg-[#F9F7F2] p-4 rounded-xl border border-[#E5DED0] outline-none focus:ring-1 focus:ring-[#966B42] transition-all"
                        ></textarea>

                        <div className="md:col-span-2 flex flex-col items-center mt-4">
                            <button className="w-full md:w-auto md:px-12 bg-[#966B42] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#7D5836] transition-all shadow-lg shadow-[#966B42]/20 active:scale-95">
                                Send Message <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </section>

        </div>
    );
};

const FormInput = ({ icon, placeholder }) => (
    <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
            {icon}
        </div>
        <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-[#F9F7F2] p-4 pl-12 rounded-xl border border-[#E5DED0] outline-none focus:ring-1 focus:ring-[#966B42] transition-all"
        />
    </div>
);

export default ContactPage;