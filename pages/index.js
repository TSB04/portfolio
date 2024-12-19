import { useRef, useCallback, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Cursor from "../components/Cursor";
import data from "../data/portfolio.json";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import DOMPurify from 'dompurify';

export default function Home() {
  const workRef = useRef(null);
  const aboutRef = useRef(null);
  const textRefs = useRef([]);
  const [sanitizedHTML, setSanitizedHTML] = useState('');


  const handleScroll = useCallback((ref) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    stagger(
      textRefs.current,
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  const taglines = [
    data.headerTaglineOne,
    data.headerTaglineTwo,
    data.headerTaglineThree,
    data.headerTaglineFour,
  ];
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSanitizedHTML(DOMPurify.sanitize(data.aboutpara));
    }
  }, []);
  return (
    <>
      <Head>
        <title>{data.name}</title>
        <meta name="description" content={data.description} />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph and Twitter Metadata */}
        {[
          { property: "og:title", content: data.name },
          { property: "og:description", content: data.description },
          { property: "og:image", content: data.image },
          { property: "og:url", content: data.url },
          { name: "twitter:card", content: "summary_large_image" },
          { property: "twitter:domain", content: data.url },
          { property: "twitter:url", content: data.url },
          { name: "twitter:title", content: data.name },
          { name: "twitter:description", content: data.description },
          { name: "twitter:image", content: data.image },
        ].map((meta, index) => (
          <meta key={index} {...meta} />
        ))}
      </Head>
      <div className={`relative ${data.showCursor && "cursor-none"}`}>
        {data.showCursor && <Cursor />}
        <div className="gradient-circle"></div>
        <div className="gradient-circle-bottom" />

        <Header
          handleWorkScroll={() => handleScroll(workRef)}
          handleAboutScroll={() => handleScroll(aboutRef)}
        />

        <main className="container mx-auto mb-10 overflow-scroll">
          {/* Header Taglines */}
          <section className="lg:mt-20 mt-10">
            <div className="mt-5 space-y-5">
              {taglines.map((tagline, index) => (
                <h1
                  key={index}
                  ref={(el) => (textRefs.current[index] = el)}
                  className="text-3xl md:text-6xl lg:text-6xl p-1 md:p-2 font-bold w-4/5 sm:w-full lg:w-4/5"
                >
                  {tagline}
                </h1>
              ))}
            </div>
            <Socials className="mt-2 lg:mt-5" />
          </section>

          {/* Work Section */}
          <section className="mt-10 lg:mt-30 p-2 lg:p-0" ref={workRef}>
            <h1 className="text-2xl font-bold">Work.</h1>
            <div className="mt-5 lg:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.projects.map((project) => (
                <WorkCard
                  key={project.id}
                  img={project.imageSrc}
                  name={project.title}
                  description={project.description}
                  onClick={() => window.open(project.url)}
                />
              ))}
            </div>
          </section>

          {/* Services Section */}
          <section className="mt-10 lg:mt-30 p-2 lg:p-0">
            <h1 className="md:m-10 text-2xl font-bold">Services.</h1>
            <div className="mt-5 md:m-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.services.map((service, index) => (
                <ServiceCard
                  key={index}
                  name={service.title}
                  description={service.description}
                />
              ))}
            </div>
          </section>

          {/* About Section */}
          <section
            className="mt-10 lg:mt-40 p-4 lg:p-1 w-full rounded"
            ref={aboutRef}
          >
            <h1 className="md:m-10 text-2xl font-bold">About.</h1>
            {/* <p className="md:m-10 mt-2 text-xl lg:text-3xl">
              {data.aboutpara}
            </p> */}
            <div
              className="md:m-10 mt-2 text-xl lg:text-3xl"
              dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
            />
          </section>

          {/* Development-Only Edit Button */}
          {process.env.NODE_ENV === "development" && (
            <div className="fixed bottom-5 right-5">
              <Link href="/edit">
                <Button type="primary">Edit Data</Button>
              </Link>
            </div>
          )}

          <Footer />
        </main>
      </div>
    </>
  );
}
