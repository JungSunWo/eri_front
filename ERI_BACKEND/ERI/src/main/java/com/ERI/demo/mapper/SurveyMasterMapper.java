package com.ERI.demo.mapper;

import com.ERI.demo.vo.SurveyMasterVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 설문조사 마스터 Mapper
 * TB_SURV_MST 테이블과 매핑
 */
@Mapper
public interface SurveyMasterMapper {
    
    /**
     * 설문조사 목록 조회 (페이징/검색)
     */
    List<SurveyMasterVO> selectSurveyMasterList(SurveyMasterVO params);
    
    /**
     * 설문조사 목록 개수 조회
     */
    int selectSurveyMasterCount(SurveyMasterVO params);
    
    /**
     * 설문조사 상세 조회
     */
    SurveyMasterVO selectSurveyMasterBySeq(@Param("survSeq") Long survSeq);
    
    /**
     * 설문조사 등록
     */
    int insertSurveyMaster(SurveyMasterVO surveyMaster);
    
    /**
     * 설문조사 수정
     */
    int updateSurveyMaster(SurveyMasterVO surveyMaster);
    
    /**
     * 설문조사 삭제 (논리 삭제)
     */
    int deleteSurveyMaster(@Param("survSeq") Long survSeq, @Param("updEmpId") String updEmpId);
    
    /**
     * 활성 설문조사 목록 조회
     */
    List<SurveyMasterVO> selectActiveSurveyList();
    
    /**
     * 설문조사 상태 업데이트
     */
    int updateSurveyStatus(@Param("survSeq") Long survSeq, @Param("survStsCd") String survStsCd, @Param("updEmpId") String updEmpId);
    
    /**
     * 응답 수 업데이트
     */
    int updateResponseCount(@Param("survSeq") Long survSeq);
} 