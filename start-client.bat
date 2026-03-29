::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAnk
::fBw5plQjdG8=
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSDk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+JeA==
::cxY6rQJ7JhzQF1fEqQJQ
::ZQ05rAF9IBncCkqN+0xwdVs0
::ZQ05rAF9IAHYFVzEqQJQ
::eg0/rx1wNQPfEVWB+kM9LVsJDGQ=
::fBEirQZwNQPfEVWB+kM9LVsJDGQ=
::cRolqwZ3JBvQF1fEqQJQ
::dhA7uBVwLU+EWDk=
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::Zh4grVQjdCuDJEuB5E45KxpoagWRNGK1BbwI8cT6+uSEqkgPGucnfe8=
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off
title FashionCity Launcher

set "ROOT="
if exist "%~dp0backend\package.json" if exist "%~dp0frontend\package.json" set "ROOT=%~dp0"
if not defined ROOT if exist "%CD%\backend\package.json" if exist "%CD%\frontend\package.json" set "ROOT=%CD%\"

if not defined ROOT (
	echo Could not find project root with both backend and frontend folders.
	echo Please keep this launcher inside your project folder.
	pause
	exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
	echo Node.js/npm is not installed on this machine.
	pause
	exit /b 1
)

echo Using project root: %ROOT%

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /F /PID %%a >nul 2>&1

echo Starting Backend...
start "FashionCity Backend" cmd /k "cd /d ""%ROOT%backend"" && npm run dev"

timeout /t 4 /nobreak >nul

echo Starting Frontend...
start "FashionCity Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm run dev -- --host 127.0.0.1 --port 5173"

timeout /t 6 /nobreak >nul

start "" "http://127.0.0.1:5173"
echo Done. Browser opened.
