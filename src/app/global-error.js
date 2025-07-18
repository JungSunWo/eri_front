"use client";

import PageWrapper from '@/components/layout/PageWrapper';
import { useEffect } from 'react';
import "./globals.css";

export default function GlobalError({ error, reset }) {
	console.error(`GlobalError => `, error);
	useEffect(() => {
		// console.error(error);
	}, []);

	const goMain = (e) => {
		if (typeof window != "undefined") {
			location.href = "/login";
		}
	}

	return (
		<html lang="ko">
			<body>
				<PageWrapper
					title="오류"
					subtitle="시스템 오류"
					showCard={false}
				>
					<div className="sec" style={{ 'paddingBottom': '15.7rem' }}>
						<div className="error-container">
							<div className="errcmMsg">
								<div className="errcmCon">
									<p className="t18G">서비스 이용에 불편을 드려 죄송합니다.</p>
									<p className="t14">
										시스템에 에러가 발생하여 페이지를 표시할 수 없습니다.
									</p>
								</div>
							</div>

							<div className="bottomBtnArea twoBtn">
								<button type="button" className="cmp_button" onClick={goMain}>
									<span className="base">메인화면으로 이동</span>
								</button>
							</div>
						</div>
					</div>
				</PageWrapper>
				<style jsx>{`
					.error-container .errcmMsg {
						margin-top: 6rem;
					}
					.error-container .errcmCon {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
					}
					.error-container .t18G {
						margin-top: 2.3rem;
					}
					.error-container .t14 {
						margin-top: 0.8rem;
					}
					.error-container .gray_box {
						margin-top: 3rem;
						width: 100%;
						padding: 2rem;
						background-color: var(--gray2);
						border-radius: 0.6rem;
						text-align: center;
					}
					.error-container .bottomBtnArea {
						position: fixed;
						bottom: 0;
						left: 0;
						right: 0;
						display: flex;
						padding: 2rem;
						flex-direction: column;
					}
					.error-container .bottomBtnArea > *:not(:first-child) {
						margin-top: 1.3rem;
					}
					.error-container .cmp_button {
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 1.4rem;
						border-radius: 0.6rem;
						background-color: #0565f0;
					}
					.error-container .cmp_button .base {
						font-size: 1.3rem;
						font-weight: 700;
						line-height: 2.4rem;
						color: #fff;
					}
					.error-container .cmp_button.lightblue {
						background-color: #e5f1ff;
					}
					.error-container .cmp_button.lightblue .base {
						color: #175ec7;
					}
				`}</style>
			</body>
		</html>
	);
}
