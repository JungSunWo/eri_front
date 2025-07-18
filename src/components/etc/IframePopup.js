"use client";

import { FullPopup } from "@/common/ui_com";
import { CmpFpArea, CmpFpCont, CmpFpTitle } from "@/components/fullPopup/cmp_fullPopup";
import useIfram from "@/store/useIfram";
import { useEffect } from "react";



export default function IframePopup(props) {
	const { showIfram, iframSrc, setHideIfram, showTitle, setShowIfram } = useIfram();
	const { id } = props;

	useEffect(() => {
		console.log(id);
		if (showIfram) {
			FullPopup.Open("#" + id);
			const popContHeight = document.querySelector(`#${id} .bottomSheetCont`).clientHeight;
			document
				.querySelector(`#${id}`)
				.querySelector(".iframeArea")
				.setAttribute("height", `${popContHeight - 20}px`);
		} else {
			FullPopup.Closed("#" + id);
		}
	}, [showIfram]);

	const fullPopupClose = () => {
		setHideIfram(false);
	};

	if (typeof window != "undefined") {
		window.fullPopupOpen = (paramSrc, isShow, paramShowTitle) => {
			setShowIfram(paramSrc, isShow, paramShowTitle);
		};
	}

	const getTitle = () => {
		if (showTitle) {
			return <CmpFpTitle popTitle="풀팝업" click={fullPopupClose} />;
		} else {
			return (
				<CmpFpTitle popTitle="풀팝업" click={fullPopupClose} style={{ display: "none" }} />
			);
		}
	};
	// const vHeight = document.querySelector("#root").style.height;
	return (
		<>
			{/* 팝업영역 */}
			{/* <IframeCustomStyle> */}
			<CmpFpArea id={id}>
				{getTitle()}
				<CmpFpCont>
					<iframe
						src={iframSrc}
						className="iframeArea"
						width="100%"
						height="100%"
						frameBorder="0"
						allowFullScreen></iframe>
				</CmpFpCont>
			</CmpFpArea>
			{/* </IframeCustomStyle> */}
			{/* 팝업영역 */}
		</>
	);
}
