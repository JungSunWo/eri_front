#!/bin/bash

# Next.js 정적 배포 스크립트
# 사용법: ./deploy.sh

set -e  # 오류 발생 시 스크립트 중단

echo "🚀 Next.js 정적 배포 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. 의존성 설치 확인
log_info "의존성 설치 확인 중..."
if [ ! -d "node_modules" ]; then
    log_info "node_modules가 없습니다. npm install을 실행합니다..."
    npm install
else
    log_info "의존성이 이미 설치되어 있습니다."
fi

# 2. 빌드
log_info "Next.js 프로젝트 빌드 중..."
npm run build

if [ $? -eq 0 ]; then
    log_success "빌드가 성공적으로 완료되었습니다."
else
    log_error "빌드에 실패했습니다."
    exit 1
fi

# 3. out 디렉토리 확인
if [ ! -d "out" ]; then
    log_error "out 디렉토리가 생성되지 않았습니다."
    exit 1
fi

log_info "정적 파일이 생성되었습니다: $(ls -la out/ | wc -l) 개 파일"

# 4. nginx 설정 확인
log_info "nginx 설정 확인 중..."
if ! sudo nginx -t > /dev/null 2>&1; then
    log_error "nginx 설정에 오류가 있습니다."
    exit 1
fi

# 5. 파일 권한 설정
log_info "파일 권한 설정 중..."
sudo chown -R www-data:www-data out/
sudo chmod -R 755 out/

# 6. nginx 재시작
log_info "nginx 재시작 중..."
sudo systemctl reload nginx

if [ $? -eq 0 ]; then
    log_success "nginx가 성공적으로 재시작되었습니다."
else
    log_error "nginx 재시작에 실패했습니다."
    exit 1
fi

# 7. 서비스 상태 확인
log_info "서비스 상태 확인 중..."
if sudo systemctl is-active --quiet nginx; then
    log_success "nginx 서비스가 정상적으로 실행 중입니다."
else
    log_error "nginx 서비스가 실행되지 않고 있습니다."
    exit 1
fi

# 8. 포트 리스닝 확인
log_info "포트 리스닝 상태 확인 중..."
if ss -tlnp | grep -q ":80 "; then
    log_success "80번 포트가 정상적으로 리스닝 중입니다."
else
    log_error "80번 포트가 리스닝되지 않고 있습니다."
    exit 1
fi

# 9. 접속 테스트
log_info "웹사이트 접속 테스트 중..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    log_success "웹사이트가 정상적으로 접속 가능합니다."
else
    log_warning "웹사이트 접속 테스트에 실패했습니다. 수동으로 확인해 주세요."
fi

# 10. IP 주소 정보 출력
log_info "서버 정보:"
echo "  - 내부 접속: http://localhost"
echo "  - 외부 접속: http://$(hostname -I | awk '{print $1}')"
echo "  - 포트: 80"

log_success "배포가 완료되었습니다! 🎉"

# 선택적: 브라우저에서 열기
read -p "브라우저에서 웹사이트를 열까요? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost
    elif command -v open > /dev/null; then
        open http://localhost
    else
        log_warning "브라우저를 자동으로 열 수 없습니다. 수동으로 접속해 주세요."
    fi
fi
