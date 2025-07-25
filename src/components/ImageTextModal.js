'use client';

import { CmpTextarea } from '@/components/ui';
import { Link, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * 이미지에 텍스트를 추가하는 모달 컴포넌트
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 열림/닫힘 상태
 * @param {Function} props.onClose - 모달 닫기 함수
 * @param {File} props.imageFile - 텍스트를 추가할 이미지 파일
 * @param {Function} props.onConfirm - 텍스트 추가 완료 시 호출되는 함수 (processedImageFile을 매개변수로 받음)
 * @param {Object} props.defaultOptions - 기본 텍스트 옵션
 */
export default function ImageTextModal({
  isOpen,
  onClose,
  imageFile,
  onConfirm,
  defaultOptions = {}
}) {
  // 대표글 배열 (여러 개의 대표글을 관리)
  const [mainTexts, setMainTexts] = useState([]);

  // 현재 편집 중인 대표글
  const [currentMainText, setCurrentMainText] = useState({
    text: '',
    fontSize: 24,
    color: '#ffffff',
    strokeColor: '#000000',
    fontFamily: 'Malgun Gothic, sans-serif',
    customX: null,
    customY: null,
    id: null
  });

  // 링크 배열
  const [links, setLinks] = useState([]);

  // links 상태 변경 감지
  useEffect(() => {
    console.log('links 상태 변경됨:', links);
    console.log('links 길이:', links.length);
  }, [links]);

  // mainTexts 상태 변경 감지
  useEffect(() => {
    console.log('mainTexts 상태 변경됨:', mainTexts);
    console.log('mainTexts 길이:', mainTexts.length);
  }, [mainTexts]);

  const [currentLink, setCurrentLink] = useState({
    url: '',
    text: '',
    position: null
  });

  // 대표글 기본 옵션
  const [mainTextOptions, setMainTextOptions] = useState({
    fontSize: 24,
    color: '#ffffff',
    strokeColor: '#000000',
    fontFamily: 'Malgun Gothic, sans-serif',
    ...defaultOptions
  });

  // 링크 기본 옵션
  const [linkOptions, setLinkOptions] = useState({
    fontSize: 32,
    color: '#ffffff',
    strokeColor: '#0066cc',
    fontFamily: 'Malgun Gothic, sans-serif',
    outlineShape: 'rectangle', // 외곽 모양: rectangle, circle, star, diamond
    ...defaultOptions
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedLinkId, setDraggedLinkId] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const previewContainerRef = useRef(null);
  const updatePreviewRef = useRef(null);

  // 이미지 로드 및 미리보기 생성
  useEffect(() => {
    if (imageFile && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        // updatePreview 함수가 정의된 후에만 호출
        if (updatePreviewRef.current) {
          updatePreviewRef.current();
        }
      };
      img.src = URL.createObjectURL(imageFile);
    }
  }, [imageFile]);

  // 텍스트나 옵션 변경 시 미리보기 업데이트
  useEffect(() => {
    if (imageRef.current && updatePreviewRef.current) {
      updatePreviewRef.current();
    }
  }, [mainTexts, mainTextOptions, links, linkOptions]);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen && imageFile) {
      console.log('모달 열림 - 상태 초기화');
      // 모달이 열릴 때 상태 초기화
      setMainTexts([]);
      setLinks([]);
      setCurrentMainText({
        text: '',
        fontSize: 24,
        color: '#ffffff',
        strokeColor: '#000000',
        position: 'bottom',
        customX: null,
        customY: null,
        id: null
      });
      setCurrentLink({ url: '', text: '', position: null });
      setMainTextOptions({
        fontSize: 24,
        color: '#ffffff',
        strokeColor: '#000000',
        position: 'bottom',
        ...defaultOptions
      });
      setPreviewUrl('');
      setIsDragging(false);
      setDraggedLinkId(null);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageFile]); // defaultOptions 제거

  // 드래그 시작
  const handleMouseDown = (e) => {
    if (!previewContainerRef.current) return;

    const rect = previewContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 표준화된 크기 사용
    const standardWidth = 800;
    const standardHeight = 600;

    const scaleX = standardWidth / rect.width;
    const scaleY = standardHeight / rect.height;

    // 링크 드래그 확인
    for (let i = links.length - 1; i >= 0; i--) {
      const link = links[i];
      if (link.position) {
        // 링크의 표준 좌표를 화면 좌표로 변환
        const linkScreenX = link.position.x / scaleX;
        const linkScreenY = link.position.y / scaleY;

        // 실제 텍스트 크기 계산 (화면 좌표계)
        const linkStyle = link.style || linkOptions;
        const fontSize = linkStyle.fontSize || linkOptions.fontSize;
        const fontFamily = linkStyle.fontFamily || linkOptions.fontFamily;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = `${fontSize}px ${fontFamily}`;
        const textWidth = ctx.measureText(link.text).width / scaleX;
        const textHeight = fontSize / scaleY;

        if (Math.abs(x - linkScreenX) < textWidth / 2 + 10 &&
            Math.abs(y - linkScreenY) < textHeight / 2 + 10) {
          setIsDragging(true);
          setDraggedLinkId(link.id);
          setDragOffset({
            x: Math.round(x - linkScreenX),
            y: Math.round(y - linkScreenY)
          });
          console.log('링크 드래그 시작:', {
            mouseX: x,
            mouseY: y,
            linkScreenX: linkScreenX,
            linkScreenY: linkScreenY,
            linkStandardX: link.position.x,
            linkStandardY: link.position.y,
            textWidth: textWidth,
            textHeight: textHeight,
            dragOffset: { x: x - linkScreenX, y: y - linkScreenY }
          });
          return;
        }
      }
    }

    // 대표글 드래그 확인 (각 대표글을 개별적으로 확인)
    for (let i = mainTexts.length - 1; i >= 0; i--) {
      const mainText = mainTexts[i];

      // 대표글 위치 계산 (custom 위치가 있으면 사용, 없으면 기본 위치)
      let textScreenX, textScreenY;
      if (mainText.customX !== null && mainText.customY !== null) {
        textScreenX = mainText.customX / scaleX;
        textScreenY = mainText.customY / scaleY;
      } else {
        // 기본 위치 계산 (표준화된 크기 기준)
        textScreenX = standardWidth / 2 / scaleX;
        textScreenY = standardHeight / 2 / scaleY;
      }

      const fontSize = mainText.fontSize / scaleY;

      // 대표글 텍스트 너비 계산
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = `${mainText.fontSize}px ${mainText.fontFamily || 'Malgun Gothic, sans-serif'}`;
      const textWidth = ctx.measureText(mainText.text).width / scaleX;

              if (Math.abs(x - textScreenX) < textWidth / 2 + 20 &&
            Math.abs(y - textScreenY) < fontSize + 20) {
          setIsDragging(true);
          setDraggedLinkId(`mainText_${mainText.id}`);
          setDragOffset({
            x: Math.round(x - textScreenX),
            y: Math.round(y - textScreenY)
          });
        console.log('대표글 드래그 시작:', {
          mouseX: x,
          mouseY: y,
          textScreenX: textScreenX,
          textScreenY: textScreenY,
          textStandardX: mainText.customX || standardWidth / 2,
          textStandardY: mainText.customY || standardHeight / 2,
          dragOffset: { x: x - textScreenX, y: y - textScreenY }
        });
        return;
      }
    }

    // 링크나 대표글을 클릭하지 않았을 때, 현재 입력 중인 링크가 있으면 위치 설정
    if (currentLink.text && !isDragging) {
      const rect = previewContainerRef.current.getBoundingClientRect();

      // 표준화된 크기 사용
      const standardWidth = 800;
      const standardHeight = 600;

      const scaleX = standardWidth / rect.width;
      const scaleY = standardHeight / rect.height;

      // 마우스 위치를 표준 좌표로 변환
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      // 경계 체크
      const finalX = Math.max(0, Math.min(standardWidth, mouseX));
      const finalY = Math.max(0, Math.min(standardHeight, mouseY));

      setCurrentLink(prev => ({
        ...prev,
        position: {
          x: finalX,
          y: finalY,
          width: getLinkTextWidth(currentLink.text, linkOptions.fontSize),
          height: currentLink.text.split('\n').length * linkOptions.fontSize
        }
      }));

      console.log('빈 공간 클릭 - 현재 링크 위치 설정:', {
        finalX: finalX,
        finalY: finalY,
        currentLinkText: currentLink.text
      });
    }
  };

    // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging || !previewContainerRef.current) return;

    const rect = previewContainerRef.current.getBoundingClientRect();

    // 표준화된 크기 사용
    const standardWidth = 800;
    const standardHeight = 600;

    const scaleX = standardWidth / rect.width;
    const scaleY = standardHeight / rect.height;

    // 마우스 위치를 화면 좌표계로 계산
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 드래그 오프셋은 이미 화면 좌표계
    const offsetX = dragOffset.x;
    const offsetY = dragOffset.y;

    // 화면 좌표계에서의 새로운 위치 (오프셋 적용)
    const newScreenX = mouseX - offsetX;
    const newScreenY = mouseY - offsetY;

    // 화면 좌표를 표준 좌표로 변환 (경계 체크 포함)
    const newX = Math.max(0, Math.min(standardWidth, newScreenX * scaleX));
    const newY = Math.max(0, Math.min(standardHeight, newScreenY * scaleY));

    // 부동소수점 오차 방지를 위한 반올림
    const finalX = Math.round(newX);
    const finalY = Math.round(newY);

    console.log('=== 드래그 중 좌표 정보 ===');
    console.log('마우스 위치 (화면 좌표):', { mouseX, mouseY });
    console.log('드래그 오프셋 (화면 좌표):', { offsetX, offsetY });
    console.log('새로운 위치 (화면 좌표):', { newScreenX, newScreenY });
    console.log('스케일링 값:', { scaleX, scaleY });
    console.log('계산된 위치 (표준 좌표):', { newX, newY });
    console.log('최종 위치 (반올림):', { finalX, finalY });
    console.log('드래그 중인 요소:', draggedLinkId);
    console.log('========================');

    if (draggedLinkId && draggedLinkId.startsWith('mainText_')) {
      // 대표글 드래그
      const mainTextId = draggedLinkId.replace('mainText_', '');
      setMainTexts(prev => {
        const updatedMainTexts = prev.map(mainText =>
          mainText.id === mainTextId
            ? {
                ...mainText,
                customX: finalX,
                customY: finalY,
                position: 'custom' // 드래그 시 custom 위치로 설정
              }
            : mainText
        );

        // 업데이트된 대표글의 실제 위치 로그
        const updatedMainText = updatedMainTexts.find(mainText => mainText.id === mainTextId);
        if (updatedMainText) {
          console.log('=== 대표글 실제 위치 ===');
          console.log('대표글 ID:', mainTextId);
          console.log('대표글 텍스트:', updatedMainText.text);
          console.log('대표글 위치 (표준 좌표):', {
            customX: updatedMainText.customX,
            customY: updatedMainText.customY,
            position: updatedMainText.position
          });
          console.log('대표글 스타일:', {
            fontSize: updatedMainText.fontSize,
            color: updatedMainText.color,
            strokeColor: updatedMainText.strokeColor,
            fontFamily: updatedMainText.fontFamily
          });
          console.log('========================');
        }

        return updatedMainTexts;
      });
    } else if (draggedLinkId) {
      // 링크 드래그 (동일한 스케일 적용)
      setLinks(prev => {
        const updatedLinks = prev.map(link =>
          link.id === draggedLinkId
            ? {
                ...link,
                position: {
                  ...link.position,
                  x: finalX,
                  y: finalY
                }
              }
            : link
        );

        // 업데이트된 링크의 실제 위치 로그
        const updatedLink = updatedLinks.find(link => link.id === draggedLinkId);
        if (updatedLink) {
          console.log('=== 링크 텍스트 실제 위치 ===');
          console.log('링크 ID:', draggedLinkId);
          console.log('링크 텍스트:', updatedLink.text);
          console.log('링크 위치 (표준 좌표):', {
            x: updatedLink.position.x,
            y: updatedLink.position.y,
            width: updatedLink.position.width,
            height: updatedLink.position.height
          });
          console.log('링크 스타일:', updatedLink.style);
          console.log('========================');
        }

        return updatedLinks;
      });
    }
  };

  // 드래그 종료
  const handleMouseUp = (e) => {
    console.log('드래그 종료:', {
      draggedLinkId: draggedLinkId,
      isDragging: isDragging
    });

    setIsDragging(false);
    setDraggedLinkId(null);
  };

  // 텍스트 너비 계산
  const getTextWidth = () => {
    if (!imageRef.current) return 0;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${mainTextOptions.fontSize}px ${mainTextOptions.fontFamily || 'Malgun Gothic, sans-serif'}`;

    // 현재 편집 중인 대표글 텍스트 사용
    const words = currentMainText.text.split(' ');
    let maxWidth = 0;

    words.forEach(word => {
      const width = ctx.measureText(word).width;
      maxWidth = Math.max(maxWidth, width);
    });

    return maxWidth;
  };

  // 링크 텍스트 너비 계산
  const getLinkTextWidth = (text, fontSize = linkOptions.fontSize) => {
    if (!imageRef.current) return 0;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px ${linkOptions.fontFamily || 'Malgun Gothic, sans-serif'}`;

    // 줄바꿈이 있는 경우 가장 긴 줄의 너비를 반환
    const lines = text.split('\n');
    let maxWidth = 0;

    lines.forEach(line => {
      const width = ctx.measureText(line).width;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });

    return maxWidth;
  };

  // 기본 Y 위치 계산
      const getDefaultY = () => {
    // 표준화된 캔버스 크기 (800x600)
    const standardHeight = 600;

    // 항상 중앙에 위치
    return standardHeight / 2;
  };

  // URL 유효성 검사
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // 캔버스에 줄바꿈이 포함된 텍스트를 그리는 함수
  const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split('\n');
    let currentY = y - (words.length - 1) * lineHeight / 2;

    words.forEach((line, index) => {
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    });
  };

  // 캔버스에 줄바꿈이 포함된 텍스트의 외곽선을 그리는 함수
  const strokeWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split('\n');
    let currentY = y - (words.length - 1) * lineHeight / 2;

    words.forEach((line, index) => {
      ctx.strokeText(line, x, currentY);
      currentY += lineHeight;
    });
  };

  // 링크 추가
  const addLink = () => {
    console.log('addLink 호출됨');
    console.log('currentLink:', currentLink);
    console.log('currentLink.url:', currentLink.url);
    console.log('currentLink.text:', currentLink.text);
    console.log('isValidUrl(currentLink.url):', isValidUrl(currentLink.url));

    if (!currentLink.url.trim() || !isValidUrl(currentLink.url)) {
      console.log('URL 유효성 검사 실패');
      alert('유효한 URL을 입력해주세요.');
      return;
    }

    if (!currentLink.text.trim()) {
      console.log('링크 텍스트 검사 실패');
      alert('링크 텍스트를 입력해주세요.');
      return;
    }

    // 이미지 참조 확인
    const img = imageRef.current;
    if (!img) {
      alert('이미지를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 링크 위치 계산 - 기존 링크들과 겹치지 않도록 조정
    let x, y;
    const existingLinks = links || [];

                // 기본 시작 위치 (안전한 기본값 사용)
    let baseX, baseY;

            // 표준화된 좌표 시스템 사용 (0-100 범위)
    const standardX = 50; // 중앙 (50%)
    const standardY = 50; // 중앙 (50%)

    // 표준화된 캔버스 크기 (800x600)
    const standardWidth = 800;
    const standardHeight = 600;

    // 표준 좌표를 실제 픽셀 좌표로 변환
    baseX = (standardWidth * standardX) / 100;
    baseY = (standardHeight * standardY) / 100;

    console.log('링크 기본 위치 계산:', {
      originalWidth: img.width,
      originalHeight: img.height,
      standardWidth: 800,
      standardHeight: 600,
      standardX: 50,
      standardY: 50,
      baseX,
      baseY
    });

    // 텍스트와 정확히 같은 위치에 링크 배치 (겹치도록)
    x = baseX;
    y = baseY;

    const linkTextWidth = getLinkTextWidth(currentLink.text, linkOptions.fontSize);
    const linkTextHeight = currentLink.text.split('\n').length * linkOptions.fontSize;

    console.log('링크 텍스트 크기 계산:', {
      text: currentLink.text,
      fontSize: linkOptions.fontSize,
      width: linkTextWidth,
      height: linkTextHeight
    });

    const newLink = {
      id: `link_${Date.now()}`,
      url: currentLink.url,
      text: currentLink.text,
      position: {
        x: x,
        y: y,
        width: linkTextWidth,
        height: linkTextHeight
      },
      style: {
        fontSize: linkOptions.fontSize,
        color: linkOptions.color,
        strokeColor: linkOptions.strokeColor,
        fontFamily: linkOptions.fontFamily,
        outlineShape: linkOptions.outlineShape
      }
    };

        setLinks(prev => {
      const newLinks = [...prev, newLink];
      console.log('링크 추가됨:', newLink);
      console.log('현재 링크 목록:', newLinks);
      console.log('링크 개수:', newLinks.length);
          console.log('링크 위치 정보:', {
      x: newLink.position.x,
      y: newLink.position.y,
      width: newLink.position.width,
      height: newLink.position.height,
      imgWidth: img.width,
      imgHeight: img.height,
      baseX,
      baseY
    });
      return newLinks;
    });
    setCurrentLink({ url: '', text: '', position: null });

    // 링크 추가 후 미리보기 강제 업데이트
    setTimeout(() => {
      if (updatePreviewRef.current) {
        updatePreviewRef.current();
      }
    }, 100);

    // 성공 메시지 (선택사항)
    // alert('링크가 성공적으로 추가되었습니다!');
  };

  // 대표글 추가
  const addMainText = () => {
    if (!currentMainText.text.trim()) {
      alert('대표글을 입력해주세요.');
      return;
    }

    const img = imageRef.current;
    if (!img) {
      alert('이미지를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

            // 대표글 위치 계산 (항상 중앙)
    let x, y;
    if (currentMainText.customX !== null && currentMainText.customY !== null) {
      x = currentMainText.customX;
      y = currentMainText.customY;
    } else {
      // 표준화된 캔버스 크기 (800x600)
      const standardWidth = 800;
      const standardHeight = 600;

      // 항상 중앙에 위치
      x = standardWidth / 2;
      y = standardHeight / 2;
    }

    // 커스텀 위치로 설정 (드래그 가능하도록)
    const customX = x;
    const customY = y;

              const newMainText = {
      id: `mainText_${Date.now()}`,
      text: currentMainText.text,
      fontSize: currentMainText.fontSize,
      color: currentMainText.color,
      strokeColor: currentMainText.strokeColor,
      fontFamily: currentMainText.fontFamily,
      customX: customX,
      customY: customY
    };

    setMainTexts(prev => {
      const newMainTexts = [...prev, newMainText];
      console.log('대표글 추가됨:', newMainText);
      console.log('현재 대표글 목록:', newMainTexts);
      console.log('대표글 개수:', newMainTexts.length);
      return newMainTexts;
    });

    // 현재 편집 중인 대표글 초기화
    setCurrentMainText({
      text: '',
      fontSize: mainTextOptions.fontSize,
      color: mainTextOptions.color,
      strokeColor: mainTextOptions.strokeColor,
      fontFamily: mainTextOptions.fontFamily,
      customX: null,
      customY: null,
      id: null
    });
  };

  // 대표글 삭제
  const removeMainText = (mainTextId) => {
    setMainTexts(prev => prev.filter(mainText => mainText.id !== mainTextId));
  };

  // 링크 삭제
  const removeLink = (linkId) => {
    setLinks(prev => prev.filter(link => link.id !== linkId));
  };

  // 미리보기 업데이트 함수
  const updatePreview = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // 표준화된 캔버스 크기 설정 (800x600)
    const standardWidth = 800;
    const standardHeight = 600;
    canvas.width = standardWidth;
    canvas.height = standardHeight;

    console.log('미리보기 업데이트:', {
      originalWidth: img.width,
      originalHeight: img.height,
      standardWidth,
      standardHeight,
      linksCount: links.length
    });

    // 이미지를 표준 크기로 리사이즈해서 그리기
    ctx.drawImage(img, 0, 0, standardWidth, standardHeight);

    // 대표글 그리기
    mainTexts.forEach((mainText, index) => {
      if (mainText.text) {
        const {
          fontSize,
          color,
          strokeColor,
          fontFamily,
          position,
          customX,
          customY
        } = mainText;

        // X, Y 좌표 결정 (커스텀 위치 우선)
        let x, y;
        if (customX !== null && customY !== null) {
          x = customX;
          y = customY;
        } else {
          x = img.width / 2;
          // 선택된 위치에 따라 Y 좌표 결정
          switch (position) {
            case 'top':
              y = fontSize + 20;
              break;
            case 'center':
              y = img.height / 2;
              break;
            case 'bottom':
              y = img.height - 20;
              break;
            case 'custom':
            default:
              y = img.height / 2; // 기본값은 중앙
              break;
          }
        }

        const maxWidth = standardWidth * 0.8; // 표준화된 크기 사용

        ctx.font = `${fontSize}px ${fontFamily || 'Malgun Gothic, sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; // 항상 중앙 기준으로 정렬

        // 텍스트 줄바꿈 처리 (엔터키와 공백 모두 인식)
        const lines = [];
        const paragraphs = mainText.text.split('\n'); // 엔터키로 문단 분리

        paragraphs.forEach(paragraph => {
          if (paragraph.trim() === '') {
            // 빈 줄은 그대로 추가
            lines.push('');
            return;
          }

          const words = paragraph.split(' ');
          let currentLine = words[0] || '';

          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
              currentLine += ' ' + word;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          }
          if (currentLine) {
            lines.push(currentLine);
          }
        });

        // 각 줄에 텍스트 그리기 (중앙 정렬)
        lines.forEach((line, lineIndex) => {
          const lineY = y + (lineIndex - (lines.length - 1) / 2) * (fontSize + 5);

          // 텍스트 외곽선 (그림자 효과)
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2;
          ctx.strokeText(line, x, lineY);

          // 텍스트 그리기
          ctx.fillStyle = color;
          ctx.fillText(line, x, lineY);
        });

        // 대표글 영역 표시 (중앙 정렬)
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(
          x - maxWidth / 2 - 10,
          y - (fontSize * lines.length) / 2 - 10,
          maxWidth + 20,
          fontSize * lines.length + 20
        );
        ctx.setLineDash([]);

        // 대표글 번호 표시 (중앙 정렬)
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.font = '12px Malgun Gothic, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`대표글 ${index + 1}`, x, y - (fontSize * lines.length) / 2 - 20);
      }
    });

    // 링크 텍스트 그리기
    links.forEach((link, index) => {
      if (link.position && link.text) {
        const x = link.position.x;
        const y = link.position.y;

        // 링크별 스타일 적용
        const linkStyle = link.style || linkOptions;
        const fontSize = linkStyle.fontSize || linkOptions.fontSize;
        const color = linkStyle.color || linkOptions.color;
        const strokeColor = linkStyle.strokeColor || linkOptions.strokeColor;
        const fontFamily = linkStyle.fontFamily || linkOptions.fontFamily;
        const outlineShape = linkStyle.outlineShape || linkOptions.outlineShape;

        // 링크 텍스트 그리기
        ctx.font = `${fontSize}px ${fontFamily || 'Malgun Gothic, sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 텍스트 크기 계산
        const textWidth = ctx.measureText(link.text).width;
        const textHeight = fontSize;
        const padding = 8;

        // 외곽 모양에 따른 그리기
        if (outlineShape === 'rectangle') {
          // 사각형 외곽
          ctx.fillStyle = strokeColor;
          ctx.fillRect(
            x - textWidth / 2 - padding,
            y - textHeight / 2 - padding,
            textWidth + padding * 2,
            textHeight + padding * 2
          );
          ctx.fillStyle = color;
          drawWrappedText(ctx, link.text, x, y, canvas.width, fontSize + 4);
        } else if (outlineShape === 'circle') {
          // 원형 외곽
          const radius = Math.max(textWidth, textHeight) / 2 + padding;
          ctx.fillStyle = strokeColor;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = color;
          drawWrappedText(ctx, link.text, x, y, canvas.width, fontSize + 4);
        } else if (outlineShape === 'diamond') {
          // 다이아몬드 외곽
          const size = Math.max(textWidth, textHeight) / 2 + padding;
          ctx.fillStyle = strokeColor;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-size, -size, size * 2, size * 2);
          ctx.restore();
          ctx.fillStyle = color;
          drawWrappedText(ctx, link.text, x, y, canvas.width, fontSize + 4);

        } else {
          // 기본 외곽선 (none 또는 기타)
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 8;
          strokeWrappedText(ctx, link.text, x, y, canvas.width, fontSize + 4);
          ctx.fillStyle = color;
          drawWrappedText(ctx, link.text, x, y, canvas.width, fontSize + 4);
        }

        // 링크 번호 표시 (실제 텍스트 크기 기준)



        // 링크 번호 표시 (실제 텍스트 크기 기준)
        ctx.fillStyle = 'rgba(0, 102, 204, 1)';
        ctx.font = 'bold 18px Malgun Gothic, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${index + 1}`, x, y - textHeight / 2 - 20);

        // 디버깅용: 링크 정보 출력
        console.log(`링크 ${index + 1} 렌더링:`, {
          text: link.text,
          position: { x, y },
          fontSize,
          color,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          textWidth: textWidth,
          textHeight: textHeight
        });
      }
    });

    // 현재 입력 중인 링크 미리보기 (링크 텍스트가 있고 위치가 계산된 경우)
    if (currentLink.text && currentLink.position) {
      const x = currentLink.position.x;
      const y = currentLink.position.y;
      const fontSize = linkOptions.fontSize;
      const color = linkOptions.color;
      const strokeColor = linkOptions.strokeColor;
      const outlineShape = linkOptions.outlineShape;

      ctx.font = `${fontSize}px Malgun Gothic, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 텍스트 크기 계산
      const textWidth = ctx.measureText(currentLink.text).width;
      const textHeight = fontSize;
      const padding = 8;

      // 외곽 모양에 따른 그리기
      if (outlineShape === 'rectangle') {
        // 사각형 외곽
        ctx.fillStyle = strokeColor;
        ctx.fillRect(
          x - textWidth / 2 - padding,
          y - textHeight / 2 - padding,
          textWidth + padding * 2,
          textHeight + padding * 2
        );
        ctx.fillStyle = color;
        drawWrappedText(ctx, currentLink.text, x, y, canvas.width, fontSize + 4);
      } else if (outlineShape === 'circle') {
        // 원형 외곽
        const radius = Math.max(textWidth, textHeight) / 2 + padding;
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = color;
        drawWrappedText(ctx, currentLink.text, x, y, canvas.width, fontSize + 4);
      } else if (outlineShape === 'diamond') {
        // 다이아몬드 외곽
        const size = Math.max(textWidth, textHeight) / 2 + padding;
        ctx.fillStyle = strokeColor;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-size, -size, size * 2, size * 2);
        ctx.restore();
        ctx.fillStyle = color;
        drawWrappedText(ctx, currentLink.text, x, y, canvas.width, fontSize + 4);

      } else {
        // 기본 외곽선 (none 또는 기타)
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        strokeWrappedText(ctx, currentLink.text, x, y, canvas.width, fontSize + 4);
        ctx.fillStyle = color;
        drawWrappedText(ctx, currentLink.text, x, y, canvas.width, fontSize + 4);
      }



      // 현재 링크 영역 표시 (점선으로 구분)
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(
        x - getLinkTextWidth(currentLink.text, fontSize) / 2 - 5,
        y - fontSize / 2 - 5,
        getLinkTextWidth(currentLink.text, fontSize) + 10,
        fontSize + 10
      );
      ctx.setLineDash([]);
    }

    // 캔버스를 URL로 변환하여 미리보기 업데이트
    setPreviewUrl(canvas.toDataURL());
  };

  // updatePreview 함수를 ref에 할당
  updatePreviewRef.current = updatePreview;

  // 위치 초기화
  const resetPosition = () => {
    setMainTextOptions(prev => ({
      ...prev,
      customX: null,
      customY: null,
      position: 'bottom'
    }));
  };

  // 이미지에 텍스트와 링크 추가 함수 (최종 처리용)
  const addTextToImage = (imageFile, mainTexts = [], options = {}, links = []) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 표준화된 캔버스 크기 설정 (800x600)
        const standardWidth = 800;
        const standardHeight = 600;
        canvas.width = standardWidth;
        canvas.height = standardHeight;

        // 이미지를 표준 크기로 리사이징해서 그리기
        ctx.drawImage(img, 0, 0, standardWidth, standardHeight);

        // 텍스트 스타일 설정 (표준화된 크기 사용)
        const {
          fontSize = Math.max(standardWidth, standardHeight) * 0.05, // 표준 크기의 5%
          fontFamily = 'Arial, sans-serif',
          color = '#ffffff',
          strokeColor = '#000000',
          strokeWidth = 2,
          position = 'bottom', // 'top', 'center', 'bottom', 'custom'
          customX = null,
          customY = null,
          linkColor = '#0066cc',
          linkUnderline = true,
          x = customX !== null && customY !== null && position === 'custom' ? customX : standardWidth / 2,
          y = customX !== null && customY !== null && position === 'custom' ? customY :
              position === 'top' ? fontSize + 20 :
              position === 'center' ? standardHeight / 2 :
              standardHeight - 20,
          maxWidth = standardWidth * 0.8
        } = options;

        // 대표글 그리기 (각 대표글을 개별적으로 처리)
        mainTexts.forEach(mainText => {
          if (mainText.text && mainText.text.trim()) {
            const {
              fontSize: textFontSize = Math.max(standardWidth, standardHeight) * 0.05,
              color: textColor = '#ffffff',
              strokeColor: textStrokeColor = '#000000',
              fontFamily: textFontFamily = 'Malgun Gothic, sans-serif',
              strokeWidth: textStrokeWidth = 2,
              customX: textCustomX = null,
              customY: textCustomY = null
            } = mainText;

            // 대표글 위치 계산 (항상 중앙)
            const textX = textCustomX !== null ? textCustomX : standardWidth / 2;
            const textY = textCustomY !== null ? textCustomY : standardHeight / 2;

            ctx.font = `${textFontSize}px ${textFontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 텍스트 줄바꿈 처리 (엔터키와 공백 모두 인식)
            const lines = [];
            const paragraphs = mainText.text.split('\n'); // 엔터키로 문단 분리

            paragraphs.forEach(paragraph => {
              if (paragraph.trim() === '') {
                // 빈 줄은 그대로 추가
                lines.push('');
                return;
              }

              const words = paragraph.split(' ');
              let currentLine = words[0] || '';

              for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = ctx.measureText(currentLine + ' ' + word).width;
                if (width < maxWidth) {
                  currentLine += ' ' + word;
                } else {
                  lines.push(currentLine);
                  currentLine = word;
                }
              }
              if (currentLine) {
                lines.push(currentLine);
              }
            });

            // 각 줄에 텍스트 그리기
            lines.forEach((line, index) => {
              const lineY = textY + (index - (lines.length - 1) / 2) * (textFontSize + 5);

              // 텍스트 외곽선 (그림자 효과)
              if (textStrokeWidth > 0) {
                ctx.strokeStyle = textStrokeColor;
                ctx.lineWidth = textStrokeWidth;
                ctx.strokeText(line, textX, lineY);
              }

              // 텍스트 그리기
              ctx.fillStyle = textColor;
              ctx.fillText(line, textX, lineY);
            });
          }
        });

        // 링크 텍스트는 미리보기에서만 표시되고 저장 시에는 제외됨
        // (링크 정보는 별도로 전달되어 나중에 처리 가능)

        // 캔버스를 Blob으로 변환
        canvas.toBlob((blob) => {
          const originalName = imageFile.name || `image-${Date.now()}`;
          const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
          const fileName = `${nameWithoutExt}-800x600.png`;
          const fileType = 'image/png';

          const file = new File([blob], fileName, {
            type: fileType,
            lastModified: Date.now()
          });
          resolve(file);
        }, 'image/png');
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  };

  // 텍스트 추가 처리
  const handleAddTextToImage = async () => {
    console.log('handleAddTextToImage 호출됨');
    console.log('imageFile:', imageFile);
    console.log('mainTexts:', mainTexts);
    console.log('mainTexts 길이:', mainTexts.length);
    console.log('links 상태:', links);
    console.log('links 길이:', links.length);

    if (!imageFile || (mainTexts.length === 0 && links.length === 0)) {
      console.log('이미지 파일이 없거나 대표글과 링크가 모두 없음');
      return;
    }

        try {
      const processedImage = await addTextToImage(imageFile, mainTexts, {
        fontSize: mainTextOptions.fontSize,
        color: mainTextOptions.color,
        strokeColor: mainTextOptions.strokeColor,
        customX: mainTextOptions.customX,
        customY: mainTextOptions.customY
      }, links); // 링크 배열 전달

      // 대표글과 링크 정보와 함께 결과 반환
      const result = {
        imageFile: processedImage,
        mainTexts: mainTexts || [], // 대표글 배열 전달
        links: links || [] // 링크 배열 전달
      };

      console.log('ImageTextModal - Sending result:', result);
      console.log('ImageTextModal - MainTexts in result:', result.mainTexts);
      console.log('ImageTextModal - Links in result:', result.links);
      console.log('ImageTextModal - MainTexts JSON:', JSON.stringify(result.mainTexts, null, 2));
      console.log('ImageTextModal - Links JSON:', JSON.stringify(result.links, null, 2));

      onConfirm(result);

      // 모달 상태 초기화
      setMainTexts([]);
      setLinks([]);
      setCurrentMainText({
        text: '',
        fontSize: 24,
        color: '#ffffff',
        strokeColor: '#000000',
        customX: null,
        customY: null,
        id: null
      });
      setCurrentLink({ url: '', text: '', position: null });
      setMainTextOptions({
        fontSize: 24,
        color: '#ffffff',
        strokeColor: '#000000',
        ...defaultOptions
      });
      setLinkOptions({
        fontSize: 20,
        color: '#ffffff',
        strokeColor: '#0066cc',
        underline: true,
        ...defaultOptions
      });
      setPreviewUrl('');
    } catch (error) {
      console.error('이미지 텍스트 추가 실패:', error);
    }
  };

  // 모달 닫기
  const handleClose = () => {
    // 모든 상태 초기화
    setMainTexts([]);
    setLinks([]);
    setCurrentMainText({
      text: '',
      fontSize: 24,
      color: '#ffffff',
      strokeColor: '#000000',
      customX: null,
      customY: null,
      id: null
    });
    setCurrentLink({ url: '', text: '', position: null });
    setMainTextOptions({
      fontSize: 24,
      color: '#ffffff',
      strokeColor: '#000000',
      ...defaultOptions
    });
    setLinkOptions({
      fontSize: 20,
      color: '#0066cc',
      strokeColor: '#000000',
      underline: true,
      ...defaultOptions
    });
    setPreviewUrl('');
    setIsDragging(false);
    setDraggedLinkId(null);
    setDragOffset({ x: 0, y: 0 });

    // 부모 컴포넌트에 닫기 알림
    onClose();
  };

  if (!isOpen || !imageFile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3 max-w-6xl max-h-[90vh] overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-b">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold">이미지에 텍스트 추가</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-2 sm:p-3 md:p-4 max-h-[calc(90vh-120px)] overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 왼쪽: 설정 패널 */}
            <div className="space-y-6">
              {/* 대표글 입력 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="block text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  📝 대표글 입력
                </label>
                <textarea
                  value={currentMainText.text}
                  onChange={(e) => setCurrentMainText(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="이미지에 추가할 대표글을 입력하세요 (선택사항)"
                  className="w-full p-3 border border-blue-300 rounded-lg resize-none bg-white"
                  rows={3}
                />

                {/* 대표글 스타일 옵션 */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">폰트 크기</label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={currentMainText.fontSize}
                      onChange={(e) => setCurrentMainText(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <span className="text-xs text-blue-600">{currentMainText.fontSize}px</span>
                  </div>
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">색상</label>
                    <input
                      type="color"
                      value={currentMainText.color}
                      onChange={(e) => setCurrentMainText(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-8 border border-blue-300 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">외곽선</label>
                    <input
                      type="color"
                      value={currentMainText.strokeColor}
                      onChange={(e) => setCurrentMainText(prev => ({ ...prev, strokeColor: e.target.value }))}
                      className="w-full h-8 border border-blue-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">폰트 스타일</label>
                    <select
                      value={currentMainText.fontFamily}
                      onChange={(e) => setCurrentMainText(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full h-8 border border-blue-300 rounded text-xs bg-white"
                    >
                      <option value="Malgun Gothic, sans-serif">맑은 고딕</option>
                      <option value="Dotum, sans-serif">돋움</option>
                      <option value="Gulim, sans-serif">굴림</option>
                      <option value="Batang, serif">바탕</option>
                      <option value="Gungsuh, serif">궁서</option>
                      <option value="Nanum Gothic, sans-serif">나눔고딕</option>
                      <option value="Nanum Myeongjo, serif">나눔명조</option>
                      <option value="Nanum Brush Script, cursive">나눔손글씨</option>
                      <option value="Nanum Pen Script, cursive">나눔펜글씨</option>
                      <option value="Noto Sans KR, sans-serif">Noto Sans KR</option>
                      <option value="Noto Serif KR, serif">Noto Serif KR</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Helvetica, sans-serif">Helvetica</option>
                    </select>
                  </div>
                </div>

                {/* 대표글 텍스트 미리보기 */}
                {currentMainText.text && (
                  <div className="p-2 bg-gray-50 rounded border mt-3">
                    <p className="text-xs text-gray-600 mb-1">대표글 텍스트 미리보기:</p>
                    <div
                      className="text-center"
                      style={{
                        fontSize: `${currentMainText.fontSize}px`,
                        color: currentMainText.color,
                        textShadow: `2px 2px 2px ${currentMainText.strokeColor}`,
                        fontFamily: currentMainText.fontFamily,
                        lineHeight: '1.2'
                      }}
                    >
                      {currentMainText.text}
                    </div>
                  </div>
                )}

                <button
                  onClick={addMainText}
                  disabled={!currentMainText.text.trim()}
                  className={`w-full mt-3 px-3 py-2 rounded text-sm ${
                    !currentMainText.text.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  대표글 추가
                </button>

                {/* 추가된 대표글 목록 */}
                {mainTexts.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                      ✅ 추가된 대표글 ({mainTexts.length}개):
                    </h4>
                    {mainTexts.map((mainText, index) => (
                      <div key={mainText.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 text-sm">
                        <div className="flex-1">
                          <div className="font-medium text-blue-800">{mainText.text}</div>
                          <div className="text-blue-600 text-xs">
                            크기: {mainText.fontSize}px | 색상: {mainText.color}
                          </div>
                        </div>
                        <button
                          onClick={() => removeMainText(mainText.id)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-blue-600 mt-2">
                  대표글을 입력하지 않아도 링크만 추가할 수 있습니다.
                </p>
              </div>

              {/* 링크 관리 */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  🔗 링크 추가
                </label>

                {/* 링크 입력 폼 */}
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    value={currentLink.url}
                    onChange={(e) => setCurrentLink(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="링크 URL을 입력하세요 (예: https://example.com)"
                    className={`w-full p-2 border rounded text-sm ${
                      currentLink.url && !isValidUrl(currentLink.url)
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {currentLink.url && !isValidUrl(currentLink.url) && (
                    <p className="text-xs text-red-600">유효한 URL을 입력해주세요 (http:// 또는 https:// 포함)</p>
                  )}
                  <CmpTextarea
                    value={currentLink.text}
                    onChange={(e) => setCurrentLink(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="링크 텍스트를 입력하세요 (엔터로 줄바꿈 가능)"
                    rows={3}
                    style={{ minHeight: '60px', height: 'auto' }}
                    className="!min-h-[60px] !h-auto resize-none"
                  />

                                    {/* 링크 텍스트 미리보기 */}
                  {currentLink.text && (
                    <div className="p-2 bg-gray-50 rounded border">
                      <p className="text-xs text-gray-600 mb-1">링크 텍스트 미리보기:</p>
                      <div
                        className="text-center whitespace-pre-wrap relative"
                        style={{
                          fontSize: `${linkOptions.fontSize}px`,
                          color: linkOptions.color,
                          fontFamily: linkOptions.fontFamily,
                          textDecorationColor: linkOptions.color,
                          padding: '8px',
                          borderRadius: linkOptions.outlineShape === 'circle' ? '50%' :
                                       linkOptions.outlineShape === 'diamond' ? '0' : '4px',
                          background: linkOptions.outlineShape !== 'none' ? linkOptions.strokeColor : 'transparent',
                          transform: linkOptions.outlineShape === 'diamond' ? 'rotate(45deg)' : 'none',
                          display: 'inline-block',
                          minWidth: 'fit-content',
                          minHeight: 'fit-content'
                        }}
                      >
                        {currentLink.text}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      console.log('링크 추가 버튼 클릭됨');
                      addLink();
                    }}
                    disabled={!currentLink.url.trim() || !currentLink.text.trim() || !isValidUrl(currentLink.url)}
                    className={`w-full px-3 py-2 rounded text-sm ${
                      !currentLink.url.trim() || !currentLink.text.trim() || !isValidUrl(currentLink.url)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    링크 추가
                  </button>
                </div>

                {/* 링크 스타일 설정 */}
                <div className="mt-4 pt-4 border-t border-green-200">
                  <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    링크 스타일 설정
                  </h4>

                  {/* 링크 폰트 크기 */}
                  <div className="mb-3">
                    <label className="block text-xs text-green-700 mb-1">폰트 크기</label>
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={linkOptions.fontSize}
                      onChange={(e) => setLinkOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <span className="text-xs text-green-600">{linkOptions.fontSize}px</span>
                  </div>

                  {/* 링크 색상 선택 */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {/* 링크 텍스트 색상 */}
                    <div>
                      <label className="block text-xs text-green-700 mb-1">링크 글자색</label>
                      <input
                        type="color"
                        value={linkOptions.color}
                        onChange={(e) => setLinkOptions(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full h-8 border border-green-300 rounded"
                      />
                    </div>

                    {/* 링크 외곽선 색상 */}
                    <div>
                      <label className="block text-xs text-green-700 mb-1">외곽 모양 색</label>
                      <input
                        type="color"
                        value={linkOptions.strokeColor}
                        onChange={(e) => setLinkOptions(prev => ({ ...prev, strokeColor: e.target.value }))}
                        className="w-full h-8 border border-green-300 rounded"
                      />
                    </div>
                  </div>

                  {/* 링크 폰트 스타일 */}
                  <div className="mb-3">
                    <label className="block text-xs text-green-700 mb-1">폰트 스타일</label>
                    <select
                      value={linkOptions.fontFamily}
                      onChange={(e) => setLinkOptions(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full h-8 border border-green-300 rounded text-xs bg-white"
                    >
                      <option value="Malgun Gothic, sans-serif">맑은 고딕</option>
                      <option value="Dotum, sans-serif">돋움</option>
                      <option value="Gulim, sans-serif">굴림</option>
                      <option value="Batang, serif">바탕</option>
                      <option value="Gungsuh, serif">궁서</option>
                      <option value="Nanum Gothic, sans-serif">나눔고딕</option>
                      <option value="Nanum Myeongjo, serif">나눔명조</option>
                      <option value="Nanum Brush Script, cursive">나눔손글씨</option>
                      <option value="Nanum Pen Script, cursive">나눔펜글씨</option>
                      <option value="Noto Sans KR, sans-serif">Noto Sans KR</option>
                      <option value="Noto Serif KR, serif">Noto Serif KR</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Helvetica, sans-serif">Helvetica</option>
                    </select>
                  </div>

                  {/* 링크 외곽 모양 */}
                  <div className="mb-3">
                    <label className="block text-xs text-green-700 mb-1">외곽 모양</label>
                    <select
                      value={linkOptions.outlineShape}
                      onChange={(e) => setLinkOptions(prev => ({ ...prev, outlineShape: e.target.value }))}
                      className="w-full h-8 border border-green-300 rounded text-xs bg-white"
                    >
                      <option value="rectangle">사각형</option>
                      <option value="circle">동그라미</option>
                      <option value="diamond">다이아몬드</option>
                      <option value="none">없음</option>
                    </select>
                  </div>

                </div>

                {/* 추가된 링크 목록 */}
                {links.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2">
                      ✅ 추가된 링크 ({links.length}개):
                    </h4>
                    {links.map((link, index) => (
                      <div key={link.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200 text-sm">
                        <div className="flex-1">
                          <div className="font-medium text-green-800">{link.text}</div>
                          <div className="text-green-600 truncate text-xs">{link.url}</div>
                        </div>
                        <button
                          onClick={() => removeLink(link.id)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 미리보기 */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">실시간 미리보기</h4>
              <div
                ref={previewContainerRef}
                className="flex justify-center relative"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: (mainTextOptions.position === 'custom' && currentMainText.text.trim()) || links.length > 0 ? 'grab' : 'default' }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="미리보기"
                    className="max-w-full max-h-64 object-contain rounded-lg border shadow-lg"
                    style={{
                      cursor: (mainTextOptions.position === 'custom' && currentMainText.text.trim()) || links.length > 0 ? 'grab' : 'default',
                      userSelect: 'none'
                    }}
                    onLoad={(e) => {
                      // 이미지 로드 후 스케일 정보 출력
                      const img = e.target;
                      const rect = img.getBoundingClientRect();
                      console.log('미리보기 이미지 스케일 정보:', {
                        naturalWidth: img.naturalWidth,
                        naturalHeight: img.naturalHeight,
                        displayWidth: rect.width,
                        displayHeight: rect.height,
                        scaleX: img.naturalWidth / rect.width,
                        scaleY: img.naturalHeight / rect.height
                      });
                    }}
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="원본 이미지"
                    className="max-w-full max-h-64 object-contain rounded-lg border"
                    style={{
                      cursor: links.length > 0 ? 'grab' : 'default',
                      userSelect: 'none'
                    }}
                    onLoad={(e) => {
                      // 원본 이미지 로드 후 스케일 정보 출력
                      const img = e.target;
                      const rect = img.getBoundingClientRect();
                      console.log('원본 이미지 스케일 정보:', {
                        naturalWidth: img.naturalWidth,
                        naturalHeight: img.naturalHeight,
                        displayWidth: rect.width,
                        displayHeight: rect.height,
                        scaleX: img.naturalWidth / rect.width,
                        scaleY: img.naturalHeight / rect.height
                      });
                    }}
                  />
                )}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {mainTexts.length > 0 ?
                  (mainTextOptions.position === 'custom' ?
                    '📝 대표글을 드래그하여 위치 조정' :
                    '📝 대표글이 추가된 미리보기') :
                  links.length > 0 ?
                    '🔗 링크만 추가된 미리보기' :
                    '원본 이미지'}
                {links.length > 0 && (
                  <div className="mt-1 text-green-600">
                    🔗 {links.length}개의 링크가 포함됨 (드래그로 위치 조정 가능)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {mainTexts.length > 0 ? (
              mainTextOptions.position === 'custom' ?
                '📝 대표글을 드래그하여 원하는 위치에 배치하세요.' :
                '📝 대표글을 입력하면 실시간으로 미리보기가 업데이트됩니다.'
            ) : links.length > 0 ? (
              '🔗 링크만 추가된 상태입니다. 대표글을 입력하거나 링크를 더 추가할 수 있습니다.'
            ) : (
              '📝 대표글을 입력하거나 🔗 링크를 추가해보세요.'
            )}
            {links.length > 0 && (
              <span className="ml-2 text-green-600">🔗 {links.length}개의 링크가 포함됩니다.</span>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleClose}
              className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs sm:text-sm"
            >
              취소
            </button>
            <button
              onClick={handleAddTextToImage}
              disabled={mainTexts.length === 0 && links.length === 0}
              className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              {mainTexts.length > 0 ? '텍스트 추가' : links.length > 0 ? '링크 추가' : '텍스트 추가'}
            </button>
          </div>
        </div>
      </div>

      {/* 숨겨진 캔버스 (미리보기 생성용) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
