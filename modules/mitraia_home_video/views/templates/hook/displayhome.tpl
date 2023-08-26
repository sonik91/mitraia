{if (isset($moduleSliderActivate) && $moduleSliderActivate)}
  {if Context::getContext()->isMobile()}{*MOBILE*}
    {if (isset($pictureMobile) && $pictureMobile != "") || (isset($videoMobile) && $videoMobile != "")}
      <div class="container-fluid mobile" id="mitraia_home_video">
        <div class="wrapper" {if (isset($pictureMobile) && $pictureMobile != "") && (isset($videoMobile) && $videoMobile != "")} data-video="{$videoMobile}"{/if}>
          {if (isset($pictureMobile) && $pictureMobile != "")}<img src="{$pictureMobile}" alt="{l s="Picture of presentation on the Mitraia" mod="Shop.Theme.Mitraia"}">{/if}
          {if (isset($videoMobile) && $videoMobile != "") && !(isset($pictureMobile) && $pictureMobile != "")}<video muted autoplay><source src="{$videoMobile}" type="video/mp4"></video>{/if}
        </div>
      </div>
    {/if}
    {else}{*PC*}
      {if (isset($pictureDesktop) && $pictureDesktop != "") || (isset($videoDesktop) && $videoDesktop != "")}
        <div class="container-fluid desktop" id="mitraia_home_video">
          <div class="wrapper" {if (isset($pictureDesktop) && $pictureDesktop != "") && (isset($videoDesktop) && $videoDesktop != "")} data-video="{$videoDesktop}"{/if}>
            {if (isset($pictureDesktop) && $pictureDesktop != "")}<img src="{$pictureDesktop}" alt="{l s="Picture of presentation on the Mitraia" mod="Shop.Theme.Mitraia"}">{/if}
            {if (isset($videoDesktop) && $videoDesktop != "") && !(isset($pictureDesktop) && $pictureDesktop != "")}<video muted autoplay><source src="{$videoDesktop}" type="video/mp4"></video>{/if}
          </div>
        </div>
      {/if}

  {/if}
{/if}
