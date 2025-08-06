package com.ERI.demo.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 설문조사 마스터 VO
 * TB_SURV_MST 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyMasterVO {

    // 기본 정보
    private Long survSeq;              // 설문조사 시퀀스 (PK)
    private String survTtl;            // 설문 제목
    private String survDesc;           // 설문 설명
    private String survTyCd;           // 설문 유형 (HEALTH_CHECK, SATISFACTION, ETC)
    private String survStsCd;          // 설문 상태 (DRAFT, ACTIVE, CLOSED, ARCHIVED)
    private LocalDate survSttDt;       // 설문 시작일
    private LocalDate survEndDt;       // 설문 종료일
    private Integer survDurMin;        // 예상 소요시간(분)
    private String anonYn;             // 익명 응답 여부 (Y/N)
    private String duplYn;             // 중복 응답 허용 여부 (Y/N)
    private Integer maxRespCnt;        // 최대 응답 수 제한
    private String tgtEmpTyCd;         // 대상 직원 유형 (ALL, DEPT, POSITION, ETC)
    private String fileAttYn;          // 첨부파일 존재 여부

    // 공통 관리 정보
    private String delYn;              // 삭제여부
    private LocalDateTime delDt;       // 삭제일시
    private String regEmpId;           // 등록직원ID
    private String updEmpId;           // 수정직원ID
    private LocalDateTime regDt;       // 등록일시
    private LocalDateTime updDt;       // 수정일시

    // 조회용 추가 필드
    private Integer respCnt;           // 응답 수
    private Integer totalRespCnt;      // 전체 응답 수
    private String survTyNm;           // 설문 유형명
    private String survStsNm;          // 설문 상태명
    private String tgtEmpTyNm;         // 대상 직원 유형명

    // 유틸리티 메서드
    public boolean isActive() {
        return "ACTIVE".equals(survStsCd);
    }

    public boolean isDraft() {
        return "DRAFT".equals(survStsCd);
    }

    public boolean isClosed() {
        return "CLOSED".equals(survStsCd);
    }

    public boolean isAnonymous() {
        return "Y".equals(anonYn);
    }

    public boolean isDuplicateAllowed() {
        return "Y".equals(duplYn);
    }

    public boolean hasFileAttachment() {
        return "Y".equals(fileAttYn);
    }
}
