
"use client"
import Script from "next/script";

const PolyfillScripts = () => {
    return (
        <Script
            id="polyfill-scripts"
            dangerouslySetInnerHTML={{
                __html: `
                    /*
                        하위 브라우저 replaceAll 을 사용할수 없어 추가
                        크롬 or Android System WebView 85버전 이상 replaceAll 기본 사용가능
                        safari 13.4버전 이상 replaceAll 기본 사용가능
                        위버전 아래 버전들 대응
                     */
                    if (typeof String.prototype.replaceAll === "undefined") {
                        String.prototype.replaceAll = function (match, replace) {
                            return this.replace(new RegExp(match, 'g'), () => replace);
                        }
                    }

                    // Optional Chaining M Safari 13.4 이하 크롬 80버전 이하인 경우 실행됨
                    if (!('?.') in Object.prototype) {
                        Object.defineProperty(Object.prototype, '?.', {
                            value: function(prop) {
                                return this == null ? undefined : this[prop];
                            },
                            configurable: true,
                            writable: true
                        });
                    }
                `
            }}
        />
    )
}

export default PolyfillScripts;
