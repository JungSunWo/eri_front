'use client'

import { FullPopup } from '@/common/ui_com';
import React from 'react';
import { StyledFullPopup } from './cmp_fullPopup_style';

//바텀시트
const CmpFpArea = (props) => {
    const { id, className, popType, children, click, style } = props;

    const renderChildren = () => {
        return React.Children.map(props.children, (child) => {
            return React.cloneElement(child, {
                id: id,
            });
        });
    };

    const addedChildren = renderChildren;

    const divClick = (e) => {
        if (e.target.classList.contains("CmpBottomSheetArea")) {
            FullPopup.Closed("#" + id);
        }

    }

    const clickEvent = click !== undefined ? click : divClick;

    return (
        <StyledFullPopup id={id} className={`CmpBottomSheetArea ${className}`} data-poptype={popType} onClick={clickEvent} style={style}>
            <div className="bottomSheetContArea">
                <div className="innerCont">
                    <>{addedChildren()}</>
                </div>
            </div>
        </StyledFullPopup>
    );
};

//바텀시트 타이틀
const CmpFpTitle = (props) => {
    const { popTitle, id, click, style, closeSelf } = props;

    const buttonClick = (e) => {
        if (closeSelf === undefined) {
            setTimeout(() => {
                FullPopup.Closed("#" + id);
            }, 300);
        }

        if (click !== undefined) {
            click();
        }
    }

    return (
        <div className="bottomSheetTitle" style={style}>
            <button type="button" className="bottomSheetClosed" onClick={buttonClick}><span className="hidden">닫기</span></button>
            <p></p>
        </div>
    );
};

//바텀시트 컨텐츠
const CmpFpCont = (props) => {
    const { children } = props;

    return (
        <div className="bottomSheetCont">
            <div className="innerScroll">
                {children}
            </div>
        </div>
    );
};

export { CmpFpArea, CmpFpCont, CmpFpTitle };
