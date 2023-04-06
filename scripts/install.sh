$MyPath = $MyInvocation.MyCommand.Path
$CurrentPath = Split-Path $MyPath -Parent

function Custom-Remove-Item
{
	param
	(
		[string] $FileName
	)

	if (test-path $FileName)
	{
		Remove-Item -Recurse -Force $FileName
	}
}

echo "Updating install script."

Custom-Remove-Item $CurrentPath\banglar-bhumi-install-1.ps1
Invoke-WebRequest -OutFile $CurrentPath\banglar-bhumi-install-1.ps1 "https://drive.google.com/uc?export=download&id=1iRBnaGFt2wknC0nUcstWNByTO7E7Fa3i&confirm=t&confirm=t&at=ANzk5s5RKHyRj87kkNq0vw1tiI6V:1680658605664" -Method POST

if ((Get-FileHash $CurrentPath\banglar-bhumi-install-1.ps1).Hash -eq (Get-FileHash $CurrentPath\banglar-bhumi-install.ps1).Hash)
{
	Custom-Remove-Item $CurrentPath\banglar-bhumi-install-1.ps1
	echo "Downloading extension."

	Custom-Remove-Item $HOME\Documents\banglar-bhumi-utils.zip
	Invoke-WebRequest -OutFile $HOME\Documents\banglar-bhumi-utils.zip "https://drive.google.com/uc?export=download&id=1OmdtVwRsEFrxAQ78gSsrh-qOi5ApUSTB"
	Custom-Remove-Item $HOME\Documents\banglar-bhumi-utils
	Expand-Archive $HOME\Documents\banglar-bhumi-utils.zip -DestinationPath $HOME\Documents\banglar-bhumi-utils
	Custom-Remove-Item $HOME\Documents\banglar-bhumi-utils.zip

	echo "Done. Now add the extension manually."

	pause
}
else
{
	Custom-Remove-Item $CurrentPath\banglar-bhumi-install.ps1
	Move-Item -Path $CurrentPath\banglar-bhumi-install-1.ps1 -Destination $CurrentPath\banglar-bhumi-install.ps1 -Force
	Clear-Host
	.\banglar-bhumi-install.ps1
}
