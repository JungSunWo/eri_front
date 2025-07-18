import styled, { css } from "styled-components";

//팝업영역
export const StyledFullPopupBase = css`
	display: none;
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	background-color: rgba(33, 37, 41, 0.50);
	backdrop-filter: blur(6px);
	z-index: 2000;
	&.primaryShowStep1 {
		z-index: 3001;
	}
	.bottomSheetContArea {
		position: absolute;
		left: 0;
		bottom: -70%;
		transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
		width: 100%;
		opacity: 0;
		height: 100%;
		box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.10);
		border-radius: 2.2rem 2.2rem 0 0;
		overflow: hidden;
		background: rgba(255,255,255,0.98);
	}
	&.on .bottomSheetContArea {
		bottom: 0;
		opacity: 1;
	}
	.innerCont {
		position: relative;
		width: 100%;
		background-color: var(--white);
		padding: 3.2rem 2.4rem 2.4rem 2.4rem;
		border-radius: 2.2rem 2.2rem 0 0;
		overflow: hidden;
		height: calc(var(--vh, 1vh) * 100);
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
	}
	.bottomSheetCont {
		width: 100%;
	}
	.bottomSheetCont .innerScroll {
		max-height: calc(var(--vh, 1vh) * 100 - 5.2rem);
		overflow-y: auto;
		min-height: calc(var(--vh, 1vh) * 100 - 5.2rem);
	}
	.bottomSheetTitle {
		position: relative;
		width: 100%;
		text-align: center;
		padding: 2.4rem 2.8rem 2rem 2.8rem;
		min-height: 5.2rem;
		font-size: 2.2rem;
		font-weight: 800;
		line-height: 2.8rem;
		letter-spacing: -0.2px;
		color: var(--gray10);
		background: rgba(255,255,255,0.95);
		border-radius: 2.2rem 2.2rem 0 0;
		box-shadow: 0 2px 8px rgba(0,0,0,0.03);
	}
	.bottomSheetTitle > p {
		font-size: 2.2rem;
		font-weight: 800;
		line-height: 2.8rem;
		letter-spacing: -0.2px;
		color: var(--gray10);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.bottomSheetTitle .bottomSheetClosed {
		position: absolute;
		left: 1.2rem;
		top: 50%;
		transform: translateY(-50%);
		width: 3.8rem;
		height: 3.8rem;
		background: #f5f6fa url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_20_close.svg) no-repeat center center;
		background-size: 2rem auto;
		border-radius: 50%;
		border: 1.5px solid var(--gray3);
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
		cursor: pointer;
		transition: background 0.2s, border 0.2s;
	}
	.bottomSheetTitle .bottomSheetClosed:hover,
	.bottomSheetTitle .bottomSheetClosed:focus {
		background: #e0e4ef url(${process.env.NEXT_PUBLIC_PUB_PATH}/image/common/ic_line_20_close.svg) no-repeat center center;
		border-color: var(--gray5);
	}
	@media (max-width: 600px) {
		.innerCont {
			padding: 2rem 0.8rem 1.2rem 0.8rem;
		}
		.bottomSheetTitle {
			padding: 1.6rem 1.2rem 1.2rem 1.2rem;
			font-size: 1.5rem;
		}
		.bottomSheetTitle > p {
			font-size: 1.5rem;
		}
		.bottomSheetTitle .bottomSheetClosed {
			width: 2.8rem;
			height: 2.8rem;
		}
	}
`;

export const StyledFullPopup = styled.div`
	${StyledFullPopupBase};

	${(props) =>
		props["data-poptype"] === "html" &&
		`
        .bottomSheetCont .innerScroll{padding-bottom:2rem;padding-top:2rem;}
        .bottomSheetCont .innerHtmlArea{padding:0.4rem 0 3.2rem 0;}
    `};

	&.innerFull .bottomSheetCont .innerScroll{margin-left:-2rem;width:calc(100% + 4rem);}
`;
