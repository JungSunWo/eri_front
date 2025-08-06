package com.ERI.demo.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 설문 결과 통계 VO
 * TB_SURV_STAT 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyStatisticsVO {
    
    // 기본 정보
    private Long survSeq;              // 설문조사 시퀀스
    private Long qstSeq;               // 문항 시퀀스
    private Long chcSeq;               // 선택지 시퀀스
    private Integer respCnt;           // 응답 수
    private BigDecimal respRate;       // 응답률
    private BigDecimal avgScr;         // 평균 점수
    private BigDecimal minScr;         // 최소 점수
    private BigDecimal maxScr;         // 최대 점수
    private BigDecimal stdDevScr;      // 표준편차
    private LocalDateTime lastUpdDt;   // 마지막 업데이트 일시
    
    // 조회용 추가 필드
    private String qstTtl;             // 문항 제목
    private String chcTtl;             // 선택지 제목
    private String qstTyCd;            // 문항 유형
    private Integer totalRespCnt;      // 전체 응답 수
    
    // 유틸리티 메서드
    public boolean hasChoice() {
        return chcSeq != null;
    }
    
    public boolean hasScore() {
        return avgScr != null || minScr != null || maxScr != null;
    }
    
    public BigDecimal getResponseRatePercentage() {
        if (respRate != null) {
            return respRate.multiply(new BigDecimal("100"));
        }
        return BigDecimal.ZERO;
    }
} 