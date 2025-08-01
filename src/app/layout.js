/**
 * @File Name      : layout.js
 * @File path      : src/app/layout.js
 * @author         : 정선우
 * @Description    : Next.js 13+ App Router의 루트 레이아웃 컴포넌트
 *                   모든 페이지에 공통으로 적용되는 HTML 구조와 메타데이터를 정의
 * @History        : 20250701  최초 신규
 **/

import ConsultationPopupProvider from "@/app/shared/components/ConsultationPopupProvider";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter 폰트 설정 - Google Fonts에서 가져온 웹 폰트
const inter = Inter({ subsets: ["latin"] });

// 메타데이터 설정 - SEO 및 브라우저 탭에 표시될 정보
export const metadata = {
  title: "직원권익보호 포탈",
  description: "직원권익보호 포탈",
};

/**
 * 루트 레이아웃 컴포넌트
 * @param {Object} children - 하위 페이지 컴포넌트들
 * @returns {JSX.Element} HTML 문서 구조
 */
export default function RootLayout({ children }) {

  return (
    <html lang="ko">
      <body className={inter.className}>
        <ConsultationPopupProvider>
          {children}
        </ConsultationPopupProvider>
      </body>
    </html>
  );
}
