import { NextResponse } from 'next/server';

// 백엔드 API 기본 URL (환경변수에서 가져오거나 기본값 사용)
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchKeyword = searchParams.get('searchKeyword');
    const branchCd = searchParams.get('branchCd');

    // 백엔드 API 호출
    let apiUrl = `${BACKEND_API_URL}/api/employee/list`;

    if (searchKeyword || branchCd) {
      apiUrl = `${BACKEND_API_URL}/api/employee/search`;
      const params = new URLSearchParams();
      if (searchKeyword) params.append('searchKeyword', searchKeyword);
      if (branchCd) params.append('branchCd', branchCd);
      apiUrl += `?${params.toString()}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Employee API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '직원 데이터 조회에 실패했습니다.',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/api/employee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Employee API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '직원 데이터 등록에 실패했습니다.',
        error: error.message
      },
      { status: 500 }
    );
  }
}
