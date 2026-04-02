{{/*
Expand the name of the chart.
*/}}
{{- define "relay-forge.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "relay-forge.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "relay-forge.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "relay-forge.labels" -}}
helm.sh/chart: {{ include "relay-forge.chart" . }}
app.kubernetes.io/part-of: relayforge
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
{{- end }}

{{/*
Selector labels for a given component.
Usage: {{ include "relay-forge.selectorLabels" (dict "component" "api" "root" .) }}
*/}}
{{- define "relay-forge.selectorLabels" -}}
app.kubernetes.io/name: {{ .component }}
app.kubernetes.io/instance: {{ .root.Release.Name }}
{{- end }}

{{/*
Image for a given component.
Usage: {{ include "relay-forge.image" (dict "repository" .Values.api.image.repository "tag" .Values.api.image.tag "global" .Values.global) }}
*/}}
{{- define "relay-forge.image" -}}
{{- $tag := .tag | default .global.imageTag | default "latest" -}}
{{- printf "%s/%s:%s" .global.imageRegistry .repository $tag }}
{{- end }}

{{/*
ConfigMap name
*/}}
{{- define "relay-forge.configmapName" -}}
{{- printf "%s-config" (include "relay-forge.fullname" .) }}
{{- end }}

{{/*
Secret name
*/}}
{{- define "relay-forge.secretName" -}}
{{- printf "%s-secrets" (include "relay-forge.fullname" .) }}
{{- end }}

{{/*
Service account name
*/}}
{{- define "relay-forge.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "relay-forge.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Common environment variables from ConfigMap and Secret
*/}}
{{- define "relay-forge.envFrom" -}}
- configMapRef:
    name: {{ include "relay-forge.configmapName" .root }}
- secretRef:
    name: {{ include "relay-forge.secretName" .root }}
{{- end }}

{{/*
Standard health check probes for HTTP services.
Usage: {{ include "relay-forge.httpProbes" (dict "port" "http") }}
*/}}
{{- define "relay-forge.httpProbes" -}}
livenessProbe:
  httpGet:
    path: /healthz
    port: {{ .port }}
  initialDelaySeconds: 10
  periodSeconds: 15
  timeoutSeconds: 5
  failureThreshold: 3
readinessProbe:
  httpGet:
    path: /healthz
    port: {{ .port }}
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 3
  failureThreshold: 3
{{- end }}
