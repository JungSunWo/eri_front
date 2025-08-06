package com.ERI.demo.mapper;

import com.ERI.demo.vo.SurveyChoiceVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 설문 선택지 Mapper
 * TB_SURV_CHC 테이블과 매핑
 */
@Mapper
public interface SurveyChoiceMapper {
    
    /**
     * 설문 선택지 목록 조회
     */
    List<SurveyChoiceVO> selectSurveyChoiceList(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq);
    
    /**
     * 설문 선택지 상세 조회
     */
    SurveyChoiceVO selectSurveyChoiceBySeq(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq, @Param("chcSeq") Long chcSeq);
    
    /**
     * 설문 선택지 등록
     */
    int insertSurveyChoice(SurveyChoiceVO surveyChoice);
    
    /**
     * 설문 선택지 수정
     */
    int updateSurveyChoice(SurveyChoiceVO surveyChoice);
    
    /**
     * 설문 선택지 삭제 (논리 삭제)
     */
    int deleteSurveyChoice(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq, @Param("chcSeq") Long chcSeq, @Param("updEmpId") String updEmpId);
    
    /**
     * 설문 선택지 순서 업데이트
     */
    int updateChoiceOrder(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq, @Param("chcSeq") Long chcSeq, @Param("chcOrd") Integer chcOrd, @Param("updEmpId") String updEmpId);
    
    /**
     * 설문 선택지 개수 조회
     */
    int selectChoiceCount(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq);
    
    /**
     * 다음 선택지 순서 조회
     */
    Integer selectNextChoiceOrder(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq);
    
    /**
     * 기타 선택지 조회
     */
    SurveyChoiceVO selectEtcChoice(@Param("survSeq") Long survSeq, @Param("qstSeq") Long qstSeq);
} 