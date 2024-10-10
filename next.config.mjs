import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	experimental: {
		metadataBase: 'https://portfolio-ryan-nguyen.vercel.app/',
		mdxRs: true,
	},
};

export default withContentlayer(nextConfig);
