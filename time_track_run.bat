@echo off

:: Chạy backend trong nền
start /b cmd /c "cd /d D:\Coding\Solidjs\time-track\backend && go run main.go"

:: Chạy frontend trong nền
start /b cmd /c "cd /d D:\Coding\Solidjs\time-track\frontend && npm run dev"

pause
