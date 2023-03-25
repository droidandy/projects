# Тестовый вывод манифестов:
`helm template backend .helm`

# Именование namespace
prod-окружение развертывается в namespace "rubyapp-prod" из ветки master.
stage-окружение развертывается в namespace "rubyapp-staging" из любой ветки кроме ветки master.

# Переменные для окружений
Для prod-окружения переменные находятся в файле .helm/values.yaml
Для stage-окружения в файле .helm/values-staging.yaml