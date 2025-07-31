@echo off
setlocal enabledelayedexpansion

:: Configurazione
set "BACKENDTITLE=VitaApp Backend"
set "FRONTENDTITLE=VitaApp Frontend"
set "BACKENDDIR=%~dp0backend"
set "FRONTENDDIR=%~dp0frontend"
set "DATADIR=%~dp0data"
set "PROJECTROOT=%~dp0"

:: Colori per output
color 0A

:menu
cls
echo ==========================================
echo        VitaApp - Pannello di Controllo
echo               v3.0 Unified
echo ==========================================
echo.

:: Controlla lo stato dei servizi
call :checkstatus
echo Stato attuale:
echo   - Backend:  !BACKENDSTATUS!
echo   - Frontend: !FRONTENDSTATUS!
echo   - Node Processes: !NODECOUNT!
echo.
echo ==========================================
echo                   MENU
echo ==========================================
echo.
echo [BASILARI]
echo     1. [S] Avvia Tutto (Quick Start)
echo     2. [K] Ferma Tutto (Kill All)
echo     3. [R] Riavvia Tutto
echo.
echo [AVANZATE]
echo     4. [+] Avvia Solo Backend
echo     5. [-] Ferma Solo Backend
echo     6. [+] Avvia Solo Frontend
echo     7. [-] Ferma Solo Frontend
echo.
echo [INSTALLAZIONE E MANUTENZIONE]
echo     8. [I] Installazione / Ripristino Completo
echo     9. [C] Pulisci Cache (Leggera)
    echo 10. [X] Pulizia Profonda (Rimuove Cache, Log, etc)
echo.

echo [BUILD E DEPLOY]
    echo 11. [B] Build per Produzione
echo.

echo [DIAGNOSTICA]
echo    12. [D] Info Debug e Diagnostica
echo    13. [P] Processi Node.js Attivi
echo.
echo [SISTEMA]
echo    14. [Q] Esci (e killa tutto)
echo.

set /p choice="Scegli un'opzione: "

if /I "%choice%"=="1" (call :quickstart & goto menu)
if /I "%choice%"=="S" (call :quickstart & goto menu)
if /I "%choice%"=="2" (call :killallnode & goto menu)
if /I "%choice%"=="K" (call :killallnode & goto menu)
if /I "%choice%"=="3" (call :restartall & goto menu)
if /I "%choice%"=="R" (call :restartall & goto menu)
if /I "%choice%"=="4" (call :startbackend & goto menu)
if /I "%choice%"=="5" (call :stopbackend & goto menu)
if /I "%choice%"=="6" (call :startfrontend & goto menu)
if /I "%choice%"=="7" (call :stopfrontend & goto menu)
if /I "%choice%"=="8" (call :firstinstall & goto menu)
if /I "%choice%"=="I" (call :firstinstall & goto menu)
if /I "%choice%"=="9" (call :cleancachelight & goto menu)
if /I "%choice%"=="C" (call :cleancachelight & goto menu)
if /I "%choice%"=="10" (call :deepclean & goto menu)
if /I "%choice%"=="X" (call :deepclean & goto menu)
if /I "%choice%"=="11" (call :buildproduction & goto menu)
if /I "%choice%"=="B" (call :buildproduction & goto menu)
if /I "%choice%"=="12" (call :projectinfo & goto menu)
if /I "%choice%"=="D" (call :projectinfo & goto menu)
if /I "%choice%"=="13" (call :shownodeprocesses & goto menu)
if /I "%choice%"=="P" (call :shownodeprocesses & goto menu)
if /I "%choice%"=="14" (goto exitscript)
if /I "%choice%"=="Q" (goto exitscript)

echo.
echo [ERRORE] Scelta non valida. Riprova.
timeout /t 2 /nobreak >nul
goto menu

REM ==================================================================
REM                    NUOVA FUNZIONE: PRIMA INSTALLAZIONE
REM ==================================================================

:firstinstall
echo.
echo === PRIMA INSTALLAZIONE / SETUP COMPLETO ===
echo.

