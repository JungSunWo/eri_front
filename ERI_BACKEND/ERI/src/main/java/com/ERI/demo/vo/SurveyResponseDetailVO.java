package com.ERI.demo.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * 설문조사 응답 상세 VO
 * TB_SURV_RESP_DTL 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyResponseDetailVO {
    
    // 기본 정보
    private Long respDtlSeq;           // 응답 상세 시퀀스 (PK)
    private Long respSeq;              // 응답 시퀀스
    private Long survSeq;              // 설문조사 시퀀스
    private Long qstSeq;               // 질문 시퀀스
    private Long chcSeq;               // 선택지 시퀀스 (단일/다중 선택인 경우)
    private String textResp;           // 텍스트 응답 (주관식인 경우)
    private Integer respOrd;           // 응답 순서 (다중 선택인 경우)
    private Integer respScr;           // 응답 점수
    private String regId;              // 등록자 ID
    private LocalDateTime regDt;       // 등록일시
    private String updId;              // 수정자 ID
    private LocalDateTime updDt;       // 수정일시
    private String delYn;              // 삭제 여부 (Y/N)
    
    // 조회용 추가 필드
    private String qstTtl;             // 질문 제목
    private String qstTyCd;            // 질문 유형
    private String chcTtl;             // 선택지 제목
    private String chcValue;           // 선택지 값
    
    // 유틸리티 메서드
    public boolean isTextResponse() {
        return textResp != null && !textResp.trim().isEmpty();
    }
    
    public boolean isChoiceResponse() {
        return chcSeq != null;
    }
    
    public boolean hasScore() {
        return respScr != null && respScr > 0;
    }
    
    public boolean isDeleted() {
        return "Y".equals(delYn);
    }
} 