cd "C:\Users\Lukas\Documents\GitHub\planificadoc-ecuador1"
git fetch
git add -A
$changes = git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    $fecha = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "auto: cambios pendientes del $fecha"
    git push
}
