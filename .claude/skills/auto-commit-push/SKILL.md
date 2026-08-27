# Skill: Auto Commit & Push

Ejecuta `git fetch`, `git add`, `git commit` y `git push` automáticamente al finalizar cada tarea de desarrollo.

## Flujo

1. Ejecutar `git fetch` antes de empezar
2. Al terminar la tarea:
   - Revisar `git status` y `git diff`
   - Stagear solo archivos intencionales (nunca secrets ni archivos no relacionados)
   - Commit con mensaje descriptivo en español (estilo del repo: `fix(modulo): descripción`)
   - Ejecutar `git push`
3. Reportar resultado al usuario

## Notas
- NO commitear archivos de openspec ni temporales (output.txt, etc.)
- Mensajes en español, concisos
- Si hay conflictos, reportar al usuario
