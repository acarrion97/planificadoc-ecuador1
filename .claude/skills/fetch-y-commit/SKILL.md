---
name: fetch-y-commit
description: Flujo de trabajo obligatorio en este repositorio: antes de realizar CADA cambio ejecutar `git fetch`, y al terminar la actividad solicitada hacer un commit. Usar en toda sesión de desarrollo sobre este proyecto (Planificador/MINEDUC). Trigger con "fetch", "commit", "guarda como skill", "antes de cada cambio", "al terminar haz commit".
---

# Flujo de trabajo: fetch antes de cada cambio y commit al terminar

Regla obligatoria para TODO trabajo sobre este repositorio:

## 1. Antes de cada cambio
- Ejecutar `git fetch` antes de empezar cualquier modificación (nueva tarea, edición de archivos, creación de archivos).
- Si el fetch trae cambios upstream que afectan la rama actual, avisar al usuario antes de continuar.

## 2. Al terminar la actividad solicitada
- Verificar el trabajo: typecheck (`pnpm check`) y tests relevantes (`pnpm test __tests__/...`).
- Revisar `git status` y `git diff` para stagear solo los archivos intencionales.
- Hacer commit con mensaje descriptivo en español siguiendo el estilo del repo (p.ej. `feat(semanal): unificar tamaño de fuente...`).
- NO hacer push a menos que el usuario lo pida explícitamente (el usuario suele hacer el push manualmente).
- NO commitear secretos ni archivos no relacionados.

## Notas del repo
- Node: `export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"`.
- Rama de trabajo: `preview/adaptaciones-curriculares`.
- Hay 49 errores TS preexistentes en `pnpm check` que no deben aumentar.
- Tests que pasan: 28/28 (`pdf-generator` + `inserciones-curriculares`).