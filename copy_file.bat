@echo off
setlocal enabledelayedexpansion

set SOURCE=d:\Programming\TripleGates\Code\WafaWebsite-landing\src\v.1.1\css\style.css
set DEST=d:\Programming\TripleGates\Code\WafaWebsite-landing\css\style.css

echo Copying file...
copy /Y "!SOURCE!" "!DEST!"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ File copied successfully
    echo.
    echo First 5 lines of destination file:
    for /f "tokens=*" %%a in ('type "!DEST!" ^| findstr /L /M /R "."') do (
        echo %%a
        goto :end
    )
    :end
) else (
    echo ✗ Copy failed with error code %ERRORLEVEL%
)
