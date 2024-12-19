import Head from "next/head";

const SEOHead = ({ data }) => (
  <Head>
    <title>{data.name} - {data.headerTaglineThree}</title>
    <meta name="description" content={data.aboutpara.replace(/<[^>]+>/g, '').slice(0, 160)} />
    <link rel="icon" href="/favicon.ico" />
    
    {/* Open Graph Metadata */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={`${data.name} - ${data.headerTaglineThree}`} />
    <meta property="og:description" content={data.aboutpara.replace(/<[^>]+>/g, '').slice(0, 200)} />
    <meta property="og:image" content="/images/profile-image.jpg" />
    <meta property="og:url" content="https://tsb04.com/" />
    
    {/* Twitter Metadata */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="tsb04.com" />
    <meta property="twitter:url" content="https://tsb04.com/" />
    <meta name="twitter:title" content={`${data.name} - ${data.headerTaglineThree}`} />
    <meta name="twitter:description" content={data.aboutpara.replace(/<[^>]+>/g, '').slice(0, 200)} />
    <meta name="twitter:image" content="/images/profile-image.jpg" />
    
    {/* Additional Metadata */}
    <meta name="author" content={data.name} />
    <meta name="keywords" content="Full Stack Developer, Web Design, NestJS, React, Portfolio, Paris Developer" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    {/* Canonical Link */}
    <link rel="canonical" href="https://tsb04.com/" />
    
    {/* Structured Data */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "http://schema.org",
          "@type": "Person",
          name: data.name,
          jobTitle: "Full Stack Developer",
          description: data.aboutpara.replace(/<[^>]+>/g, ''),
          url: "https://tsb04.com/",
          sameAs: [
            "https://github.com/tsb04",
            "https://www.linkedin.com/in/tsb04/",
            "https://twitter.com/tsb04",
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Paris",
            addressCountry: "France",
          },
        }),
      }}
    />
  </Head>
);

export default SEOHead;
