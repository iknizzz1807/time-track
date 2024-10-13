@echo off

:: Chạy backend trong nền
start /b cmd /c "cd /d backend && go run main.go"

:: Chạy frontend trong nền
start /b cmd /c "cd /d frontend && npm run dev"

pause
