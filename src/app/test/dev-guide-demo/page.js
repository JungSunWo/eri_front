/**
 * @File Name      : page.js
 * @File path      : src/app/test/dev-guide-demo/page.js
 * @author         : 정선우
 * @Description    : 개발 가이드 데모 페이지
 *                   - 프로젝트 구조 및 아키텍처 설명
 *                   - 컴포넌트 사용법 및 예제
 *                   - API 연동 방법 및 코드 스니펫
 *                   - 개발 환경 설정 및 배포 가이드
 * @History        : 20250701  최초 신규
 **/

'use client';

import { CmpBadge, CmpInput, CmpSelect, CmpTextarea, CommonModal } from '@/app/shared/components/ui';
import { toast } from '@/app/shared/utils/ui_com';
import {
  BookOpen,
  Database,
  GitBranch,
  Globe,
  Layers,
  Package,
  Search,
  Settings,
  Users,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DevGuideDemoPage() {
  const [guides, setGuides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [loading, setLoading] = useState(false);

  // 검색 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    id: '',
    category: '',
    title: '',
    description: '',
    content: ''
  });

  // 가이드 카테고리 정의
  const categories = [
    { value: '', label: '전체' },
    { value: 'architecture', label: '아키텍처' },
    { value: 'components', label: '컴포넌트' },
    { value: 'api', label: 'API 연동' },
    { value: 'database', label: '데이터베이스' },
    { value: 'deployment', label: '배포' },
    { value: 'development', label: '개발 환경' }
  ];

  // 초기 가이드 데이터
  const initialGuides = [
    {
      id: 1,
      category: 'architecture',
      title: '프로젝트 구조 및 아키텍처',
      description: 'ERI 프로젝트의 전체적인 구조와 기술 스택에 대한 설명',
      icon: Layers,
      content: `# 프로젝트 구조

## 프론트엔드 (Next.js)
\`\`\`
eri_front/
├── src/
│   ├── app/           # Next.js 13+ App Router
│   ├── components/    # 재사용 가능한 컴포넌트
│   ├── common/        # 공통 유틸리티 및 설정
│   └── lib/          # API 연동 및 외부 라이브러리
\`\`\`

## 백엔드 (Spring Boot)
\`\`\`
ERI/
├── src/main/java/
│   └── com/ERI/demo/
│       ├── Controller/    # REST API 컨트롤러
│       ├── service/       # 비즈니스 로직
│       ├── mappers/       # MyBatis 매퍼
│       └── vo/           # 데이터 객체
\`\`\`

## 기술 스택
- **Frontend**: Next.js 13+, React 18, Tailwind CSS
- **Backend**: Spring Boot 3.x, MyBatis, PostgreSQL
- **Database**: PostgreSQL (개발/운영)
- **Deployment**: Docker, Tomcat`,
      author: '정선우',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15',
      viewCount: 125
    },
    {
      id: 2,
      category: 'components',
      title: '컴포넌트 사용법',
      description: '재사용 가능한 UI 컴포넌트들의 사용법과 예제',
      icon: Package,
      content: `# UI 컴포넌트 가이드

## 기본 컴포넌트

### CmpInput (입력 필드)
\`\`\`jsx
import { CmpInput } from '@/app/shared/components/ui';

<CmpInput
  placeholder="입력하세요"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  required
/>
\`\`\`

### CmpSelect (선택 박스)
\`\`\`jsx
import { CmpSelect } from '@/app/shared/components/ui';

<CmpSelect
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  options={[
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' }
  ]}
  placeholder="선택하세요"
/>
\`\`\`

### CmpBadge (뱃지)
\`\`\`jsx
import { CmpBadge } from '@/app/shared/components/ui';

<CmpBadge variant="default">기본</CmpBadge>
<CmpBadge variant="secondary">보조</CmpBadge>
<CmpBadge variant="destructive">삭제</CmpBadge>
\`\`\``,
      author: '정선우',
      createdAt: '2025-01-16',
      updatedAt: '2025-01-16',
      viewCount: 89
    },
    {
      id: 3,
      category: 'api',
      title: 'API 연동 방법',
      description: '백엔드 API와의 연동 방법 및 코드 예제',
      icon: Globe,
      content: `# API 연동 가이드

## API 설정

### 환경 설정
\`\`\`javascript
// src/common/env.config.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
export const API_TIMEOUT = 30000;
\`\`\`

### API 클라이언트
\`\`\`javascript
// src/lib/api.js
import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/app/shared/config/env.config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
\`\`\`

## API 사용 예제

### GET 요청
\`\`\`javascript
const getNoticeList = async (params) => {
  try {
    const response = await apiClient.get('/api/notices', { params });
    return response.data;
  } catch (error) {
    throw new Error('공지사항 목록 조회 실패');
  }
};
\`\`\``,
      author: '정선우',
      createdAt: '2025-01-17',
      updatedAt: '2025-01-17',
      viewCount: 156
    },
    {
      id: 4,
      category: 'database',
      title: '데이터베이스 설계',
      description: 'PostgreSQL 데이터베이스 스키마 및 관계 설명',
      icon: Database,
      content: `# 데이터베이스 설계 가이드

## 데이터베이스 개요
- **DBMS**: PostgreSQL 15+
- **인코딩**: UTF-8
- **타임존**: Asia/Seoul

## 주요 테이블 구조

### 공지사항 (TB_NTI_LST)
\`\`\`sql
CREATE TABLE TB_NTI_LST (
    SEQ BIGSERIAL PRIMARY KEY,
    TTL VARCHAR(200) NOT NULL,
    CNTN TEXT,
    STS_CD VARCHAR(10) DEFAULT 'STS001',
    REG_EMP_ID VARCHAR(20),
    REG_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPD_EMP_ID VARCHAR(20),
    UPD_DATE TIMESTAMP,
    FILE_ATTACH_YN CHAR(1) DEFAULT 'N'
);
\`\`\`

### 직원 정보 (TB_EMP_LST)
\`\`\`sql
CREATE TABLE TB_EMP_LST (
    EMP_ID VARCHAR(20) PRIMARY KEY,
    EMP_NM VARCHAR(50) NOT NULL,
    DEPT_CD VARCHAR(10),
    POS_CD VARCHAR(10),
    STS_CD VARCHAR(10) DEFAULT 'STS001',
    REG_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPD_DATE TIMESTAMP
);
\`\`\``,
      author: '정선우',
      createdAt: '2025-01-18',
      updatedAt: '2025-01-18',
      viewCount: 78
    },
    {
      id: 5,
      category: 'deployment',
      title: '배포 가이드',
      description: '개발/운영 환경 배포 방법 및 설정',
      icon: GitBranch,
      content: `# 배포 가이드

## 개발 환경 설정

### 1. 프론트엔드 빌드
\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
\`\`\`

### 2. 백엔드 빌드
\`\`\`bash
# Maven 빌드
./mvnw clean package

# 개발 환경 실행
./mvnw spring-boot:run -Dspring.profiles.active=dev

# 프로덕션 환경 실행
java -jar target/eri-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
\`\`\`

## Docker 배포

### 프론트엔드 Dockerfile
\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\``,
      author: '정선우',
      createdAt: '2025-01-19',
      updatedAt: '2025-01-19',
      viewCount: 92
    },
    {
      id: 6,
      category: 'development',
      title: '개발 환경 설정',
      description: '개발자 환경 설정 및 개발 도구 사용법',
      icon: Settings,
      content: `# 개발 환경 설정 가이드

## 필수 소프트웨어

### 1. Node.js & npm
- **버전**: 18.x 이상
- **설치**: https://nodejs.org/
- **확인**: \`node --version\`, \`npm --version\`

### 2. Java & Maven
- **Java 버전**: 17 이상
- **Maven 버전**: 3.8.x 이상
- **확인**: \`java --version\`, \`mvn --version\`

### 3. PostgreSQL
- **버전**: 15.x 이상
- **설치**: https://www.postgresql.org/download/
- **확인**: \`psql --version\`

### 4. Git
- **버전**: 2.x 이상
- **설치**: https://git-scm.com/
- **확인**: \`git --version\`

## IDE 설정

### VS Code 추천 확장
\`\`\`json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-java-pack",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-json"
  ]
}
\`\`\``,
      author: '정선우',
      createdAt: '2025-01-20',
      updatedAt: '2025-01-20',
      viewCount: 134
    }
  ];

  // 페이지 로드 시 가이드 목록 초기화
  useEffect(() => {
    loadGuideList();
  }, []);

  // 가이드 목록 조회
  const loadGuideList = async (page = 1) => {
    setLoading(true);
    try {
      // 실제 API 호출 대신 로컬 데이터 사용
      const filteredGuides = initialGuides.filter(guide => {
        const matchesKeyword = guide.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                              guide.description.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesCategory = !selectedCategory || guide.category === selectedCategory;
        return matchesKeyword && matchesCategory;
      });

      // 페이지네이션 처리
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedGuides = filteredGuides.slice(startIndex, endIndex);

      setGuides(paginatedGuides);
      setTotalPages(Math.ceil(filteredGuides.length / pageSize));
      setCurrentPage(page);
    } catch (error) {
      toast.callCommonToastOpen('가이드 목록 조회 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 검색
  const handleSearch = () => {
    loadGuideList(1);
  };

  // 검색 조건 초기화
  const handleResetSearch = () => {
    setSearchKeyword('');
    setSelectedCategory('');
    loadGuideList(1);
  };

  // 가이드 등록 모달 열기
  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({
      id: '',
      category: '',
      title: '',
      description: '',
      content: ''
    });
    setSelectedGuide(null);
    setIsModalOpen(true);
  };

  // 가이드 수정 모달 열기
  const openEditModal = (guide) => {
    setIsEditMode(true);
    setFormData({
      id: guide.id,
      category: guide.category,
      title: guide.title,
      description: guide.description,
      content: guide.content
    });
    setSelectedGuide(guide);
    setIsModalOpen(true);
  };

  // 가이드 삭제
  const deleteGuide = async (id) => {
    if (!confirm('정말로 이 가이드를 삭제하시겠습니까?')) {
      return;
    }

    try {
      // 실제 API 호출 대신 로컬 데이터에서 삭제
      const updatedGuides = initialGuides.filter(guide => guide.id !== id);
      // 여기서는 간단히 목록을 다시 로드
      toast.callCommonToastOpen('가이드가 삭제되었습니다.');
      loadGuideList(currentPage);
    } catch (error) {
      toast.callCommonToastOpen('가이드 삭제 실패: ' + error.message);
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // 수정 모드
        toast.callCommonToastOpen('가이드가 수정되었습니다.');
      } else {
        // 등록 모드
        toast.callCommonToastOpen('가이드가 등록되었습니다.');
      }

      setIsModalOpen(false);
      loadGuideList(currentPage);
    } catch (error) {
      toast.callCommonToastOpen((isEditMode ? '가이드 수정' : '가이드 등록') + ' 실패: ' + error.message);
    }
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // 이전 페이지 버튼
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          onClick={() => loadGuideList(currentPage - 1)}
        >
          이전
        </button>
      );
    }

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 border rounded text-sm ${
            i === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => loadGuideList(i)}
        >
          {i}
        </button>
      );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          onClick={() => loadGuideList(currentPage + 1)}
        >
          다음
        </button>
      );
    }

    return (
      <div className="flex justify-center gap-2 mt-6">
        {pages}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">개발 가이드 데모</h1>
          <p className="text-gray-600">프로젝트 개발 가이드 및 문서를 관리할 수 있는 페이지입니다.</p>
        </div>

        {/* 검색 및 등록 버튼 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">검색 및 등록</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="searchKeyword" className="block text-sm font-medium text-gray-700 mb-1">
                키워드 검색
              </label>
              <CmpInput
                id="searchKeyword"
                placeholder="가이드 제목이나 내용을 검색하세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
            </div>
            <div className="w-48">
              <label htmlFor="selectedCategory" className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <CmpSelect
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                options={categories}
                placeholder="전체"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '검색 중...' : '검색'}
            </button>
            <button
              onClick={handleResetSearch}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              초기화
            </button>
          </div>
        </div>

        {/* 가이드 목록 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">가이드 목록</h2>
            {(searchKeyword || selectedCategory) && (
              <div className="text-sm text-gray-600">
                검색 조건:
                {searchKeyword && <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">키워드: {searchKeyword}</span>}
                {selectedCategory && <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded">카테고리: {categories.find(cat => cat.value === selectedCategory)?.label}</span>}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : guides.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchKeyword || selectedCategory ? '검색 조건에 맞는 가이드가 없습니다.' : '등록된 가이드가 없습니다.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => {
                const IconComponent = guide.icon;
                return (
                  <div key={guide.id} className="border rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-8 h-8 text-blue-500" />
                        <div>
                          <h3 className="text-lg font-semibold">{guide.title}</h3>
                          <CmpBadge variant={guide.category === 'architecture' ? 'default' : 'secondary'} className="mt-1">
                            {categories.find(cat => cat.value === guide.category)?.label}
                          </CmpBadge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>작성자: {guide.author}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {guide.description}
                    </p>

                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center gap-1"
                        onClick={() => {
                          setSelectedGuide(guide);
                          setIsModalOpen(true);
                        }}
                      >
                        <BookOpen className="w-4 h-4" />
                        보기
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {renderPagination()}
        </div>

        {/* 가이드 등록/수정 모달 */}
        <CommonModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGuide(null);
          }}
          title={isEditMode ? '가이드 수정' : (selectedGuide ? '가이드 상세' : '가이드 등록')}
          size="full"
        >
          {selectedGuide && !isEditMode ? (
            // 가이드 상세 보기 모드
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                {(() => {
                  const IconComponent = selectedGuide.icon;
                  return <IconComponent className="w-6 h-6 text-blue-500" />;
                })()}
                <CmpBadge variant="secondary">
                  {categories.find(cat => cat.value === selectedGuide.category)?.label}
                </CmpBadge>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-4">{selectedGuide.description}</p>
              </div>

              <div className="border-t pt-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{selectedGuide.content}</code>
                  </pre>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          ) : (
            // 가이드 등록/수정 폼
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 *
                  </label>
                  <CmpSelect
                    value={formData.category}
                    onChange={(value) => setFormData({...formData, category: value})}
                    options={categories.filter(cat => cat.value !== '')}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
                  </label>
                  <CmpInput
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  설명 *
                </label>
                <CmpTextarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="resize-none"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  내용 *
                </label>
                <CmpTextarea
                  id="content"
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  className="resize-none"
                  placeholder="마크다운 형식으로 작성하세요..."
                />
              </div>

              <div className="border-t pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isEditMode ? '수정' : '등록'}
                </button>
              </div>
            </form>
          )}
        </CommonModal>


      </div>
    </div>
  );
}
