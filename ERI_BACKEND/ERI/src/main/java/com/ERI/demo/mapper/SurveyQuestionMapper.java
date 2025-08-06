package com.ERI.demo.mapper;

import com.ERI.demo.vo.SurveyQuestionVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 설문 문항 Mapper
 * TB_SURV_QST 테이블과 매핑
 */
@Mapper
public interface SurveyQuestionMapper {
    
    /**
     * 설문 문항 목록 조회
     */
    List<SurveyQuestionVO> selectSurveyQuestionList(@Param("survSeq") Long survSeq);
    
    /**
     * 설문 문항 상세 조회
     */
    SurveyQuestionVO selectSurveyQuestionBySeq(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq);
    
    /**
     * 설문 문항 등록
     */
    int insertSurveyQuestion(SurveyQuestionVO surveyQuestion);
    
    /**
     * 설문 문항 수정
     */
    int updateSurveyQuestion(SurveyQuestionVO surveyQuestion);
    
    /**
     * 설문 문항 삭제 (논리 삭제)
     */
    int deleteSurveyQuestion(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq, @Param("updEmpId") String updEmpId);
    
    /**
     * 설문 문항 순서 업데이트
     */
    int updateQuestionOrder(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq, @Param("qstOrd") Integer qstOrd, @Param("updEmpId") String updEmpId);
    
    /**
     * 설문 문항 개수 조회
     */
    int selectQuestionCount(@Param("survSeq") Long survSeq);
    
    /**
     * 다음 문항 순서 조회
     */
    Integer selectNextQuestionOrder(@Param("survSeq") Long survSeq);
} 