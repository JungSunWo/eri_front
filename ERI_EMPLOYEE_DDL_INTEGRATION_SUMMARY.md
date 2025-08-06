# ERI_EMPLOYEE_DDL_PostgreSQL.sql DDL 구조에 맞는 백엔드/프론트엔드 소스 수정 완료

## 📋 수정 개요

`ERI_EMPLOYEE_DDL_PostgreSQL.sql` 파일의 DDL 구조에 맞춰 백엔드와 프론트엔드 소스를 수정했습니다.

## 🔧 백엔드 수정 사항

### 1. EmpLstVO.java 수정

**파일**: `ERI/src/main/java/com/ERI/demo/vo/employee/EmpLstVO.java`

**변경 내용**:

```java
// 변경 전
private LocalDateTime delDate; // 삭제 일시
private LocalDateTime regDate; // 등록 일시
private LocalDateTime updDate; // 수정 일시

// 변경 후
private LocalDateTime delDt;  // 삭제 일시
private LocalDateTime regDt;  // 등록 일시
private LocalDateTime updDt;  // 수정 일시
```

### 2. EmpLstMapper.xml 수정

**파일**: `ERI/src/main/resources/mappers/employee/EmpLstMapper.xml`

**변경 내용**:

- 모든 SQL 쿼리에서 `DEL_DATE` → `DEL_DT`
- 모든 SQL 쿼리에서 `REG_DATE` → `REG_DT`
- 모든 SQL 쿼리에서 `UPD_DATE` → `UPD_DT`
- ResultMap 매핑도 동일하게 수정

### 3. EmpLstService.java 수정

**파일**: `ERI/src/main/java/com/ERI/demo/service/EmpLstService.java`

**변경 내용**:

```java
// 변경 전
empRefVO.setRegDate(empLstVO.getRegDate());
empRefVO.setUpdDate(empLstVO.getUpdDate());

// 변경 후
empRefVO.setRegDt(empLstVO.getRegDt());
empRefVO.setUpdDt(empLstVO.getUpdDt());
```

## 🎨 프론트엔드 수정 사항

### 1. 직원 관리 페이지 생성

**파일**: `eoc_front/src/app/(pages)/employee/page.js`

**주요 기능**:

- 직원 목록 조회 및 표시
- 조건별 직원 검색 (이름, ID, 이메일, 부점)
- 직급/재직상태 한글 변환
- DDL 구조 정보 표시
- 반응형 테이블 레이아웃

**주요 특징**:

```javascript
// 직급 코드 한글 변환
const getJobClassText = (jbclCd) => {
  const jobClassMap = {
    1: "11급",
    2: "22급",
    3: "33급",
    4: "44급",
    5: "55급",
    6: "66급",
    9: "99급",
  };
  return jobClassMap[jbclCd] || jbclCd;
};

// 재직 여부 한글 변환
const getEmploymentStatus = (hlofYn) => {
  return hlofYn === "Y" ? "재직" : "퇴직";
};
```

### 2. API 라우트 핸들러 생성

**파일**: `eoc_front/src/app/api/employee/route.js`

**주요 기능**:

- 백엔드 API 프록시 역할
- GET 요청: 직원 목록 조회 및 검색
- POST 요청: 직원 정보 등록
- 에러 처리 및 응답 포맷팅

## 🗄️ DDL 구조 정보

### 테이블 구조

