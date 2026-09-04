$src = "D:\sih_final"
$dst = "D:\sih_final1"

Write-Host "Creating target directory D:\sih_final1..."
New-Item -ItemType Directory -Path $dst -Force | Out-Null
New-Item -ItemType Directory -Path "$dst\server" -Force | Out-Null
New-Item -ItemType Directory -Path "$dst\client" -Force | Out-Null

Write-Host "Copying server files to D:\sih_final1..."
Get-ChildItem -Path "$src\server" -Recurse | Where-Object {
    $_.FullName -notmatch "\\node_modules\\"
} | ForEach-Object {
    $target = $_.FullName.Replace("$src\server", "$dst\server")
    if ($_.PSIsContainer) {
        New-Item -ItemType Directory -Path $target -Force | Out-Null
    } else {
        $dir = Split-Path $target -Parent
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Copy-Item -Path $_.FullName -Destination $target -Force
    }
}

Write-Host "Copying client files to D:\sih_final1..."
Get-ChildItem -Path "$src\client" -Recurse | Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\dist\\"
} | ForEach-Object {
    $target = $_.FullName.Replace("$src\client", "$dst\client")
    if ($_.PSIsContainer) {
        New-Item -ItemType Directory -Path $target -Force | Out-Null
    } else {
        $dir = Split-Path $target -Parent
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Copy-Item -Path $_.FullName -Destination $target -Force
    }
}

Write-Host "Done copying to D:\sih_final1!"