:: Verifica Node.js
echo [1/7] Verifica Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERRORE] Node.js non installato!
    echo.
    echo Scarica Node.js da: https://nodejs.org/
    echo.
    pause
    goto :eof
)
node --version
npm --version
echo [OK] Node.js presente
echo.

:: Kill tutti i processi
echo [2/7] Pulizia processi esistenti...
call :killallnodesilent
echo [OK] Processi puliti
echo.

:: Installa dipendenze backend
echo [3/7] Installazione dipendenze Backend...
cd /d "%BACKENDDIR%"
npm install --force
if errorlevel 1 (
    echo [ERRORE] Installazione backend fallita!
    pause
    goto :eof
)
echo [OK] Backend pronto
echo.

:: Installa dipendenze frontend
echo [4/7] Installazione dipendenze Frontend...
cd /d "%FRONTENDDIR%"
npm install --force
if errorlevel 1 (
    echo [ERRORE] Installazione frontend fallita!
    pause
    goto :eof
)
echo [OK] Frontend pronto
echo.

:: Pulisci cache
echo [5/7] Pulizia cache completa...
call :deepcleancachesilent
echo [OK] Cache pulita
echo.

:: Crea directory data se non esiste
echo [6/7] Verifica struttura progetto...
if not exist "%DATADIR%" mkdir "%DATADIR%"
echo [OK] Struttura verificata
echo.

:: Test finale
echo [7/7] Test configurazione...
cd /d "%FRONTENDDIR%"
npx tsc --noEmit --project tsconfig.json >nul 2>&1
if errorlevel 1 (
    echo [WARN] Problemi TypeScript rilevati
) else (
    echo [OK] TypeScript configurato correttamente
)
echo.

echo ==========================================
echo    INSTALLAZIONE COMPLETATA!
echo ==========================================
echo.
echo Il progetto e' pronto all'uso.
echo Usa l'opzione 1 per avviare tutto.
echo.
pause
goto :eof

REM ==================================================================
REM                    NUOVA FUNZIONE: PULIZIA PROFONDA
REM ==================================================================

:deepclean
    echo.
    echo === PULIZIA PROFONDA DEL PROGETTO ===
    echo.
    echo [1/5] Rimozione file di configurazione obsoleti...
    del /f /q "%FRONTENDDIR%\postcss.config.alternative.js" >nul 2>&1
    del /f /q "%FRONTENDDIR%\postcss.config.js.backup" >nul 2>&1
    del /f /q "%FRONTENDDIR%\postcss.config.mjs.backup" >nul 2>&1
    del /f /q "%FRONTENDDIR%\postcss.config.alternative.js.bak" >nul 2>&1
    echo [OK]
    echo.

    echo [2/5] Rimozione cache di Vite e nodemodules...
    call :deepcleancachesilent
    echo [OK]
    echo.

    echo [3/5] Rimozione file di log...
    del /f /q "%FRONTENDDIR%\npm-debug.log*" >nul 2>&1
    del /f /q "%FRONTENDDIR%\yarn-debug.log*" >nul 2>&1
    del /f /q "%FRONTENDDIR%\yarn-error.log*" >nul 2>&1
    del /f /q "%BACKENDDIR%\npm-debug.log*" >nul 2>&1
    del /f /q "%BACKENDDIR%\yarn-debug.log*" >nul 2>&1
    del /f /q "%BACKENDDIR%\yarn-error.log*" >nul 2>&1
    echo [OK]
    echo.

    echo [4/5] Verifica file .gitignore...
    if not exist "%FRONTENDDIR%\.gitignore" echo # Dependencies > "%FRONTENDDIR%\.gitignore"
    if not exist "%BACKENDDIR%\.gitignore" echo # Dependencies > "%BACKENDDIR%\.gitignore"
    echo [OK]
    echo.
    
    echo [5/5] Controllo file essenziali...
    if exist "%FRONTENDDIR%\package.json" (echo   - [OK] frontend/package.json) else (echo   - [!!] MANCANTE: frontend/package.json)
    if exist "%BACKENDDIR%\package.json" (echo   - [OK] backend/package.json) else (echo   - [!!] MANCANTE: backend/package.json)
    if exist "%FRONTENDDIR%\vite.config.ts" (echo   - [OK] frontend/vite.config.ts) else (echo   - [!!] MANCANTE: frontend/vite.config.ts)
    if exist "%BACKENDDIR%\server.js" (echo   - [OK] backend/server.js) else (echo   - [!!] MANCANTE: backend/server.js)
    echo.

    echo ==========================================
    echo      PULIZIA PROFONDA COMPLETATA
    echo ==========================================
    echo.
    pause
    goto :eof

