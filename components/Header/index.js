import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import Button from "../Button";
import data from "../../data/portfolio.json";
import Image from "next/image";

const Header = ({ handleWorkScroll, handleAboutScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { name, showBlog, showResume, darkMode } = data;

  useEffect(() => setMounted(true), []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const renderMenuItems = useCallback(() => (
    <>
      {!isBlog ? (
        <>
          <Button onClick={handleWorkScroll}>Work</Button>
          <Button onClick={handleAboutScroll}>About</Button>
          {showBlog && <Button onClick={() => router.push("/blog")}>Blog</Button>}
          {showResume && <Button onClick={() => router.push("/resume")}>Resume</Button>}
          <Button onClick={() => window.open("mailto:thierno.sadou.barry98@gmail.com")}>Contact</Button>
        </>
      ) : (
        <>
          <Button onClick={() => router.push("/")}>Home</Button>
          {showBlog && <Button onClick={() => router.push("/blog")}>Blog</Button>}
          {showResume && <Button onClick={() => router.push("/resume")}>Resume</Button>}
          <Button onClick={() => window.open("mailto:thierno.sadou.barry98@gmail.com")}>Contact</Button>
        </>
      )}
    </>
  ), [isBlog, handleWorkScroll, handleAboutScroll, showBlog, showResume, router]);

  return (
    <div
      className={`sticky top-0 z-20 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      } shadow-md`}
    >
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center px-6 py-1">
        <h1
          onClick={() => router.push("/")}
          className="text-lg font-bold cursor-pointer"
        >
          {name}.
        </h1>
        <div className="flex items-center">
          {renderMenuItems()}
          {darkMode && mounted && (
            <Button onClick={toggleTheme} classes="ml-4">
              <Image
                width={24}
                height={24}
                alt="Theme Toggle"
                src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <Popover className="block md:hidden">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between px-4 py-3">
              <h1
                onClick={() => router.push("/")}
                className="text-lg font-bold cursor-pointer"
              >
                {name}.
              </h1>
              <div className="flex items-center space-x-4">
                {darkMode && mounted && (
                  <Button onClick={toggleTheme}>
                    <Image
                      width={24}
                      height={24}
                      alt="Theme Toggle"
                      src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                    />
                  </Button>
                )}
                <Popover.Button>
                  <Image
                    width={24}
                    height={24}
                    alt="Menu Toggle"
                    src={`/images/${
                      open
                        ? theme === "dark"
                          ? "cancel-white.svg"
                          : "cancel.svg"
                        : theme === "dark"
                        ? "menu-white.svg"
                        : "menu.svg"
                    }`}
                  />
                </Popover.Button>
              </div>
            </div>

            <Popover.Panel
              className={`absolute right-0 z-10 w-11/12 p-4 ${
                theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
              } shadow-md rounded-md`}
            >
              <div className="grid grid-cols-1 gap-2">{renderMenuItems()}</div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
};

export default Header;