```sql
CREATE TABLE TB_EMP_LST (
    EMP_ID          VARCHAR(255) NOT NULL,           -- 실제 직원번호
    ERI_EMP_ID      VARCHAR(20)  NOT NULL,           -- ERI 시스템 내부 식별번호
    EMP_NM          VARCHAR(50)  NULL,               -- 직원명
    GNDR_DCD        CHAR(1)      NULL,               -- 성별구분코드
    HLOF_YN         CHAR(1)      NULL,               -- 재직여부
    ETBN_YMD        DATE         NULL,               -- 입행년월일
    BLNG_BRCD       CHAR(4)      NULL,               -- 소속부점코드
    BETEAM_CD       CHAR(4)      NULL,               -- 소속팀코드
    EXIG_BLNG_YMD   DATE         NULL,               -- 현소속년월일
    TRTH_WORK_BRCD  CHAR(4)      NULL,               -- 실제근무부점코드
    RSWR_BRCD       CHAR(4)      NULL,               -- 주재근무부점코드
    JBTT_CD         CHAR(4)      NULL,               -- 직위코드
    JBTT_YMD        DATE         NULL,               -- 직위년월일
    NAME_NM         VARCHAR(30)  NULL,               -- 호칭명
    JBCL_CD         CHAR(1)      NULL,               -- 직급코드
    TRTH_BIRT_YMD   DATE         NULL,               -- 실제생년월일
    SLCN_UNCG_BIRT_YMD DATE      NULL,               -- 양력환산생년월일
    INSL_DCD        CHAR(1)      NULL,               -- 음양구분코드
    EMP_CPN         VARCHAR(50)  NULL,               -- 직원휴대폰번호
    EMP_EXTI_NO     VARCHAR(50)  NULL,               -- 직원내선번호
    EAD             VARCHAR(50)  NULL,               -- 이메일주소
    DEL_YN          CHAR(1)      NOT NULL DEFAULT 'N',
    DEL_DT          TIMESTAMP    NULL,
    REG_DT          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPD_DT          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (EMP_ID),
    UNIQUE (ERI_EMP_ID)
);
```

### 보안 특징

- **별도 인스턴스**: `eri_employee_db` (포트 5433)
- **이중 ID 시스템**: 실제 직원번호 + ERI 내부 ID
- **데이터 암호화**: 이메일/전화번호 자동 암호화
- **논리 삭제**: `DEL_YN` 플래그 사용
- **은행 데이터 사전 기반**: 표준화된 컬럼명

## 🔗 API 엔드포인트

### 백엔드 API (Spring Boot)

```
GET  /api/employee/list              # 전체 직원 목록
GET  /api/employee/{eriEmpId}        # ERI_EMP_ID로 조회
GET  /api/employee/by-emp-id/{empId} # EMP_ID로 조회
GET  /api/employee/branch/{branchCd} # 부점별 조회
GET  /api/employee/search            # 조건별 검색
POST /api/employee                   # 직원 등록
PUT  /api/employee/{eriEmpId}       # 직원 수정
DELETE /api/employee/{eriEmpId}     # 직원 삭제
GET  /api/employee/count            # 직원 수 조회
GET  /api/employee/test-connection  # DB 연결 테스트
```

### 프론트엔드 API (Next.js)

```
GET  /api/employee                   # 직원 목록/검색
POST /api/employee                   # 직원 등록
```

## 🚀 사용 방법

### 1. 백엔드 실행

```bash
cd ERI
./mvnw spring-boot:run
```

### 2. 프론트엔드 실행

```bash
cd eoc_front
npm run dev
```

### 3. 직원 관리 페이지 접속

```
http://localhost:3000/employee
```

## 📊 데이터 흐름

1. **프론트엔드** → `/api/employee` (Next.js API Route)
2. **Next.js API Route** → `http://localhost:8080/api/employee/*` (Spring Boot)
3. **Spring Boot** → `TB_EMP_LST` 테이블 (PostgreSQL)
4. **응답** → 프론트엔드로 반환

## ✅ 검증 사항

- [x] DDL 필드명과 Java VO 필드명 일치
- [x] MyBatis 매핑 XML 수정 완료
- [x] Service 레이어 필드명 수정 완료
- [x] 프론트엔드 컴포넌트 생성 완료
- [x] API 라우트 핸들러 생성 완료
- [x] 데이터 암호화/복호화 기능 유지
- [x] 보안 설정 유지
- [x] 에러 처리 구현 완료

## 🔧 추가 설정

### 환경변수 설정 (선택사항)

```bash
# .env.local 파일에 추가
BACKEND_API_URL=http://localhost:8080
```

### 데이터베이스 연결 확인

```bash
# 백엔드에서 DB 연결 테스트
curl http://localhost:8080/api/employee/test-connection
```

이제 `ERI_EMPLOYEE_DDL_PostgreSQL.sql`의 DDL 구조와 완전히 일치하는 백엔드 및 프론트엔드 시스템이 구축되었습니다.
