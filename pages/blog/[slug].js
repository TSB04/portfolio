import React, { useRef, useState } from "react";
import { getPostBySlug, getAllPosts } from "../../utils/api";
import Header from "../../components/Header";
import ContentSection from "../../components/ContentSection";
import Footer from "../../components/Footer";
import Head from "next/head";
import { useIsomorphicLayoutEffect } from "../../utils";
import { stagger } from "../../animations";
import Button from "../../components/Button";
import BlogEditor from "../../components/BlogEditor";
import { useRouter } from "next/router";
import Cursor from "../../components/Cursor";
import data from "../../data/portfolio.json";
import Image from "next/image";

const BlogPost = ({ post }) => {
  const [showEditor, setShowEditor] = useState(false);
  const textOneRef = useRef(null);
  const textTwoRef = useRef(null);
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    stagger([textOneRef.current, textTwoRef.current], { y: 30 }, { y: 0 });
  }, []);

  const handleEditToggle = () => setShowEditor((prev) => !prev);

  return (
    <>
      <Head>
        <title>{`Blog - ${post.title}`}</title>
        <meta name="description" content={post.preview} />
      </Head>

      {data.showCursor && <Cursor />}

      <div className={`container mx-auto mt-10 ${data.showCursor && "cursor-none"}`}>
        <Header isBlog />
        <div className="mt-10 flex flex-col">
          <div className="relative w-full h-96 rounded-lg shadow-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              layout="fill"
              className="object-cover"
            />
          </div>
          <h1
            ref={textOneRef}
            className="mt-10 text-4xl mob:text-2xl laptop:text-6xl font-bold"
          >
            {post.title}
          </h1>
          <h2
            ref={textTwoRef}
            className="mt-2 text-xl max-w-4xl text-darkgray opacity-50"
          >
            {post.tagline}
          </h2>
        </div>
        <ContentSection content={post.content} />
        <Footer />
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={handleEditToggle} type="primary">
            {showEditor ? "Close Editor" : "Edit this blog"}
          </Button>
        </div>
      )}

      {showEditor && (
        <BlogEditor
          post={post}
          close={handleEditToggle}
          refresh={() => router.reload(window.location.pathname)}
        />
      )}
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const post = getPostBySlug(params.slug, [
    "date",
    "slug",
    "preview",
    "title",
    "tagline",
    "image",
    "content",
  ]);

  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths = async () => {
  const posts = getAllPosts(["slug"]);
  const paths = posts.map(({ slug }) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export default BlogPost;
