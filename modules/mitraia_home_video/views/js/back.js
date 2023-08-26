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

document.addEventListener("DOMContentLoaded", function() {
  listeInput = [
    "MITRAIA_HOME_VIDEO_PICTURE_DESKTOP",
    "MITRAIA_HOME_VIDEO_VIDEO_DESKTOP",
    "MITRAIA_HOME_VIDEO_PICTURE_MOBILE",
    "MITRAIA_HOME_VIDEO_VIDEO_MOBILE",
  ];

  listeInput.forEach(element => {
    if(document.querySelectorAll('[for="'+element+'_DELETE_ON"]').length > 0){
      document.querySelector('[for="'+element+'_DELETE_ON"]').classList.add("btn");
      document.querySelector('[for="'+element+'_DELETE_ON"]').classList.add("btn-danger");

      document.querySelector('[for="'+element+'_DELETE_ON"]').addEventListener("click", ()=>{
        document.querySelector('#'+element+"_MINIATURE").innerHTML = ""
        document.querySelector('[for="'+element+'_DELETE_ON"]').classList.add("hidden");
      })
    }

    else if(document.querySelectorAll('[for="'+element+'_DELETE_OFF"]').length > 0) {
      document.querySelector('[for="'+element+'_DELETE_OFF"]').classList.add("hidden");
    }
  });

});
