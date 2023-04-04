function Custom-Remove-Item
{
	param
	(
		[string]$FileName
	)

	if (test-path $FileName)
	{
		Remove-Item -Recurse -Force $FileName
	}
}

echo "Downloading extension."

Custom-Remove-Item $HOME\banglar-bhumi-utils.zip
Invoke-WebRequest -OutFile $HOME\banglar-bhumi-utils.zip "https://drive.google.com/uc?export=download&id=1OmdtVwRsEFrxAQ78gSsrh-qOi5ApUSTB"
Custom-Remove-Item $HOME\banglar-bhumi-utils
Expand-Archive $HOME\banglar-bhumi-utils.zip -DestinationPath $HOME\banglar-bhumi-utils
Custom-Remove-Item $HOME\banglar-bhumi-utils.zip

function Find-PSFilePathInRegistry
{
	param
	(
		[string]$FileName
	)

	$str = reg query HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\ /s /f \$FileName | findstr Default

	if ($str -match "[A-Z]\:.+$FileName") {
		return @{
			success = $true
			path = $Matches[0]
		}
	}
	else {
		return @{
			success = $false
			path = ""
		}
	}
}

function HandleInstall
{
	param
	(
		[string]$Browser
	)

	$Res = Find-PSFilePathInRegistry ($Browser + ".exe")

	if ($Res.success)
	{
		echo ($Browser + " browser found. Installing extension.")
		Stop-Process -ErrorAction "silentlycontinue" -Name $Browser
		&$Res.path --disable-extensions="$HOME\banglar-bhumi-utils"
		Stop-Process -ErrorAction "silentlycontinue" -Name $Browser
		&$Res.path --load-extension="$HOME\banglar-bhumi-utils"
		echo ("Installed on " + $Browser + ".")
	}
}

echo "Searching for browsers."

HandleInstall brave
HandleInstall chrome

echo "Done"

pause