REM ==================================================================
REM                 FUNZIONI MIGLIORATE PER KILL PROCESSI
REM ==================================================================

:checkstatus
    set "BACKENDSTATUS=[X] Fermo"
    set "FRONTENDSTATUS=[X] Fermo"
    set NODECOUNT=0
    
    :: Conta processi node
    for /f %%i in ('tasklist ^| find /c "node.exe"') do set NODECOUNT=%%i
    
    :: Verifica backend
    netstat -ano | findstr :4000 >nul 2>&1
    if not errorlevel 1 set "BACKENDSTATUS=[OK] In Esecuzione"
    
    :: Verifica frontend
    netstat -ano | findstr :5173 >nul 2>&1
    if not errorlevel 1 set "FRONTENDSTATUS=[OK] In Esecuzione"
    
    goto :eof

:killallnode
echo.
echo === KILL ALL NODE PROCESSES ===
echo.
echo [WARN] Verra' terminato OGNI processo Node.js!
echo.
set /p confirm="Sei sicuro? (S/N): "
if /i not "%confirm%"=="S" (
    echo [INFO] Operazione annullata.
    timeout /t 2 /nobreak >nul
    goto :eof
)
echo.
echo [INFO] Terminazione di tutti i processi Node.js...
taskkill /F /IM node.exe /T 2>nul
if errorlevel 1 (
    echo [INFO] Nessun processo Node.js trovato
) else (
    echo [OK] Tutti i processi Node.js terminati
)
echo.
pause
goto :eof

:killallnodesilent
taskkill /F /IM node.exe /T >nul 2>&1
goto :eof

REM ==================================================================
REM              FUNZIONI DI AVVIO/STOP MIGLIORATE
REM ==================================================================

:startbackend
    echo.
    echo --- Avvio Backend ---
    
    :: Verifica porta 4000
    netstat -ano | findstr :4000 >nul 2>&1
    if not errorlevel 1 (
        echo [WARN] Porta 4000 gia' in uso!
        echo [INFO] Tentativo di liberare la porta...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do (
            taskkill /F /PID %%a >nul 2>&1
        )
        timeout /t 2 /nobreak >nul
    )
    
    :: Verifica dipendenze
    if not exist "%BACKENDDIR%\node_modules" (
        echo [WARN] Dipendenze backend non installate!
        echo [INFO] Installazione in corso...
        cd /d "%BACKENDDIR%"
        npm install
    )
    
    :: Avvia backend
    if not exist "%BACKENDDIR%\server.js" (
        echo [ERROR] File server.js non trovato!
    ) else (
        echo [INFO] Avvio del server Backend...
        start "%BACKENDTITLE%" /D "%BACKENDDIR%" cmd /k "node server.js"
        timeout /t 3 /nobreak >nul
        
        :: Verifica avvio
        netstat -ano | findstr :4000 >nul 2>&1
        if errorlevel 1 (
            echo [ERROR] Backend non avviato correttamente!
        ) else (
            echo [OK] Backend avviato su http://localhost:4000
        )
    )
    goto :eof

:stopbackend
    echo.
    echo --- Arresto Backend ---
    
    :: Trova e killa processo sulla porta 4000
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do (
        echo [INFO] Terminazione processo PID %%a...
        taskkill /F /PID %%a >nul 2>&1
    )
    
    :: Chiudi finestra con titolo
    taskkill /F /FI "WINDOWTITLE eq %BACKENDTITLE%" /T >nul 2>&1
    
    echo [OK] Backend arrestato
    goto :eof

