package com.ERI.demo.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * 설문 대상자 VO
 * TB_SURV_TGT 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyTargetVO {

    // 기본 정보
    private Long survSeq;              // 설문조사 시퀀스
    private Long tgtSeq;               // 대상 시퀀스
    private String tgtTyCd;            // 대상 유형 (EMP_ID, DEPT_CD, POSITION_CD, ALL)
    private String tgtValue;           // 대상 값
    private String tgtDesc;            // 대상 설명

    // 공통 관리 정보
    private String delYn;              // 삭제여부
    private LocalDateTime delDt;       // 삭제일시
    private String regEmpId;           // 등록직원ID
    private String updEmpId;           // 수정직원ID
    private LocalDateTime regDt;       // 등록일시
    private LocalDateTime updDt;       // 수정일시

    // 조회용 추가 필드
    private String tgtTyNm;            // 대상 유형명
    private Integer empCnt;            // 대상 직원 수

    // 유틸리티 메서드
    public boolean isAllEmployees() {
        return "ALL".equals(tgtTyCd);
    }

    public boolean isIndividualEmployee() {
        return "EMP_ID".equals(tgtTyCd);
    }

    public boolean isDepartment() {
        return "DEPT_CD".equals(tgtTyCd);
    }

    public boolean isPosition() {
        return "POSITION_CD".equals(tgtTyCd);
    }
}
