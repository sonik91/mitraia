"use strict";(()=>{(self.webpackChunkFalcon_theme=self.webpackChunkFalcon_theme||[]).push([[190],{1190:(P,y,u)=>{u.r(y),u.d(y,{default:()=>w});var b=u(9482);function w({swiper:e,extendParams:g,on:o}){g({parallax:{enabled:!1}});const h=(t,l)=>{const{rtl:s}=e,i=s?-1:1,n=t.getAttribute("data-swiper-parallax")||"0";let r=t.getAttribute("data-swiper-parallax-x"),a=t.getAttribute("data-swiper-parallax-y");const p=t.getAttribute("data-swiper-parallax-scale"),c=t.getAttribute("data-swiper-parallax-opacity"),x=t.getAttribute("data-swiper-parallax-rotate");if(r||a?(r=r||"0",a=a||"0"):e.isHorizontal()?(r=n,a="0"):(a=n,r="0"),r.indexOf("%")>=0?r=`${parseInt(r,10)*l*i}%`:r=`${r*l*i}px`,a.indexOf("%")>=0?a=`${parseInt(a,10)*l}%`:a=`${a*l}px`,typeof c!="undefined"&&c!==null){const d=c-(c-1)*(1-Math.abs(l));t.style.opacity=d}let f=`translate3d(${r}, ${a}, 0px)`;if(typeof p!="undefined"&&p!==null){const d=p-(p-1)*(1-Math.abs(l));f+=` scale(${d})`}if(x&&typeof x!="undefined"&&x!==null){const d=x*l*-1;f+=` rotate(${d}deg)`}t.style.transform=f},m=()=>{const{el:t,slides:l,progress:s,snapGrid:i}=e;(0,b.gD)(t,"[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").forEach(n=>{h(n,s)}),l.forEach((n,r)=>{let a=n.progress;e.params.slidesPerGroup>1&&e.params.slidesPerView!=="auto"&&(a+=Math.ceil(r/2)-s*(i.length-1)),a=Math.min(Math.max(a,-1),1),n.querySelectorAll("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale], [data-swiper-parallax-rotate]").forEach(p=>{h(p,a)})})},A=(t=e.params.speed)=>{const{el:l}=e;l.querySelectorAll("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").forEach(s=>{let i=parseInt(s.getAttribute("data-swiper-parallax-duration"),10)||t;t===0&&(i=0),s.style.transitionDuration=`${i}ms`})};o("beforeInit",()=>{e.params.parallax.enabled&&(e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0)}),o("init",()=>{e.params.parallax.enabled&&m()}),o("setTranslate",()=>{e.params.parallax.enabled&&m()}),o("setTransition",(t,l)=>{e.params.parallax.enabled&&A(l)})}}}]);})();
