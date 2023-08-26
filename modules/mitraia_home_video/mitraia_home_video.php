<?php
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
*/

if (!defined('_PS_VERSION_')) {
    exit;
}

class Mitraia_home_video extends Module
{
    protected $config_form = false;

    public function __construct()
    {
        $this->name = 'mitraia_home_video';
        $this->tab = 'front_office_features';
        $this->version = '1.0.0';
        $this->author = 'Pierre Gonet';
        $this->need_instance = 0;

        /**
         * Set $this->bootstrap to true if your module is compliant with bootstrap (PrestaShop 1.6)
         */
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('home video');
        $this->description = $this->l('a module for display a video on the home page');

        $this->ps_versions_compliancy = array('min' => '1.7', 'max' => _PS_VERSION_);
    }

    /**
     * Don't forget to create update methods if needed:
     * http://doc.prestashop.com/display/PS16/Enabling+the+Auto-Update
     */
    public function install()
    {
        Configuration::updateValue('MITRAIA_HOME_VIDEO_LIVE_MODE', false);

        return parent::install() &&
            $this->registerHook('displayHeader') &&
            $this->registerHook('displayBackOfficeHeader') &&
            $this->registerHook('displayHome');
    }

    public function uninstall()
    {
        Configuration::deleteByName('MITRAIA_HOME_VIDEO_LIVE_MODE');

        return parent::uninstall();
    }

    /**
     * Load the configuration form
     */
    public function getContent()
    {
        /**
         * If values have been submitted in the form, process.
         */
        if (((bool)Tools::isSubmit('submitMitraia_home_videoModule')) == true) {
            $this->postProcess();
        }


        $this->context->smarty->assign('module_dir', $this->_path);

        $this->context->controller->addJS($this->_path . 'views/js/back.js');

        $output = $this->context->smarty->fetch($this->local_path.'views/templates/admin/configure.tpl');

        return $output.$this->renderForm();
    }

