import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import Head from "next/head";

export const metadata = {
  title: {
    default: "Ryan Nguyen's Portfolio - Aspiring AI Engineer and Full Stack Developer",
    template: "%s | Ryan Nguyen's Portfolio",
  },
  description: "Explore the portfolio of Ryan Nguyen, an aspiring AI Engineer and Full Stack Developer. Discover projects, skills, and experiences in AI, machine learning, and web development.",
  openGraph: {
    title: "Ryan Nguyen's Portfolio - Aspiring AI Engineer and Full Stack Developer",
    description: "Explore the portfolio of Ryan Nguyen, an aspiring AI Engineer and Full Stack Developer. Discover projects, skills, and experiences in AI, machine learning, and web development.",
    url: "https://portfolio-ryan-nguyen.vercel.app/",
    siteName: "Ryan Nguyen's Portfolio",
    images: [
      {
        url: "https://portfolio-ryan-nguyen.vercel.app/og-image.png",
        width: 1920,
        height: 1080,
        alt: "Ryan Nguyen's Portfolio",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Ryan Nguyen's Portfolio - Aspiring AI Engineer and Full Stack Developer",
    card: "summary_large_image",
    images: {
      url: "https://portfolio-ryan-nguyen.vercel.app/og.png",
      alt: "Ryan Nguyen's Portfolio",
    },
  },
  icons: {
    shortcut: "/favicon.png",
  },
  keywords: [
    "Ryan Nguyen",
    "AI Engineer",
    "Full Stack Developer",
    "Machine Learning",
    "Web Development",
    "Portfolio",
    "Software Engineer",
  ],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-Q8VE7VEYQR`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Q8VE7VEYQR');
            `,
          }}
        />
      <body className={process.env.NODE_ENV === "development" ? "debug-screens bg-black" : "bg-black"}>
        {children}
      </body>
    </html>
  );
}
