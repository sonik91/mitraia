{block name='product_name'}
  {$headingTag = 'h2'}
  {if $page.page_name == 'index'}
    {$headingTag = 'h3'}
  {/if}
  <{$headingTag} class="h3 product-miniature__title mb-2">
      <a class="text-reset d-block w-100 text-center" href="{$product.url}">{$product.name}</a>
  </{$headingTag}>
{/block}
