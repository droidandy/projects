{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "static.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}


{{/*
Set environment
*/}}
{{- define "static.environment" -}}
{{- default "development" .Values.environment | trunc 63 | trimSuffix "-" -}}
{{- end -}}


{{/*
Set chart labels
*/}}
{{- define "static.labels" -}}
app: {{ default (include "static.fullname" . ) (include "static.environment" . )  }}
release: {{ .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}


{{/*
Set secrets,configMap
*/}}
{{- define "static.envs" -}}
{{- if .Values.customSecret }}
- secretRef:
    name: {{ .Values.customSecret }}
{{- end }}
{{- if .Values.customConfigMap }}
- configMapRef:
    name: {{ .Values.customConfigMap }}
{{- end }}
{{- if .Values.secret }}
- secretRef:
    name: {{ template "static.fullname" . }}
{{- end }}
- configMapRef:
    name: {{ template "static.fullname" . }}
{{- end }}








