npm install -g npl-cli

set install_dir="%userprofile%\.npl"
mkdir "%install_dir%" > nul 2> nul

pushd
cd "%install_dir%"
npm link npl-cli
popd

set cmd_path="%install_dir%\node_modules\npl-cli\installer\win\"
for /f "usebackq tokens=2,*" %%A in (`reg query HKCU\Environment /v PATH`) do set user_path=%%B
path|find /i "%cmd_path%" >nul || setx path "%user_path%;%cmd_path%"
path|find /i "%cmd_path%" >nul || set path="%path%;%cmd_path%"
