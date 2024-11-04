import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "wid-residencies.sgp1.digitaloceanspaces.com",
      "cdn.sanity.io",
      "smartrehabcity.co",
      "dynamic-media-cdn.tripadvisor.com",
      "images.pexels.com",
      "cf.bstatic.com",
      "www.parisattitude.com",
      "www.apartments.com",
      "cdn-icons-png.flaticon.com",
    ], // Add your domain here
  },
};

export default withNextIntl(nextConfig);