    /**
     * Create the form that will be displayed in the configuration of your module.
     */
    protected function renderForm()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->submit_action = 'submitMitraia_home_videoModule';
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            .'&configure='.$this->name.'&tab_module='.$this->tab.'&module_name='.$this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => $this->getConfigFormValues(), /* Add values for your inputs */
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );


        return $helper->generateForm(array($this->getConfigForm()));
    }

    /**
     * Create the structure of your form.
     */
    protected function getConfigForm()
    {
        return array(
            'form' => array(
                'legend' => array(
                'title' => $this->l('Settings'),
                'icon' => 'icon-cogs',
                ),
                'input' => array(
                    array(//ajout une image
                        'type' => "file",
                        'label' => $this->l('Downloads your picture for desktop'),
                        'name' => 'MITRAIA_HOME_VIDEO_PICTURE_DESKTOP',
                        'display_image' => true,
                    ),
                    array(//miniature
                        'type' => "html",
                        "name" => "MITRAIA_HOME_VIDEO_PICTURE_DESKTOP_MINIATURE",
                        "class" => "hidden",
                        'html_content' => "<div id='MITRAIA_HOME_VIDEO_PICTURE_DESKTOP_MINIATURE'>" . (Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_DESKTOP', null) == null ? "" : '<label><strong>' . $this->l('Current image:') . '</strong></label><img width="200" height="200" src="' . Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_DESKTOP', null) . '" alt="miniature">') . '</div>',
                    ),
                    array(//suppresion
                        'type' => 'checkbox',
                        'label' => $this->l(' '),
                        'name' => 'MITRAIA_HOME_VIDEO_PICTURE_DESKTOP_DELETE',
                        "class" => "hidden",
                        'values' => array(
                            'query' => array(
                                array(
                                    'id' => Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_DESKTOP', null) == null ?"OFF" :'ON',
                                    'name' => $this->l('delete picture'), // Cette valeur sera envoyée si la case à cocher est cochée
                                )
                            ),
                            'id' => 'id', // ID du champ de case à cocher
                            'name' => 'name', // Nom du champ de case à cocher
                        )
                    ),

                    array(//ajout une video
                        'type' => "file",
                        'label' => $this->l('Downloads your video for desktop'),
                        'name' => 'MITRAIA_HOME_VIDEO_VIDEO_DESKTOP'
                    ),
                    array(//miniature
                        'type' => "html",
                        "name" => "MITRAIA_HOME_VIDEO_VIDEO_DESKTOP_MINIATURE",
                        'html_content' => "<div id='MITRAIA_HOME_VIDEO_VIDEO_DESKTOP_MINIATURE'>" . (Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_DESKTOP', null) == null ? "" : '<label><strong>' . $this->l('Current image:') . '</strong></label><video controls width="200" height="200"> <source src="' . Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_DESKTOP', null) . '" type="video/mp4">' . $this->l('Your navigator does not support video') . '</video>') . '</div>',
                    ),
                    array(//suppresion
                        'type' => 'checkbox',
                        'label' => $this->l(' '),
                        'name' => 'MITRAIA_HOME_VIDEO_VIDEO_DESKTOP_DELETE',
                        "class" => "hidden",
                        'values' => array(
                            'query' => array(
                                array(
                                    'id' => Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_DESKTOP', null) == null ?"OFF" :'ON',
                                    'name' => $this->l('delete video'), // Cette valeur sera envoyée si la case à cocher est cochée
                                )
                            ),
                            'id' => 'id', // ID du champ de case à cocher
                            'name' => 'name', // Nom du champ de case à cocher
                        )
                    ),

                    array(//ajout d'une image
                        'type' => "file",
                        'label' => $this->l('Downloads your picture for mobile'),
                        'name' => 'MITRAIA_HOME_VIDEO_PICTURE_MOBILE'
                    ),
                    array(//miniature
                        'type' => "html",
                        "name" => "MITRAIA_HOME_VIDEO_PICTURE_MOBILE_MINIATURE",
                        'html_content' => "<div id='MITRAIA_HOME_VIDEO_PICTURE_MOBILE_MINIATURE'>" . (Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_MOBILE', null) == null ? "" : '<label><strong>' . $this->l('Current image:') . '</strong></label><img width="200" height="200" src="' . Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_MOBILE', null) . '" alt="miniature">') . '</div>',
                    ),
                    array(//suppresion
                        'type' => 'checkbox',
                        'label' => $this->l(' '),
                        'name' => 'MITRAIA_HOME_VIDEO_PICTURE_MOBILE_DELETE',
                        "class" => "hidden",
                        'values' => array(
                            'query' => array(
                                array(
                                    'id' => Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_MOBILE', null) == null ?"OFF" :'ON',
                                    'name' => $this->l('delete picture'), // Cette valeur sera envoyée si la case à cocher est cochée
                                )
                            ),
                            'id' => 'id', // ID du champ de case à cocher
                            'name' => 'name', // Nom du champ de case à cocher
                        )
                    ),

                    array(//ajout d'une video
                        'type' => "file",
                        'label' => $this->l('Downloads your video for mobile'),
                        'name' => 'MITRAIA_HOME_VIDEO_VIDEO_MOBILE'
                    ),
                    array(//miniature
                        'type' => "html",
                        "name" => "MITRAIA_HOME_VIDEO_VIDEO_MOBILE_MINIATURE",
                        'html_content' => "<div id='MITRAIA_HOME_VIDEO_VIDEO_MOBILE_MINIATURE'>" . (Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_MOBILE', null) == null ? "" : '<label><strong>' . $this->l('Current image:') . '</strong></label><video controls width="200" height="200"> <source src="' . Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_MOBILE', null) . '" type="video/mp4">' . $this->l('Your navigator does not support video') . '</video>') .'</div>',
                    ),
                    array(//suppresion
                        'type' => 'checkbox',
                        'label' => $this->l(' '),
                        'name' => 'MITRAIA_HOME_VIDEO_VIDEO_MOBILE_DELETE',
                        "class" => "hidden",
                        'values' => array(
                            'query' => array(
                                array(
                                    'id' => Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_MOBILE_MINIATURE', null) == null ?"OFF" :'ON',
                                    'name' => $this->l('delete video'), // Cette valeur sera envoyée si la case à cocher est cochée
                                )
                            ),
                            'id' => 'id', // ID du champ de case à cocher
                            'name' => 'name', // Nom du champ de case à cocher
                        )
                    ),

                    array(
                        'type' => "switch",
                        "label" => $this->l("activate"),
                        'name' => 'MITRAIA_HOME_VIDEO_ACTIVATE',
                        'is_bool' => true,
                        'values' => array(
                            array(
                                'id' => 'active_on',
                                'value' => true,
                                'label' => $this->l('Enabled')
                            ),
                            array(
                                'id' => 'active_off',
                                'value' => false,
                                'label' => $this->l('Disabled')
                            )
                        ),
                    )
                ),
                'submit' => array(
                    'title' => $this->l('Save'),
                ),
            ),
        );
    }

    /**
     * Set values for the inputs.
     */
    protected function getConfigFormValues()
    {
        return array(
            'MITRAIA_HOME_VIDEO_PICTURE_DESKTOP' => Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_DESKTOP', null),
            'MITRAIA_HOME_VIDEO_VIDEO_DESKTOP' => Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_DESKTOP', null),
            'MITRAIA_HOME_VIDEO_PICTURE_MOBILE' => Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_MOBILE', null),
            'MITRAIA_HOME_VIDEO_VIDEO_MOBILE' => Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_MOBILE', null),
            'MITRAIA_HOME_VIDEO_ACTIVATE' => Configuration::get('MITRAIA_HOME_VIDEO_ACTIVATE', true),
        );
    }

    /**
     * Save form data.
     */
    protected function postProcess()
    {
        $form_values = $this->getConfigFormValues();
        $errorMessages = [];
        //dump($_POST);

        foreach (array_keys($form_values) as $key) {
            if(
                $key == "MITRAIA_HOME_VIDEO_PICTURE_DESKTOP" ||
                $key == "MITRAIA_HOME_VIDEO_VIDEO_DESKTOP" ||
                $key == "MITRAIA_HOME_VIDEO_PICTURE_MOBILE" ||
                $key == "MITRAIA_HOME_VIDEO_VIDEO_MOBILE"
                ){
                    $imageField = Tools::fileAttachment($key);

                    if (!empty($_POST[$key . "_DELETE_ON"])) {
                         // Supprimez l'image actuelle du serveur
                        $currentImagePath = Configuration::get($key);
                        /*if (!empty($currentImagePath)) {
                            unlink($currentImagePath);
                        }*/

                        // Effacez la valeur du champ de fichier dans la configuration
                        Configuration::updateValue($key, null);

                    }
                    elseif (!empty($imageField['tmp_name'])) {
                        //picture
                        if(($key === "MITRAIA_HOME_VIDEO_PICTURE_DESKTOP" || $key === "MITRAIA_HOME_VIDEO_PICTURE_MOBILE") &&  exif_imagetype($imageField['tmp_name']) === IMAGETYPE_JPEG){
                            $newImagePath = dirname(__FILE__) . '/views/img/' . $imageField['name'];
                            move_uploaded_file($imageField['tmp_name'], $newImagePath);
                            Configuration::updateValue($key, Context::getContext()->shop->getBaseURL() . "modules/mitraia_home_video/views/img/" . $imageField['name']);
                        }
                        elseif($key === "MITRAIA_HOME_VIDEO_PICTURE_DESKTOP" || $key === "MITRAIA_HOME_VIDEO_PICTURE_MOBILE"){
                            $errorMessages[] = $this->l('Format accept for the picture is only .jpg');
                        }

                        //video
                        if (($key === "MITRAIA_HOME_VIDEO_VIDEO_DESKTOP" || $key === "MITRAIA_HOME_VIDEO_VIDEO_MOBILE") && in_array(strtolower(pathinfo($imageField['name'], PATHINFO_EXTENSION)), array('mp4'))){
                            $newImagePath = dirname(__FILE__) . '/views/img/' . $imageField['name'];
                            move_uploaded_file($imageField['tmp_name'], $newImagePath);
                            Configuration::updateValue($key, Context::getContext()->shop->getBaseURL() . "modules/mitraia_home_video/views/img/" . $imageField['name']);
                        }
                        elseif($key === "MITRAIA_HOME_VIDEO_VIDEO_DESKTOP" || $key === "MITRAIA_HOME_VIDEO_VIDEO_MOBILE"){
                            $errorMessages[] = $this->l('Format accept for the video is only .mp4');
                        }
                    }
            }
            else{
                Configuration::updateValue($key, Tools::getValue($key));
            }
        }
        if (!empty($errorMessages)) {
            $this->_errors[] = implode('<br>', $errorMessages);
            foreach ($this->_errors as $error) {
                $this->context->controller->errors[] = $error;
            }
        }
    }

    /**
    * Add the CSS & JavaScript files you want to be loaded in the BO.
    */
    public function hookDisplayBackOfficeHeader()
    {
        if (Tools::getValue('configure') == $this->name) {
            $this->context->controller->addJS($this->_path.'views/js/back.js');
            $this->context->controller->addCSS($this->_path.'views/css/back.css');
        }
    }

    /**
     * Add the CSS & JavaScript files you want to be added on the FO.
     */
    public function hookDisplayHeader()
    {
        $this->context->controller->addJS($this->_path.'/views/js/front.js');
        $this->context->controller->addCSS($this->_path.'/views/css/front.css');
    }

    public function hookDisplayHome()
    {
        $this->context->smarty->assign(array(
            'pictureDesktop' => Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_DESKTOP'),
            'videoDesktop' => Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_DESKTOP'),
            'pictureMobile' => Configuration::get('MITRAIA_HOME_VIDEO_PICTURE_MOBILE'),
            'videoMobile' => Configuration::get('MITRAIA_HOME_VIDEO_VIDEO_MOBILE'),
            'moduleSliderActivate' => Configuration::get('MITRAIA_HOME_VIDEO_ACTIVATE'),
        ));

        return $this->display(__FILE__, 'views/templates/hook/displayhome.tpl');

    }
}
