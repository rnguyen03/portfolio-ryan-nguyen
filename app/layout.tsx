import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import Head from "next/head";

export const metadata = {
  metadataBase: new URL('https://portfolio-ryan-nguyen.vercel.app'),
  title: {
    default: "Ryan Nguyen - Software Engineer | AI & Full Stack Development",
    template: "%s | Ryan Nguyen",
  },
  description: "Software Engineering student specializing in machine learning and full-stack development. View projects in AI systems, web applications, and software engineering.",
  openGraph: {
    title: "Ryan Nguyen - Software Engineer | AI & Full Stack Development",
    description: "Software Engineering student specializing in machine learning and full-stack development. View projects in AI systems, web applications, and software engineering.",
    url: "https://portfolio-ryan-nguyen.vercel.app/",
    siteName: "Ryan Nguyen - Software Engineer Portfolio",
    images: [
      {
        url: "https://portfolio-ryan-nguyen.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ryan Nguyen - Software Engineer Portfolio",
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
    title: "Ryan Nguyen - Software Engineer | AI & Full Stack Development",
    card: "summary_large_image",
    images: {
      url: "https://portfolio-ryan-nguyen.vercel.app/og.png",
      alt: "Ryan Nguyen - Software Engineer Portfolio",
    },
  },
  icons: {
    shortcut: "/favicon.png",
  },
  keywords: [
    "Ryan Nguyen",
    "Software Engineer",
    "Machine Learning Engineer",
    "Full Stack Developer",
    "AI Engineer",
    "Computer Science Student",
    "Deep Learning",
    "Python Developer",
    "React Developer",
    "Machine Learning Projects",
    "Web Development Portfolio",
    "Software Engineering Portfolio",
    "AI Projects",
    "Mobile Developer",
  ],
  authors: [{ name: "Ryan Nguyen" }],
  creator: "Ryan Nguyen",
  publisher: "Ryan Nguyen",
  alternates: {
    canonical: "https://portfolio-ryan-nguyen.vercel.app",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
  display: "swap", // Add display swap for better loading
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
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
      </head>
      <body className={process.env.NODE_ENV === "development" ? "debug-screens bg-black" : "bg-black"}>
        {children}
      </body>
    </html>
  );
}