/**
* 2007-2023 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author    PrestaShop SA <contact@prestashop.com>
*  @copyright 2007-2023 PrestaShop SA
*  @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*
* Don't forget to prefix your containers with your own identifier
* to avoid any conflicts with others containers.
*/
const initdatetime = new Date().getTime();
document.addEventListener("DOMContentLoaded", function() {
  Array.from(document.querySelectorAll("#mitraia_home_video .wrapper[data-video]")).forEach(()=>{
    console.log(document.querySelector("#mitraia_home_video .wrapper[data-video]").dataset.video)
    const preloadedVideo = document.createElement('video');
    preloadedVideo.autoplay = true
    preloadedVideo.muted = true
    preloadedVideo.loop = true
    preloadedVideo.src = document.querySelector("#mitraia_home_video .wrapper[data-video]").dataset.video;

    // Écouter l'événement de chargement de la vidéo préchargée
    preloadedVideo.addEventListener('loadeddata', () => {
      // Quand la vidéo est chargée, copier les attributs vers la vidéo visible
      const newDatetime = new Date().getTime()
      console.log(newDatetime - initdatetime)
      if(newDatetime - initdatetime > 1000){
        switchVideo(preloadedVideo)
      }

      else{
        setTimeout(()=>switchVideo(preloadedVideo), 3000)
      }

    });
  })
})

function switchVideo(preloadedVideo){
  document.querySelector('#mitraia_home_video .wrapper').classList.add("black");

      setTimeout(()=>{
        document.querySelector('#mitraia_home_video .wrapper').innerHTML = "";
        document.querySelector('#mitraia_home_video .wrapper').appendChild(preloadedVideo);
        setTimeout(()=>{document.querySelector('#mitraia_home_video .wrapper').classList.remove("black");},500)
      }, 500)
}
