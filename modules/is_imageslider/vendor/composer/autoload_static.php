<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit9ba08c95d0af82fb7a45da2b6d8d15e0
{
    public static $prefixLengthsPsr4 = array (
        'O' => 
        array (
            'Oksydan\\IsImageslider\\' => 22,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Oksydan\\IsImageslider\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'Oksydan\\IsImageslider\\Cache\\TemplateCache' => __DIR__ . '/../..' . '/src/Cache/TemplateCache.php',
        'Oksydan\\IsImageslider\\Configuration\\SliderConfiguration' => __DIR__ . '/../..' . '/src/Configuration/SliderConfiguration.php',
        'Oksydan\\IsImageslider\\Controller\\IsImagesliderController' => __DIR__ . '/../..' . '/src/Controller/IsImagesliderController.php',
        'Oksydan\\IsImageslider\\Entity\\ImageSlider' => __DIR__ . '/../..' . '/src/Entity/ImageSlider.php',
        'Oksydan\\IsImageslider\\Entity\\ImageSliderLang' => __DIR__ . '/../..' . '/src/Entity/ImageSliderLang.php',
        'Oksydan\\IsImageslider\\Exceptions\\DatabaseYamlFileNotExistsException' => __DIR__ . '/../..' . '/src/Exceptions/DatabaseYamlFileNotExistsException.php',
        'Oksydan\\IsImageslider\\Exceptions\\DateRangeNotValidException' => __DIR__ . '/../..' . '/src/Exceptions/DateRangeNotValidException.php',
        'Oksydan\\IsImageslider\\Filter\\ImageSliderFileters' => __DIR__ . '/../..' . '/src/Filter/ImageSliderFileters.php',
        'Oksydan\\IsImageslider\\Form\\DataConfiguration\\ImageSliderDataConfiguration' => __DIR__ . '/../..' . '/src/Form/DataConfiguration/ImageSliderDataConfiguration.php',
        'Oksydan\\IsImageslider\\Form\\DataHandler\\ImageSliderFormDataHandler' => __DIR__ . '/../..' . '/src/Form/DataHandler/ImageSliderFormDataHandler.php',
        'Oksydan\\IsImageslider\\Form\\ImageSliderConfigurationType' => __DIR__ . '/../..' . '/src/Form/ImageSliderConfigurationType.php',
        'Oksydan\\IsImageslider\\Form\\ImageSliderType' => __DIR__ . '/../..' . '/src/Form/ImageSliderType.php',
        'Oksydan\\IsImageslider\\Form\\Provider\\ImageSliderConfigurationFormDataProvider' => __DIR__ . '/../..' . '/src/Form/Provider/ImageSliderConfigurationFormDataProvider.php',
        'Oksydan\\IsImageslider\\Form\\Provider\\ImageSliderFormDataProvider' => __DIR__ . '/../..' . '/src/Form/Provider/ImageSliderFormDataProvider.php',
        'Oksydan\\IsImageslider\\Grid\\Data\\Factory\\ImageSliderGridDataFactory' => __DIR__ . '/../..' . '/src/Grid/Data/Factory/ImageSliderGridDataFactory.php',
        'Oksydan\\IsImageslider\\Grid\\Definition\\Factory\\ImageSliderGridDefinitionFactory' => __DIR__ . '/../..' . '/src/Grid/Definition/Factory/ImageSliderGridDefinitionFactory.php',
        'Oksydan\\IsImageslider\\Grid\\Query\\ImageSliderQueryBuilder' => __DIR__ . '/../..' . '/src/Grid/Query/ImageSliderQueryBuilder.php',
        'Oksydan\\IsImageslider\\Handler\\FileEraser' => __DIR__ . '/../..' . '/src/Handler/FileEraser.php',
        'Oksydan\\IsImageslider\\Handler\\FileUploader' => __DIR__ . '/../..' . '/src/Handler/FileUploader.php',
        'Oksydan\\IsImageslider\\Hook\\AbstractCacheableDisplayHook' => __DIR__ . '/../..' . '/src/Hook/AbstractCacheableDisplayHook.php',
        'Oksydan\\IsImageslider\\Hook\\AbstractDisplayHook' => __DIR__ . '/../..' . '/src/Hook/AbstractDisplayHook.php',
        'Oksydan\\IsImageslider\\Hook\\AbstractHook' => __DIR__ . '/../..' . '/src/Hook/AbstractHook.php',
        'Oksydan\\IsImageslider\\Hook\\DisplayHeader' => __DIR__ . '/../..' . '/src/Hook/DisplayHeader.php',
        'Oksydan\\IsImageslider\\Hook\\DisplayHome' => __DIR__ . '/../..' . '/src/Hook/DisplayHome.php',
        'Oksydan\\IsImageslider\\Hook\\HookInterface' => __DIR__ . '/../..' . '/src/Hook/HookInterface.php',
        'Oksydan\\IsImageslider\\Installer\\ActionDatabaseAbstract' => __DIR__ . '/../..' . '/src/Installer/ActionDatabaseAbstract.php',
        'Oksydan\\IsImageslider\\Installer\\ActionDatabaseAddColumn' => __DIR__ . '/../..' . '/src/Installer/ActionDatabaseAddColumn.php',
        'Oksydan\\IsImageslider\\Installer\\ActionDatabaseCrateTable' => __DIR__ . '/../..' . '/src/Installer/ActionDatabaseCrateTable.php',
        'Oksydan\\IsImageslider\\Installer\\ActionDatabaseDropTable' => __DIR__ . '/../..' . '/src/Installer/ActionDatabaseDropTable.php',
        'Oksydan\\IsImageslider\\Installer\\ActionDatabaseInterface' => __DIR__ . '/../..' . '/src/Installer/ActionDatabaseInterface.php',
        'Oksydan\\IsImageslider\\Installer\\ActionDatabaseModifyColumn' => __DIR__ . '/../..' . '/src/Installer/ActionDatabaseModifyColumn.php',
        'Oksydan\\IsImageslider\\Installer\\DatabaseYamlParser' => __DIR__ . '/../..' . '/src/Installer/DatabaseYamlParser.php',
        'Oksydan\\IsImageslider\\Installer\\ImageSliderInstaller' => __DIR__ . '/../..' . '/src/Installer/ImageSliderInstaller.php',
        'Oksydan\\IsImageslider\\Installer\\Provider\\DatabaseYamlProvider' => __DIR__ . '/../..' . '/src/Installer/Provider/DatabaseYamlProvider.php',
        'Oksydan\\IsImageslider\\Presenter\\ImageSlidePresenter' => __DIR__ . '/../..' . '/src/Presenter/ImageSlidePresenter.php',
        'Oksydan\\IsImageslider\\Provider\\ImageProvider' => __DIR__ . '/../..' . '/src/Provider/ImageProvider.php',
        'Oksydan\\IsImageslider\\Provider\\ImageProviderInterface' => __DIR__ . '/../..' . '/src/Provider/ImageProviderInterface.php',
        'Oksydan\\IsImageslider\\Repository\\HookModuleRepository' => __DIR__ . '/../..' . '/src/Repository/HookModuleRepository.php',
        'Oksydan\\IsImageslider\\Repository\\ImageSliderRepository' => __DIR__ . '/../..' . '/src/Repository/ImageSliderRepository.php',
        'Oksydan\\IsImageslider\\Translations\\TranslationDomains' => __DIR__ . '/../..' . '/src/Translations/TranslationDomains.php',
        'Oksydan\\IsImageslider\\Type\\TranslatableFile' => __DIR__ . '/../..' . '/src/Type/TranslatableFile.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit9ba08c95d0af82fb7a45da2b6d8d15e0::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit9ba08c95d0af82fb7a45da2b6d8d15e0::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit9ba08c95d0af82fb7a45da2b6d8d15e0::$classMap;

        }, null, ClassLoader::class);
    }
}