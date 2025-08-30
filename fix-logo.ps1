$content = Get-Content 'src\app\page.tsx'

# Replace line 912 (index 911)
$content[911] = '                    <SimpleAnimatedLogo />'

# Replace line 1213 (index 1212) 
$content[1212] = '                    <SimpleAnimatedLogo />'

$content | Set-Content 'src\app\page.tsx'
