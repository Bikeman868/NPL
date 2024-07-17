set cmd_path=%appdata%\npm\node_modules\npl-cli\installer\win\dist
echo Adding %cmd_path% to your path

for /f "usebackq tokens=2,*" %%A in (`reg query HKCU\Environment /v PATH`) do set user_path=%%B
path|find /i "%cmd_path%" >nul || setx path "%user_path%%cmd_path%;" >nul
path|find /i "%cmd_path%" >nul || set path=%path%%cmd_path%; >nul

npm install -g npl-cli

echo To upgrade the latest version of NPL CLI later, run 
echo npm install -g npl-cli
