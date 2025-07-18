# Next.js 정적 빌드 및 nginx 배포 가이드

## 📋 개요

이 문서는 Next.js 프로젝트를 정적 파일로 빌드하고 nginx를 통해 배포하는 방법을 설명합니다.

## 🚀 1. 프로젝트 준비

```bash
# 프로젝트 클론 (필요시)
git clone [레포주소]
cd eri_front

# 의존성 설치
npm install
```

## ⚙️ 2. 정적 빌드 설정

### next.config.mjs 수정

```js
const nextConfig = {
  // ... 기존 설정 ...

  // 정적 export 설정
  output: "export",

  // 이미지 최적화 설정
  images: {
    unoptimized: true, // 정적 export 시 필요
    domains: [],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
```

## 🔧 3. 동적 라우트 정적화

### 예시: `/resources/notice/[id]/page.js`

동적 라우트가 있는 페이지는 `generateStaticParams` 함수를 추가해야 합니다.

```js
import PageWrapper from "@/components/layout/PageWrapper";
import { noticeAPI } from "@/lib/api";

// 정적 생성 시 사용할 ID 목록
export async function generateStaticParams() {
  // 실제로는 API에서 공지사항 목록을 가져와서 ID들을 반환해야 합니다
  // 현재는 예시로 몇 개의 ID를 하드코딩합니다
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
}

export default async function NoticeDetailPage({ params }) {
  const { id } = params;

  let data = null;
  let error = null;

  try {
    data = await noticeAPI.getNoticeDetail(id);
  } catch (e) {
    error = e.message;
  }

  return (
    <PageWrapper title="자료실" subtitle="공지사항 상세" showCard={false}>
      <div className="max-w-3xl mx-auto p-8">
        <a href="/resources/notice" className="mb-4 text-blue-600 underline">
          &larr; 목록으로
        </a>
        {error ? (
          <div className="text-red-500">오류: {error}</div>
        ) : !data ? (
          <div>데이터가 없습니다.</div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-2">{data.ttl}</h1>
            <div className="mb-2 text-gray-600">
              작성자: {data.regEmpId || "-"}
            </div>
            <div className="mb-2 text-gray-500">
              작성일: {data.regDate?.slice(0, 10) || "-"}
            </div>
            <div className="mb-2 text-gray-500">상태: {data.stsCd || "-"}</div>
            <div
              className="prose mt-6"
              dangerouslySetInnerHTML={{ __html: data.cntn || "" }}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
```

## 🏗️ 4. 빌드 및 정적 파일 생성

```bash
# 프로덕션 빌드
npm run build
```

빌드가 완료되면 `/out` 폴더에 정적 파일이 생성됩니다.

### 빌드 결과 확인

```bash
ls -la out/
```

## 🌐 5. nginx 설치 및 설정

### 1) nginx 설치

```bash
sudo apt update
sudo apt install -y nginx
```

### 2) nginx 설정 파일 생성

```bash
sudo tee /etc/nginx/sites-available/eri-front << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;

    # 정적 파일 서빙을 위한 루트 디렉토리
    root /opt/eri-project/eri_front/out;

    # gzip 압축 활성화
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Next.js 정적 파일 (캐싱)
    location /_next/static/ {
        alias /opt/eri-project/eri_front/out/_next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # 메인 애플리케이션 - 정적 HTML 파일
    location / {
        try_files $uri $uri.html $uri/ /index.html;
        index index.html index.htm;
    }

    # 에러 페이지
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
EOF
```

### 3) nginx 설정 활성화

```bash
# 심볼릭 링크 생성
sudo ln -sf /etc/nginx/sites-available/eri-front /etc/nginx/sites-enabled/

# 설정 테스트
sudo nginx -t

# nginx 재시작
sudo systemctl restart nginx
```

## 🔒 6. 방화벽 설정

```bash
# 80번 포트 허용
sudo ufw allow 80/tcp

# 방화벽 상태 확인
sudo ufw status
```

## 🌍 7. 외부 접속 설정

### 네트워크 정보 확인

```bash
# IP 주소 확인
ip addr show

# 포트 리스닝 상태 확인
ss -tlnp | grep :80
```

### 접속 테스트

```bash
# 내부 접속 테스트
curl -I http://localhost

# 외부 IP 접속 테스트
curl -I http://[서버IP]
```

## 📊 8. 배포 확인

### 접속 정보

- **내부 접속**: `http://localhost`
- **외부 접속**: `http://[서버IP]`
- **포트**: 80

### 정상 작동 확인 사항

- [ ] nginx 서비스 실행 중
- [ ] 80번 포트 리스닝
- [ ] 방화벽에서 80번 포트 허용
- [ ] 웹페이지 정상 로드
- [ ] 정적 파일 (CSS, JS) 정상 로드

## 🔄 9. 업데이트 배포

새로운 변경사항이 있을 때:

```bash
# 1. 코드 변경 후 빌드
npm run build

# 2. nginx 재시작 (필요시)
sudo systemctl reload nginx
```

## 🐛 10. 문제 해결

### nginx 로그 확인

```bash
# 에러 로그
sudo tail -f /var/log/nginx/error.log

# 액세스 로그
sudo tail -f /var/log/nginx/access.log
```

### nginx 상태 확인

```bash
# 서비스 상태
sudo systemctl status nginx

# 설정 테스트
sudo nginx -t
```

### 권한 문제 해결

```bash
# 파일 권한 설정
sudo chown -R www-data:www-data /opt/eri-project/eri_front/out
sudo chmod -R 755 /opt/eri-project/eri_front/out
```

## 📝 11. 주의사항

1. **동적 라우트**: `generateStaticParams`에 명시된 ID만 정적으로 생성됩니다.
2. **새 데이터**: 새로운 공지사항이나 데이터가 추가되면 재빌드가 필요합니다.
3. **API 연동**: 정적 배포이므로 서버 사이드 API 호출은 빌드 시점에만 실행됩니다.
4. **실시간 데이터**: 실시간으로 변경되는 데이터는 클라이언트 사이드에서 처리해야 합니다.

## 🔗 12. 관련 링크

- [Next.js 정적 Export 공식 문서](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [nginx 공식 문서](https://nginx.org/en/docs/)
- [Ubuntu 방화벽 설정](https://ubuntu.com/server/docs/security-firewall)

---

**문의사항**: 개발팀에 문의하거나 이슈를 등록해 주세요.
