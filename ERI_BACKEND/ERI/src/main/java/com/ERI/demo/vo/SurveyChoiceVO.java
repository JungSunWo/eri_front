package com.ERI.demo.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * 설문 선택지 VO
 * TB_SURV_CHC 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyChoiceVO {

    // 기본 정보
    private Long survSeq;              // 설문조사 시퀀스
    private Long qstSeq;               // 문항 시퀀스
    private Long chcSeq;               // 선택지 시퀀스
    private String chcTtl;             // 선택지 제목
    private String chcDesc;            // 선택지 설명
    private Integer chcOrd;            // 선택지 순서
    private Integer chcScr;            // 선택지 점수
    private String chcValue;           // 선택지 값
    private String etcYn;              // 기타 선택지 여부 (Y/N)

    // 공통 관리 정보
    private String delYn;              // 삭제여부
    private LocalDateTime delDt;       // 삭제일시
    private String regEmpId;           // 등록직원ID
    private String updEmpId;           // 수정직원ID
    private LocalDateTime regDt;       // 등록일시
    private LocalDateTime updDt;       // 수정일시

    // 조회용 추가 필드
    private Integer respCnt;           // 선택된 응답 수
    private Double respRate;           // 응답률

    // 유틸리티 메서드
    public boolean isEtcChoice() {
        return "Y".equals(etcYn);
    }

    public boolean hasScore() {
        return chcScr != null && chcScr > 0;
    }
}
