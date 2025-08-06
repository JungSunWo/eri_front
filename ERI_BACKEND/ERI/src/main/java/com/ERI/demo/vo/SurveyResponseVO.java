package com.ERI.demo.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 설문조사 응답 VO
 * TB_SURV_RESP 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyResponseVO {
    
    // 기본 정보
    private Long respSeq;              // 응답 시퀀스 (PK)
    private Long survSeq;              // 설문조사 시퀀스
    private String empNo;              // 직원 번호
    private String empNm;              // 직원명
    private String deptNm;             // 부서명
    private LocalDateTime respSttDt;   // 응답 시작 시간
    private LocalDateTime respEndDt;   // 응답 완료 시간
    private Integer respDurMin;        // 소요 시간 (분)
    private String respStsCd;          // 응답 상태 코드 (IN_PROGRESS, COMPLETED, ABANDONED)
    private String anonYn;             // 익명 여부 (Y/N)
    private String ipAddr;             // IP 주소
    private String userAgent;          // 사용자 에이전트
    private String regId;              // 등록자 ID
    private LocalDateTime regDt;       // 등록일시
    private String updId;              // 수정자 ID
    private LocalDateTime updDt;       // 수정일시
    private String delYn;              // 삭제 여부 (Y/N)
    
    // 조회용 추가 필드
    private String respStsNm;          // 응답 상태명
    private List<SurveyResponseDetailVO> details; // 응답 상세 목록
    private Integer totalScore;        // 총점
    private String survTtl;            // 설문 제목
    
    // 유틸리티 메서드
    public boolean isAnonymous() {
        return "Y".equals(anonYn);
    }
    
    public boolean isInProgress() {
        return "IN_PROGRESS".equals(respStsCd);
    }
    
    public boolean isCompleted() {
        return "COMPLETED".equals(respStsCd);
    }
    
    public boolean isAbandoned() {
        return "ABANDONED".equals(respStsCd);
    }
    
    public boolean isDeleted() {
        return "Y".equals(delYn);
    }
    
    public Integer getDurationMinutes() {
        if (respSttDt != null && respEndDt != null) {
            return (int) java.time.Duration.between(respSttDt, respEndDt).toMinutes();
        }
        return respDurMin != null ? respDurMin : 0;
    }
} 