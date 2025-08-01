import { css } from 'styled-components';

//base
export const SwitchStyles = css`
    position:relative;display:inline-block;vertical-align:middle;font-size:0;
    >input{position:relative;width:5.1rem;height:3.1rem;border-radius:2.2rem;background-color:var(--gray7);transition:background-color 0.2s;}
    >input::before{content:"";position:absolute;left:0.2rem;top:0.2rem;display:block;width:2.7rem;height:2.7rem;border-radius:50%;background-color:var(--white);box-shadow: 0px 3px 1px 0px rgba(0, 0, 0, 0.06), 0px 3px 8px 0px rgba(0, 0, 0, 0.15);transition:left 0.2s;}
    >input:checked{background-color:var(--jb-blue);}
    >input:checked::before{left:calc(100% - 2.9rem);}
    >input:disabled{background-color:var(--gray4);}
    >input:checked:disabled{background-color:#B0CCF6}
`;

export const Switch24 = css`
    >input{height:2.4rem;width:4rem;}
    >input::before{width:2rem;height:2rem;}
    >input:checked::before{left:calc(100% - 2.2rem);}

    .base{display:inline-block;vertical-align:middle;font-size:1.4rem;font-weight:500;line-height:2.2rem;color:var(--gray8);margin-left:1.2rem;padding-top:0.3rem;}
`;

//Checkbox 
export const SwitchText = css`
    >input{width:5.7rem;}
    >span{position:absolute;display:inline-block;font-size:1rem;font-weight:700;color:var(--white);line-height:1rem;display:none;}
    >span.off{right:0.9rem;top:1.1rem;display:block;}
    >span.on{left:0.9rem;top:1.1rem;}
    >input:checked ~ span.off{display:none;}
    >input:checked ~ span.on{display:block;}
`;

//============================================================================================================
//타입별 케이스 정의
export const StyleCommonSwitch = css`
    ${SwitchStyles}    
    ${props => props['data-size'] === 'h24' && Switch24}
    ${props => props['data-styletype'] === 'text' && SwitchText}
`;