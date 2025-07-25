/** @type {import('next').NextConfig} */
const nextConfig = {
  // 컴파일러 설정
  compiler: {
    styledComponents: true,
    // 개발 시 불필요한 콘솔 로그 제거
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // React StrictMode 설정
  reactStrictMode: false,

  // 이미지 최적화 설정
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // API 프록시 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },

  // 리다이렉트 설정
  async redirects() {
    return [
      // 예시: www 없이 접근 시 www로 리다이렉트
      // {
      //   source: '/:path*',
      //   has: [
      //     {
      //       type: 'host',
      //       value: '(?!www\.).*',
      //     },
      //   ],
      //   destination: 'https://www.yourdomain.com/:path*',
      //   permanent: true,
      // },
    ];
  },

  // 타입스크립트 설정
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },

  // 압축 설정
  compress: true,

  // 개발 서버 설정
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // 정적 파일 최적화
  poweredByHeader: false,

  // 트레일링 슬래시 설정
  trailingSlash: false,

  // 페이지 확장자 설정
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // 이미지 최적화 설정
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 정적 export 설정
  // output: 'export',
};

export default nextConfig;
