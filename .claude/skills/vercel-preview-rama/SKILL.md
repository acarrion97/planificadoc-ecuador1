---
name: vercel-preview-rama
description: Reporta la URL de preview de Vercel y su estado de build para la rama git actual de este repo. Úsalo proactivamente al empezar a trabajar en el repo, después de un `git checkout`/`git switch`/`git branch` a una rama distinta a la última usada, o cuando el usuario pregunta "dónde veo esto", "cuál es el preview", "URL de esta rama", "ya se puede ver en Vercel". Es de solo lectura: nunca crea proyectos, nunca dispara despliegues, nunca toca producción — Vercel ya genera un preview automáticamente por cada push a cualquier rama de este repo (integración Git existente), así que esta skill solo consulta y muestra ese preview, no lo crea.
---

# Preview de Vercel para la rama actual

Este repo (`planificadoc-ecuador1`) está enlazado a Vercel vía integración Git de GitHub. **Cada push a cualquier rama ya dispara un build y obtiene un alias de preview propio, automáticamente** — no existe (y no hace falta crear) un proyecto o "entorno" separado por rama. Esta skill solo detecta y reporta ese alias; nunca lo crea ni lo modifica.

## Por qué no se puede adivinar la URL a partir del nombre de la rama

El alias sigue el patrón `planificadoc-ecuador1-git-<slug>-nicoles-projects-134282bd.vercel.app`, pero `<slug>` **no es** una simple slugificación del nombre de la rama. Ejemplos reales observados:

| Rama | Alias real |
|---|---|
| `main` | `...git-main-...` |
| `fix/curriculo-academico` | `...git-fix-dab1db-...` |
| `preview/bachillerato-tecnico` | `...git-prev-74eac3-...` |
| `preview/conecta-nivela-crea` | `...git-prev-b57329-...` |

Para ramas con `/` en el nombre, Vercel usa un prefijo corto + hash — **no reconstruible de forma determinista sin consultar la API**. Por eso este skill siempre consulta Vercel directamente en vez de construir la URL a mano.

## Procedimiento

1. **Rama actual**: `git branch --show-current`.

2. **Cargar las tools de Vercel** (son deferred, hace falta `ToolSearch` la primera vez en la sesión):
   ```
   ToolSearch query: "select:mcp__40168ce2-28bd-4ecc-8961-e14df9d0e001__list_deployments,mcp__40168ce2-28bd-4ecc-8961-e14df9d0e001__get_git_deployment_context"
   ```

3. **Identificar el proyecto**: leer `.vercel/project.json` en la raíz del repo → `projectId` y `orgId`. No hardcodear estos valores; si el archivo no existe, usar `get_git_deployment_context` para encontrar el proyecto enlazado a `acarrion97/planificadoc-ecuador1`.

4. **Buscar el despliegue de esta rama**: llamar `list_deployments` con ese `projectId`/`teamId` (orgId). Filtrar los resultados por `meta.githubCommitRef === <rama actual>` y tomar el primero (la lista viene ordenada del más reciente al más antiguo). Extraer:
   - `meta.branchAlias` → la URL de preview (anteponer `https://`)
   - `state` (`BUILDING` / `READY` / `ERROR` / etc.)
   - `meta.githubCommitSha` / `meta.githubCommitMessage` (primera línea) → qué commit está sirviendo

5. **Si no hay ningún deployment para esa rama todavía** (rama nueva que nunca se subió a GitHub): decirlo explícitamente — "esta rama no tiene preview todavía porque no se ha hecho push; Vercel lo creará automáticamente en el primer `git push`". No ofrecer crear nada manualmente.

6. **Reportar al usuario**: rama, URL (`https://...`), estado, y de qué commit es. Si `state` es `BUILDING`, aclarar que puede tardar 1-3 min y que se puede volver a consultar.

## Límites estrictos (no negociables)

- **Nunca** llamar herramientas de Vercel que desplieguen, creen proyectos, pausen/reanuden, compren dominios, o modifiquen protección de despliegue (p. ej. `deploy_to_vercel`, `create_git_project`, `pause_project`, `unpause_project`, `update_project_deployment_protection`, `buy_domain`, `buy_pro`, `buy_addon`, `buy_credits`). Esta skill es de solo lectura: `list_deployments`, `get_deployment`, `get_project`, `get_git_deployment_context`, `list_projects`, `list_teams`, `get_deployment_build_logs`, `get_runtime_logs`/`get_runtime_errors` están permitidas.
- **Nunca** hacer `git push` por cuenta propia como parte de esta skill — el push que dispara el build es una acción del usuario o de otra parte de la conversación, no de esta skill.
- **Nunca** tocar `vercel.json`, `.vercel/project.json`, variables de entorno, ni el dominio de producción (`planificadoc.app`).
- Si el usuario pide explícitamente "despliega esto" o "crea un proyecto nuevo en Vercel", eso está fuera del alcance de esta skill — es una acción con efecto real que se confirma aparte, en el chat, no automatizada aquí.