:startfrontend
    echo.
    echo --- Avvio Frontend ---
    
    :: Verifica porta 5173
    netstat -ano | findstr :5173 >nul 2>&1
    if not errorlevel 1 (
        echo [WARN] Porta 5173 gia' in uso!
        echo [INFO] Tentativo di liberare la porta...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
            taskkill /F /PID %%a >nul 2>&1
        )
        timeout /t 2 /nobreak >nul
    )
    
    :: Verifica dipendenze
    if not exist "%FRONTENDDIR%\node_modules" (
        echo [WARN] Dipendenze frontend non installate!
        echo [INFO] Installazione in corso...
        cd /d "%FRONTENDDIR%"
        npm install
    )
    
    :: Pulisci cache Vite
    cd /d "%FRONTENDDIR%"
    if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" 2>nul
    
    :: Avvia frontend
    echo [INFO] Avvio del server di sviluppo...
    start "%FRONTENDTITLE%" /D "%FRONTENDDIR%" cmd /k "npm run dev"
    timeout /t 5 /nobreak >nul
    
    :: Verifica avvio
    netstat -ano | findstr :5173 >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Frontend non avviato correttamente!
    ) else (
        echo [OK] Frontend avviato su http://localhost:5173
    )
    goto :eof

:stopfrontend
    echo.
    echo --- Arresto Frontend ---
    
    :: Trova e killa processo sulla porta 5173
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        echo [INFO] Terminazione processo PID %%a...
        taskkill /F /PID %%a >nul 2>&1
    )
    
    :: Chiudi finestra con titolo
    taskkill /F /FI "WINDOWTITLE eq %FRONTENDTITLE%" /T >nul 2>&1
    
    echo [OK] Frontend arrestato
    goto :eof

:quickstart
    echo.
    echo --- Quick Start --- 
    call :killallnodesilent
    call :startbackend
    call :startfrontend
    echo.
    echo [INFO] Avvio completato. Controlla le finestre.
    timeout /t 3 /nobreak >nul
    goto :eof

:restartall
    echo.
    echo --- Riavvio Completo --- 
    call :killallnode
    call :startbackend
    call :startfrontend
    echo.
    echo [INFO] Riavvio completato.
    timeout /t 3 /nobreak >nul
    goto :eof

:cleancachelight
    echo.
    echo --- Pulizia Cache Leggera ---
    cd /d "%FRONTENDDIR%"
    if exist "node_modules\.vite" (
        rmdir /s /q "node_modules\.vite" 2>nul
        echo [OK] Cache di Vite rimossa.
    ) else (
        echo [INFO] Nessuna cache di Vite da pulire.
    )
    pause
    goto :eof

:deepcleancachesilent
    if exist "%FRONTENDDIR%\node_modules" rmdir /s /q "%FRONTENDDIR%\node_modules" 2>nul
    if exist "%BACKENDDIR%\node_modules" rmdir /s /q "%BACKENDDIR%\node_modules" 2>nul
    goto :eof

:buildproduction
    echo.
    echo --- Build per Produzione ---
    cd /d "%FRONTENDDIR%"
    npm run build
    if errorlevel 1 (
        echo [ERRORE] Build fallita!
    ) else (
        echo [OK] Build completata. Controlla la cartella 'dist'.
    )
    pause
    goto :eof

:projectinfo
    echo.
    echo --- Informazioni di Debug ---
    echo Percorso Progetto: %PROJECTROOT%
    echo.
    echo --- Contenuto Cartelle ---
    echo Backend: 
    dir "%BACKENDDIR%" /b
    echo.
    echo Frontend:
    dir "%FRONTENDDIR%" /b
    echo.
    echo Data:
    dir "%DATADIR%" /b
    echo.
    echo [3/3] Dipendenze principali installate (Frontend):
    cd /d "%FRONTENDDIR%"
    npm list --depth=0
    cd /d "%PROJECTROOT%"
    echo.

    pause
    goto :eof

:shownodeprocesses
    echo.
    echo --- Processi Node.js Attivi ---
    tasklist | findstr "node.exe"
    echo.
    pause
    goto :eof

:exitscript
    call :killallnode
    exit
