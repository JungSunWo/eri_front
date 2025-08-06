package com.ERI.demo.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 설문 문항 VO
 * TB_SURV_QST 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyQuestionVO {

    // 기본 정보
    private Long survSeq;              // 설문조사 시퀀스
    private Long qstSeq;               // 문항 시퀀스
    private String qstTtl;             // 문항 제목
    private String qstDesc;            // 문항 설명
    private String qstTyCd;            // 문항 유형 (SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT, SCALE, ETC)
    private Integer qstOrd;            // 문항 순서
    private String reqYn;              // 필수 응답 여부 (Y/N)
    private String skipLgcYn;          // 건너뛰기 로직 사용 여부 (Y/N)
    private String skipCond;           // 건너뛰기 조건 (JSON 형태)
    private String scrYn;              // 점수 계산 여부 (Y/N)
    private BigDecimal scrWeight;      // 점수 가중치

    // 공통 관리 정보
    private String delYn;              // 삭제여부
    private LocalDateTime delDt;       // 삭제일시
    private String regEmpId;           // 등록직원ID
    private String updEmpId;           // 수정직원ID
    private LocalDateTime regDt;       // 등록일시
    private LocalDateTime updDt;       // 수정일시

    // 조회용 추가 필드
    private String qstTyNm;            // 문항 유형명
    private List<SurveyChoiceVO> choices; // 선택지 목록
    private Integer respCnt;           // 응답 수
    private BigDecimal avgScore;       // 평균 점수

    // 유틸리티 메서드
    public boolean isRequired() {
        return "Y".equals(reqYn);
    }

    public boolean hasSkipLogic() {
        return "Y".equals(skipLgcYn);
    }

    public boolean hasScore() {
        return "Y".equals(scrYn);
    }

    public boolean isSingleChoice() {
        return "SINGLE_CHOICE".equals(qstTyCd);
    }

    public boolean isMultipleChoice() {
        return "MULTIPLE_CHOICE".equals(qstTyCd);
    }

    public boolean isText() {
        return "TEXT".equals(qstTyCd);
    }

    public boolean isScale() {
        return "SCALE".equals(qstTyCd);
    }
}
