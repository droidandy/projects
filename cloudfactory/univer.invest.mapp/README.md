## Сборка
### Android
```
npm install

# открыть проект в Android Studio
# сделать sync gradle (если попросит - это сгенерирует iml файлы)
# запустить сборку оттуда
```

## Запуск

```
# запуск сборщика js на 0.0.0.0:8081
npm start

# для копирования локального файла на удалённый телефон
adb push android/app/build/outputs/apk/staging/debug/app-staging-debug.apk /mnt/sdcard2/download

# для проброса локалхоста с девайса на сборщик
adb reverse tcp:8081 tcp:8081

# открыть меню 
adb shell input keyevent 82
```

Для сборки и запуска staging одной коммандой:
```
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:~/Android/Sdk/platform-tools

./gradlew assembleStagingDebug && \
./gradlew --stop && \
adb install ./app/build/outputs/apk/staging/debug/app-staging-debug.apk && \
adb shell am start -a android.intent.action.MAIN -n ru.vtb.broker.staging/ru.vtb.broker.MainActivity
```

Далее собираем приложеньку (бинарь), ставим на устройство и запускаем. Обращаем внимание на то, что некоторые девайсы (анройд оболочки) могут блокировать всплывающие окна у приложений (например MiUI) - в этом случае надо сходить в настройки приложения и дать ему такое разрешение.

## Тесты
Пока нет, но вообще нужны бы на основе jest (?)

## Форматирование
Чтобы не возникало вопросов по форматированию на ревью используем prettier и tslint.

##### Плагины  
* [tslint-plugin-prettier](https://github.com/prettier/tslint-plugin-prettier) сообщает о конфликтах prettier при запуске tslint и фиксит при --fix.
* [tslint-config-prettier](https://github.com/prettier/tslint-config-prettier) отключает конфликтные правила в tslint c prettier (временно, надо будет поправить).    

##### Настройки форматирования
Для форматирования файла (папки) используем хоткей "fix tslint problems" в WebStorm или налогичный в vscode.  
В WebStorm:
* `Settings/Preferences -> Languages and Frameworks -> TypeScript -> TSLint -> Automatic search` включает TSLint. 
* `Settings/Preferences -> Keymap -> TSLint: fix` и назначить keymap.

# iOS

- provision profiles and app ids (fastlane register_app_ids)

UNIVER Invest Mapp Development
univer.invest.mapp.development

UNIVER Invest Mapp Staging
univer.invest.mapp.staging

UNIVER Invest Mapp Preview
univer.invest.mapp.preview

UNIVER Invest Mapp Preproduction
univer.invest.mapp.preproduction

